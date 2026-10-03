/**
 * This file contains the core gameplay logic for the application.
 * It handles user input, game state updates, and interactions between game elements.
 *
 * Note: This might be refactored in the future to separate concerns more clearly (i.e. a separate file for the shotgun logic, gameplay loop, etc.).
 * However, for the current scope of the project, this file serves as the main hub for gameplay-related functionality.
 */

function updateCell(cell) {
  if (win || !shotgunPickedUp) {
    return;
  }

  const index = Array.from(cell.parentNode.children).indexOf(cell);

  if (grid[index] != null) {
    animateDealerText(chooseRandomDialogue("occupied"), 1000, 800);
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
    animateDealerText(chooseRandomDialogue("blank"), 1000, 800);
  }

  resetShotgun();

  if (shells.length === 1) {
    shells = loadShotgun();
  } else {
    shells.shift();
  }

  switchTurn();
}

function switchTurn() {
  if (!skipTurn) {
    dealerTurn = true;

    // Dealer's turn logic can be implemented here if needed
    animateDealerText("Dealer's turn!", 1000, 800).finally(() => {
      dealerTurn = false;
    });
  } else {
    animateDealerText(chooseRandomDialogue("skip"), 1000, 800);
    skipTurn = false;
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

function pumpShotgun(viewOnly = false) {
  pumpAnimating = true;
  let currentShell;

  if (!viewOnly) {
    currentShell = shells.shift();
    resetShotgun();

    if (currentShell !== "blank") {
      animateDealerText(chooseRandomDialogue("live"), 1000, 800);
      switchTurn();
    } else {
      animateDealerText(chooseRandomDialogue("eject"), 1000, 800);
    }
  } else {
    currentShell = shells[0];
  }

  elements.shellLoader.innerHTML = "";

  const motionProfile = createShellMotionProfile();
  const img = createShellElement(currentShell, motionProfile);
  elements.shellLoader.appendChild(img);

  setTimeout(() => {
    img.classList.add("is-visible");
  }, 50);

  setTimeout(() => {
    img.classList.remove("is-visible");
    img.classList.add("is-loading");
  }, 1000);

  setTimeout(() => {
    elements.shellLoader.innerHTML = "";
  }, 1380);

  setTimeout(() => {
    if (shells.length === 0) {
      shells = loadShotgun();
    }
    pumpAnimating = false;
  }, 1500);
}

function pickupShotgun() {
  if (
    shotgunPickedUp ||
    reloading ||
    pumpAnimating ||
    dealerTextAnimating ||
    dealerTurn
  ) {
    return;
  }

  shotgunPickedUp = true;
  setAimingMode(true);

  const gridBounds = getGridBounds();
  setAimPosition(
    gridBounds.left + gridBounds.width / 2,
    gridBounds.top + gridBounds.height / 2,
  );

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

  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
}

function loadShotgun(generateItem = true) {
  reloading = true;

  for (let i = 0; i < itemsPerRound; i++) {
    addItem(generateItem);
  }

  shells = createRandomShellSet();

  const uniqueShells = new Set(shells);
  if (!uniqueShells.has("x") || !uniqueShells.has("o")) {
    return loadShotgun(false);
  }

  const sortedShells = sortShellsForDisplay(shells);
  const shellMotionProfiles = sortedShells.map(() =>
    createShellMotionProfile(),
  );

  renderShellTray(sortedShells, shellMotionProfiles);

  const loadStartDelay =
    (sortedShells.length - 1) * SHELL_TIMINGS.dropDelay +
    SHELL_TIMINGS.dropDuration +
    SHELL_TIMINGS.settleDelay;
  const loadEndDelay =
    loadStartDelay +
    (sortedShells.length - 1) * SHELL_TIMINGS.loadDelay +
    SHELL_TIMINGS.loadDuration;

  chamberShellsIntoShotgun(sortedShells, loadStartDelay, loadEndDelay);

  setTimeout(() => {
    reloading = false;
  }, loadEndDelay);

  return shells;
}

function addItem(generateItem = true) {
  if (!generateItem) {
    return null;
  }

  if (items.every((item) => item !== null)) {
    return null;
  }

  const newItem = availableItems[randint(0, availableItems.length - 1)];
  const emptySlot = items.findIndex((item) => item === null);
  items[emptySlot] = newItem;
  updateInventoryDisplay(newItem, emptySlot);
  return { newItem, emptySlot };
}

function createRandomShellSet() {
  const shellCount = randint(2, 5);

  return Array.from(
    { length: shellCount },
    () => SHELL_TYPES[randint(0, SHELL_TYPES.length - 1)],
  );
}

function sortShellsForDisplay(shells) {
  return [...shells].sort((a, b) => SHELL_PRIORITY[a] - SHELL_PRIORITY[b]);
}

function chamberShellsIntoShotgun(sortedShells, loadStartDelay, loadEndDelay) {
  const shellLoader = elements.shellLoader;

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
}

function updateHealth(increment) {
  health = Math.max(0, Math.min(health + increment, MAX_HEALTH));
  updateHealthDisplay();
}
