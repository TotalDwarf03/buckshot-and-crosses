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
const MAX_HEALTH = 5;
const SHELL_TYPES = ["x", "o", "blank"];
const SHELL_PRIORITY = { x: 1, o: 2, blank: 3 };
const SHELL_TIMINGS = {
  dropDelay: 220,
  dropDuration: 700,
  settleDelay: 350,
  loadDelay: 165,
  loadDuration: 340,
};

const elements = {
  grid: document.getElementById("grid"),
  gameContainer: document.getElementById("game-container"),
  shellContainer: document.getElementById("shell-container"),
  shellLoader: document.getElementById("shell-loader"),
  shotgunContainer: document.getElementById("shotgun-container"),
  shotgunImage: document.getElementById("shotgun-image"),
  healthBar: document.getElementById("health-bar"),
  crosshair: document.getElementById("crosshair"),
  vignette: document.getElementById("vignette"),
};

let items = Array(3).fill(null);

let health = 3;

let previousShot;

const availableItems = [
  // "custom-handcuffs",
  "custom-flashlight",
  "cigarette-pack",
  "strange-contraption",
  "expired-vodka",
];

window.addEventListener("DOMContentLoaded", () => {
  setupGlobalEventHandlers();
  setupInteractionHandlers();
  updateHealthDisplay();

  setTimeout(() => {
    shells = loadShotgun();
  }, 1000);
});

function setupGlobalEventHandlers() {
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
}

function setupInteractionHandlers() {
  elements.grid.addEventListener("click", (event) => {
    const targetCell = event.target.closest(".grid-item");

    if (targetCell) {
      updateCell(targetCell);
    }
  });

  elements.shotgunImage.addEventListener("click", pickupShotgun);
}

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
  return elements.grid.getBoundingClientRect();
}

function setAimingMode(isAiming) {
  elements.crosshair.hidden = !isAiming;
  elements.vignette.hidden = !isAiming;
  elements.gameContainer.classList.toggle("aiming", isAiming);
  document.body.classList.toggle("aiming", isAiming);
  elements.shellContainer.classList.toggle("aiming", isAiming);
  elements.shotgunContainer.classList.toggle("aiming", isAiming);
}

function setAimPosition(clientX, clientY) {
  const gridBounds = getGridBounds();
  const aimX = clamp(clientX, gridBounds.left, gridBounds.right);
  const aimY = clamp(clientY, gridBounds.top, gridBounds.bottom);

  currentAimPoint = { x: aimX, y: aimY };
  elements.crosshair.style.left = `${aimX - CROSSHAIR_OFFSET_X}px`;
  elements.crosshair.style.top = `${aimY - CROSSHAIR_OFFSET_Y}px`;
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

function pumpShotgun(viewOnly = false) {
  pumpAnimating = true;
  let currentShell;

  if (!viewOnly) {
    // Remove the current shell and reveal it to the player
    currentShell = shells.shift();

    // Reset the shotgun and animate the shell being ejected from the shotgun
    resetShotgun();
  } else {
    currentShell = shells[0];
  }

  // Show the shell in the shell loader
  const shellLoader = elements.shellLoader;
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
    previousShot = { cell, index };

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
  for (const combination of WINNING_COMBINATIONS) {
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
  setAimingMode(true);

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
  setAimingMode(false);

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
  let shells = [];
  reloading = true;

  // Draw a new item
  if (generateItem) {
    const newItem = addItem();

    if (newItem) {
      updateInventoryDisplay(newItem.newItem, newItem.emptySlot);
    }
  }

  // Load anywhere between 2 and 5 shells into the shotgun, with a random distribution of 'x', 'o', and 'blank' shells
  const shellCount = randint(2, 5);

  shells = Array.from(
    { length: shellCount },
    () => SHELL_TYPES[randint(0, SHELL_TYPES.length - 1)],
  );

  // Verify that the shotgun has at least 1 x and 1 o shell
  const uniqueShells = new Set(shells);
  if (!uniqueShells.has("x") || !uniqueShells.has("o")) {
    // If not, reload the shotgun with a new random distribution of shells
    return loadShotgun(false);
  }

  // Sort the shells so that the display doesn't match the order they will be loaded into the shotgun
  const sortedShells = [...shells].sort(
    (a, b) => SHELL_PRIORITY[a] - SHELL_PRIORITY[b],
  );
  const shellMotionProfiles = sortedShells.map(() =>
    createShellMotionProfile(),
  );

  // Display the shells in the shell loader
  const shellLoader = elements.shellLoader;

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
    }, index * SHELL_TIMINGS.dropDelay);
  });

  const loadStartDelay =
    (sortedShells.length - 1) * SHELL_TIMINGS.dropDelay +
    SHELL_TIMINGS.dropDuration +
    SHELL_TIMINGS.settleDelay;
  const loadEndDelay =
    loadStartDelay +
    (sortedShells.length - 1) * SHELL_TIMINGS.loadDelay +
    SHELL_TIMINGS.loadDuration;

  // Animate the shells being loaded into the shotgun after they finish dropping into the tray.
  setTimeout(() => {
    shellLoader.classList.add("is-chambering");

    sortedShells.forEach((shell, index) => {
      const reverseIndex = sortedShells.length - 1 - index;

      setTimeout(() => {
        const shellImage = shellLoader.children[reverseIndex];
        shellImage.classList.remove("is-visible");
        shellImage.classList.add("is-loading");
      }, index * SHELL_TIMINGS.loadDelay);
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
    itemElement.dataset.slot = String(emptySlot);
    slotToUpdate.appendChild(itemElement);
  }
}

function updateHealth(increment) {
  health = Math.max(0, Math.min(health + increment, MAX_HEALTH));
  updateHealthDisplay();
}

function updateHealthDisplay() {
  const healthBar = elements.healthBar;
  healthBar.innerHTML = "";

  // Display the current health points up to a maximum of 5
  for (let i = 0; i < health; i++) {
    const heartImage = document.createElement("img");
    heartImage.src = "assets/health-point.png";
    heartImage.alt = "health point";
    heartImage.className = "health-point";
    healthBar.appendChild(heartImage);
  }
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
