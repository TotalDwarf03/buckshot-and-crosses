let grid = Array(9).fill(null);
let win = null;
let crosshairListener = null;
let shotgunClickListener = null;
let pumpListener = null;
let shotgunPickedUp = false;
let shells;
let reloading = false;
let pumpAnimating = false;
let currentAimPoint = null;

const CROSSHAIR_OFFSET_X = 817.5;
const CROSSHAIR_OFFSET_Y = 210;

let items = Array(3).fill(null);

document.addEventListener("pointerlockchange", () => {
  if (shotgunPickedUp && document.pointerLockElement == null) {
    resetShotgun();
  }
});

document.addEventListener("keydown", (event) => {
  if (shotgunPickedUp && event.key === "Escape") {
    resetShotgun();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    shells = loadShotgun();
  }, 1000);
});

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomUnit(min, max, unit, precision = 2) {
  return `${randomFloat(min, max).toFixed(precision)}${unit}`;
}

function createShellMotionProfile() {
  return {
    dropX: randomUnit(-1.8, 1.8, "rem"),
    dropRotate: randomUnit(-13, 13, "deg", 1),
    restX: randomUnit(-0.4, 0.4, "rem"),
    restY: randomUnit(-0.08, 0.08, "rem"),
    restRotate: randomUnit(-2.2, 2.2, "deg", 1),
    loadX: randomUnit(7.6, 9.6, "rem"),
    loadY: randomUnit(-1.6, -0.55, "rem"),
    loadRotate: randomUnit(10, 19, "deg", 1),
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getGridBounds() {
  return document.getElementById("grid").getBoundingClientRect();
}

function setAimPosition(clientX, clientY) {
  const gridBounds = getGridBounds();
  const crosshair = document.getElementById("crosshair");
  const aimX = clamp(clientX, gridBounds.left, gridBounds.right);
  const aimY = clamp(clientY, gridBounds.top, gridBounds.bottom);

  currentAimPoint = { x: aimX, y: aimY };
  crosshair.style.left = `${aimX - CROSSHAIR_OFFSET_X}px`;
  crosshair.style.top = `${aimY - CROSSHAIR_OFFSET_Y}px`;
}

function getAimedGridCell() {
  if (!currentAimPoint) {
    return null;
  }

  const aimedElement = document.elementFromPoint(
    currentAimPoint.x,
    currentAimPoint.y,
  );
  return aimedElement?.closest(".grid-item") ?? null;
}

function renderCellMark(cell, mark) {
  cell.textContent = "";

  const markImage = document.createElement("img");
  markImage.src = `assets/bullet-holes/${mark}.png`;
  markImage.alt = mark.toUpperCase();
  markImage.className = "cell-mark";

  cell.appendChild(markImage);
}

function createShellElement(shellType, motionProfile) {
  const img = document.createElement("img");
  img.src = `assets/shells/${shellType}-shell.png`;
  img.alt = "Cartridge";
  img.className = "shell-image";
  img.style.setProperty("--shell-drop-x", motionProfile.dropX);
  img.style.setProperty("--shell-drop-rotate", motionProfile.dropRotate);
  img.style.setProperty("--shell-rest-x", motionProfile.restX);
  img.style.setProperty("--shell-rest-y", motionProfile.restY);
  img.style.setProperty("--shell-rest-rotate", motionProfile.restRotate);
  img.style.setProperty("--shell-load-x", motionProfile.loadX);
  img.style.setProperty("--shell-load-y", motionProfile.loadY);
  img.style.setProperty("--shell-load-rotate", motionProfile.loadRotate);
  return img;
}

function pumpShotgun() {
  if (!shotgunPickedUp || reloading || shells.length === 0) {
    return;
  }

  pumpAnimating = true;

  // Remove the current shell and reveal it to the player
  const currentShell = shells.shift();

  // Reset the shotgun and animate the shell being ejected from the shotgun
  resetShotgun();

  // Show the shell in the shell loader
  const shellLoader = document.getElementById("shell-loader");
  shellLoader.innerHTML = "";

  const motionProfile = createShellMotionProfile();
  const img = createShellElement(currentShell, motionProfile);
  shellLoader.appendChild(img);

  setTimeout(() => {
    img.classList.add("is-visible");
  }, 50);

  // Animate the shell being ejected from the shotgun after a short delay
  setTimeout(() => {
    img.classList.remove("is-visible");
    img.classList.add("is-loading");
  }, 1000);

  // Remove the shell from the shell loader after the ejection animation is complete
  // Animation duration is 340ms, so wait 1000ms + 340ms = 1340ms, plus a small buffer
  setTimeout(() => {
    shellLoader.innerHTML = "";
  }, 1380);

  // If there is only one shell left, reload the shotgun
  setTimeout(() => {
    if (shells.length === 0) {
      shells = loadShotgun();
    }
    pumpAnimating = false;
  }, 1500);
}

function updateCell(cell) {
  if (win || !shotgunPickedUp) {
    return;
  }

  const index = Array.from(cell.parentNode.children).indexOf(cell);

  if (grid[index] != null) {
    alert("Cell is already occupied!");
    return;
  }

  if (shells[0] !== "blank") {
    grid[index] = shells[0];
    renderCellMark(cell, shells[0]);

    win = checkWin();

    if (win) {
      alert(win);
      resetShotgun();
      return;
    }
  } else {
    alert("Blank shell! You missed your shot!");
  }

  resetShotgun();

  // Remove fired shell from the shotgun
  // If there is only one shell left, reload the shotgun
  if (shells.length === 1) {
    shells = loadShotgun();
  } else {
    shells.shift(); // Remove the first shell from the shotgun
  }
}

function checkWin() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    const gridStatus = [grid[a], grid[b], grid[c]];

    const uniqueValues = new Set(gridStatus);

    if (uniqueValues.size === 1 && !uniqueValues.has(null)) {
      return `${grid[a]} wins!`;
    }
  }

  if (!grid.includes(null)) {
    return "Draw";
  }

  return null;
}

function pickupShotgun() {
  if (shotgunPickedUp || reloading || pumpAnimating) return;

  shotgunPickedUp = true;
  const vignette = document.getElementById("vignette");
  const gameContainer = document.getElementById("game-container");

  // Make a crosshair appear, following the mouse cursor
  const crosshair = document.getElementById("crosshair");
  crosshair.hidden = false;

  // Show vignette and apply zoom/shake effects
  vignette.hidden = false;
  gameContainer.classList.add("aiming");
  document.body.classList.add("aiming");
  document.getElementById("shell-container").classList.add("aiming");
  document.getElementById("shotgun-container").classList.add("aiming");

  // Set the initial aim position to the center of the grid
  const gridBounds = getGridBounds();
  setAimPosition(
    gridBounds.left + gridBounds.width / 2,
    gridBounds.top + gridBounds.height / 2,
  );

  // Setup listener for mouse movement to update the crosshair position
  if (crosshairListener) {
    document.removeEventListener("mousemove", crosshairListener);
  }

  crosshairListener = (event) => {
    if (document.pointerLockElement) {
      setAimPosition(
        currentAimPoint.x + event.movementX,
        currentAimPoint.y + event.movementY,
      );
      return;
    }

    setAimPosition(event.clientX, event.clientY);
  };

  document.addEventListener("mousemove", crosshairListener);

  // Setup listener for mouse click to fire the shotgun
  if (shotgunClickListener) {
    document.removeEventListener("click", shotgunClickListener, true);
  }

  shotgunClickListener = (event) => {
    if (!shotgunPickedUp) {
      return;
    }

    const targetCell = getAimedGridCell();

    if (!targetCell) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    updateCell(targetCell);
  };

  document.addEventListener("click", shotgunClickListener, true);

  // Setup listener for spacebar to pump the shotgun
  if (pumpListener) {
    document.removeEventListener("keydown", pumpListener);
  }

  pumpListener = (event) => {
    if (event.code === "Space" && shotgunPickedUp) {
      event.preventDefault();
      pumpShotgun();
    }
  };

  document.addEventListener("keydown", pumpListener);

  if (document.body.requestPointerLock) {
    document.body.requestPointerLock();
  }
}

function resetShotgun() {
  shotgunPickedUp = false;
  currentAimPoint = null;

  const vignette = document.getElementById("vignette");
  const gameContainer = document.getElementById("game-container");

  // Hide the crosshair
  const crosshair = document.getElementById("crosshair");
  crosshair.hidden = true;

  // Hide vignette and remove zoom/shake effects
  vignette.hidden = true;
  gameContainer.classList.remove("aiming");
  document.body.classList.remove("aiming");
  document.getElementById("shell-container").classList.remove("aiming");
  document.getElementById("shotgun-container").classList.remove("aiming");

  // Remove listeners for mouse movement and click events
  if (crosshairListener) {
    document.removeEventListener("mousemove", crosshairListener);
    crosshairListener = null;
  }

  if (shotgunClickListener) {
    document.removeEventListener("click", shotgunClickListener, true);
    shotgunClickListener = null;
  }

  if (pumpListener) {
    document.removeEventListener("keydown", pumpListener);
    pumpListener = null;
  }

  // Exit pointer lock if it's currently active (Give the user back control of the mouse)
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
}

function loadShotgun(generateItem = true) {
  const shellDropDelay = 220;
  const shellDropDuration = 700;
  const shellSettleDelay = 350;
  const shellLoadDelay = 165;
  const shellLoadDuration = 340;

  let shells = [];
  reloading = true;

  // Draw a new item
  if (generateItem) {
    const newItem = addItem();

    if (newItem) {
      updateInventoryDisplay(newItem.newItem, newItem.emptySlot);
    }
  }

  // Load anywhere between 2 and 7 shells into the shotgun, with a random distribution of 'x', 'o', and 'blank' shells
  const shellCount = randint(2, 7);

  for (let i = 0; i < shellCount; i++) {
    switch (randint(1, 3)) {
      case 1:
        shells.push("x");
        break;
      case 2:
        shells.push("o");
        break;
      case 3:
        shells.push("blank");
        break;
    }
  }

  // Verify that the shotgun has at least 1 x and 1 o shell
  const uniqueShells = new Set(shells);
  if (!uniqueShells.has("x") || !uniqueShells.has("o")) {
    // If not, reload the shotgun with a new random distribution of shells
    return loadShotgun((generateItem = false));
  }

  // Sort the shells so that the display doesn't match the order they will be loaded into the shotgun
  const shellPriority = { x: 1, o: 2, blank: 3 };
  const sortedShells = [...shells].sort(
    (a, b) => shellPriority[a] - shellPriority[b],
  );
  const shellMotionProfiles = sortedShells.map(() =>
    createShellMotionProfile(),
  );

  // Display the shells in the shell loader
  const shellLoader = document.getElementById("shell-loader");

  shellLoader.innerHTML = "";

  sortedShells.forEach((shell, index) => {
    const motionProfile = shellMotionProfiles[index];
    const img = createShellElement(shell, motionProfile);
    shellLoader.appendChild(img);
  });

  sortedShells.forEach((shell, index) => {
    setTimeout(() => {
      const reverseIndex = sortedShells.length - 1 - index;
      const shellImage = shellLoader.children[reverseIndex];
      shellImage.classList.add("is-visible");
    }, index * shellDropDelay);
  });

  const loadStartDelay =
    (sortedShells.length - 1) * shellDropDelay +
    shellDropDuration +
    shellSettleDelay;
  const loadEndDelay =
    loadStartDelay +
    (sortedShells.length - 1) * shellLoadDelay +
    shellLoadDuration;

  // Animate the shells being loaded into the shotgun after they finish dropping into the tray.
  setTimeout(() => {
    shellLoader.classList.add("is-chambering");

    sortedShells.forEach((shell, index) => {
      const reverseIndex = sortedShells.length - 1 - index;

      setTimeout(() => {
        const shellImage = shellLoader.children[reverseIndex];
        shellImage.classList.remove("is-visible");
        shellImage.classList.add("is-loading");
      }, index * shellLoadDelay);
    });
  }, loadStartDelay);

  setTimeout(() => {
    shellLoader.classList.remove("is-chambering");
  }, loadEndDelay);

  // Reset reloading state after all animations are complete
  setTimeout(() => {
    reloading = false;
  }, loadEndDelay);

  return shells;
}

function addItem() {
  const availableItems = [
    "custom-handcuffs",
    "custom-flashlight",
    "cigarette-pack",
    "strange-contraption",
    "expired-vodka",
  ];

  if (items.every((item) => item !== null)) {
    return null;
  }

  const newItem = availableItems[randint(0, availableItems.length - 1)];
  const emptySlot = items.findIndex((item) => item === null);
  items[emptySlot] = newItem;
  return { newItem, emptySlot };
}

function updateInventoryDisplay(newItem, emptySlot) {
  const slotToUpdate = document.getElementById(`item-slot-${emptySlot + 1}`);
  slotToUpdate.innerHTML = "";

  if (newItem) {
    const itemElement = document.createElement(newItem);
    slotToUpdate.appendChild(itemElement);
  }
}
