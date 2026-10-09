/**
 * This file contains the core gameplay logic for the application.
 * It handles user input, game state updates, and interactions between game elements.
 *
 * Note: This might be refactored in the future to separate concerns more clearly (i.e. a separate file for the shotgun logic, gameplay loop, etc.).
 * However, for the current scope of the project, this file serves as the main hub for gameplay-related functionality.
 */

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function updateCell(cell) {
  return queueAction(() => performUpdateCell(cell));
}

async function performUpdateCell(cell) {
  if ((win || !shotgunPickedUp) && !dealerTurn) {
    return;
  }

  const index = Array.from(cell.parentNode.children).indexOf(cell);

  if (grid[index] != null) {
    await animateDealerText(chooseRandomDialogue("occupied"), 1000, 800);
    return;
  }

  if (shells[0] !== "blank") {
    previousShot = { cell, index };

    grid[index] = shells[0];
    renderCellMark(cell, shells[0]);

    resetShotgun();

    win = checkWin();

    if (win === "win") {
      if (dealerTurn) {
        if (health !== 1) {
          await animateDealerText(chooseRandomDialogue("dealerWin"), 1000, 800);
          updateHealth(-1);

          // Empty the grid and update the UI
          resetGrid();
          await performLoadShotgun();
          await performSwitchTurn();
          return;
        } else {
          await animateDealerText(chooseRandomDialogue("gameLose"), 1000, 800);
          updateHealth(-1);

          // TODO: Decide what happens here when the player loses.
          return;
        }
      } else {
        winCounter++;
        updateTableBackdrop(winCounter);

        if (winCounter !== 2) {
          await animateDealerText(chooseRandomDialogue("playerWin"), 1000, 800);
          resetGrid();
          await performLoadShotgun();
          return;
        } else {
          // Player has won 2 rounds, they win the game
          await animateDealerText(chooseRandomDialogue("gameWin"), 1000, 800);

          // TODO: Decide what happens here when the player wins.
        }
      }
    } else if (win === "draw") {
      await animateDealerText(chooseRandomDialogue("reset"), 1000, 800);

      // Empty the grid and update the UI
      resetGrid();
      await performLoadShotgun();
      return;
    }
  } else {
    resetShotgun();
    if (dealerTurn) {
      await animateDealerText(chooseRandomDialogue("mistake"), 1000, 800);
    } else {
      await animateDealerText(chooseRandomDialogue("blank"), 1000, 800);
    }
  }

  if (shells.length === 1) {
    // If shotgun empty, new round starts
    await performLoadShotgun();
    await performSwitchTurn();
    return;
  }

  shells.shift();
  await performSwitchTurn();
}

function resetGrid() {
  grid = Array(9).fill(null);
  elements.grid.querySelectorAll(".cell-mark").forEach((mark) => {
    mark.remove();
  });
  win = null;
}

function switchTurn() {
  return queueAction(() => performSwitchTurn());
}

async function performSwitchTurn() {
  console.log(
    "Switching turn. Dealer turn:",
    dealerTurn,
    "Skip turn:",
    skipTurn,
  );
  if (dealerTurn) {
    dealerTurn = false;
    console.log("Dealer's turn ended. Player's turn now.");
    await animateDealerText(chooseRandomDialogue("playerTurn"), 1000, 800);
    console.log("Post text animation. Player's turn now.");
  } else {
    if (!skipTurn) {
      dealerTurn = true;

      console.log("Dealer's turn: ", dealerTurn);
      console.log("Starting new dealer turn action sequence...");
      await performActionDealerTurn();
    } else {
      await animateDealerText(chooseRandomDialogue("skip"), 1000, 800);
      skipTurn = false;
    }
  }
}

function checkWin() {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    const gridStatus = [grid[a], grid[b], grid[c]];
    const uniqueValues = new Set(gridStatus);

    if (uniqueValues.size === 1 && !uniqueValues.has(null)) {
      return "win";
    }
  }

  if (!grid.includes(null)) {
    return "draw";
  }

  return null;
}

function pumpShotgun(itemUsed = null) {
  return queueAction(() => performPumpShotgun(itemUsed));
}

async function performPumpShotgun(itemUsed = null) {
  pumpAnimating = true;
  let currentShell;

  switch (itemUsed) {
    case "expired-vodka":
      // pump the shotgun without switching turn
      currentShell = shells.shift();
      break;

    case "custom-flashlight":
      // pump the shotgun without spending the shell
      // we only want to show the current shell without removing it
      currentShell = shells[0];
      break;

    default:
      // If pumped by player or dealer, remove the shell and clear the shotgun UI.
      currentShell = shells.shift();
      resetShotgun();

      break;
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

  await delay(1500);

  if (itemUsed === "expired-vodka" || itemUsed === "custom-flashlight") {
    pumpAnimating = false;
    return;
  }

  if (currentShell !== "blank") {
    if (dealerTurn) {
      await animateDealerText(chooseRandomDialogue("mistake"), 1000, 800);
      console.log("Dealer pump mistake");
    } else {
      await animateDealerText(chooseRandomDialogue("live"), 1000, 800);
    }

    if (shells.length === 0) {
      await performLoadShotgun();
    }

    pumpAnimating = false;

    await performSwitchTurn();
  } else {
    if (dealerTurn) {
      // If blank pump on dealer turn, dealer takes another

      if (shells.length === 0) {
        await performLoadShotgun();
        pumpAnimating = false;
      }
      console.log("Dealer pump blank, taking another turn");
      await performActionDealerTurn();
    } else {
      // If blank pump on player turn, just show dialogue
      // Player can then take another turn
      await animateDealerText(chooseRandomDialogue("eject"), 1000, 800);

      if (shells.length === 0) {
        await performLoadShotgun();
        pumpAnimating = false;
      }
    }
  }
}

function pickupShotgun() {
  if (
    shotgunPickedUp ||
    reloading ||
    pumpAnimating ||
    actionQueueRunning ||
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
  return queueAction(() => performLoadShotgun(generateItem));
}

async function performLoadShotgun(generateItem = true) {
  reloading = true;

  // When loading the shotgun, this indicates a new round.
  // The player should always go first here.
  // dealerTurn = false;

  for (let i = 0; i < itemsPerRound; i++) {
    addItem(generateItem);
  }

  shells = createRandomShellSet();

  const uniqueShells = new Set(shells);
  if (!uniqueShells.has("x") || !uniqueShells.has("o")) {
    return performLoadShotgun(false);
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

  await delay(loadEndDelay);

  reloading = false;

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

function calculateShellProbabilities(shellType) {
  const totalShells = shells.length;
  return shells.filter((shell) => shell === shellType).length / totalShells;
}

function findWinningCells(shellType) {
  // Get all of the winning combinations which contain the free cells
  const winningCombinations = WINNING_COMBINATIONS.filter((combination) =>
    combination.some((index) => grid[index] === null),
  );

  let validWinningCombinations = [];

  // Translate combination indexes to actual cell elements
  winningCombinations.forEach((combination) => {
    const currentCombinationValues = combination.map((index) => grid[index]);
    const hasTwoOfSameType =
      currentCombinationValues.filter((value) => value === shellType).length ===
      2;

    if (hasTwoOfSameType) {
      validWinningCombinations.push(combination);
    }
  });

  let winningCells = [];

  if (validWinningCombinations.length > 0) {
    // If there's a winning combination, find the empty cell in that combination and add it to the winningCells array
    validWinningCombinations.forEach((combination) => {
      const emptyCellIndex = combination.find((index) => grid[index] === null);
      const emptyCell = elements.grid.children[emptyCellIndex];
      winningCells.push(emptyCell);
    });
  }

  return winningCells;
}

function selectRandomCell(cellOptions) {
  return cellOptions[randint(0, cellOptions.length - 1)];
}

function actionDealerTurn() {
  return queueAction(() => performActionDealerTurn());
}

async function performActionDealerTurn() {
  await delay(1000); // Simulate dealer thinking time

  const chances = {
    x: calculateShellProbabilities("x"),
    o: calculateShellProbabilities("o"),
    blank: calculateShellProbabilities("blank"),
  };

  const highestChanceType = Object.keys(chances).reduce((a, b) =>
    chances[a] > chances[b] ? a : b,
  );

  console.log("Dealer's shell probabilities:", chances);
  console.log("Dealer's highest chance shell type:", highestChanceType);

  // If x or o, need to shoot a cell
  if (["x", "o"].includes(highestChanceType)) {
    const unoccupiedCells = Array.from(elements.grid.children).filter(
      (cell, index) => grid[index] === null,
    );
    const winningCells = findWinningCells(highestChanceType);
    const defensiveCells = findWinningCells(
      highestChanceType === "x" ? "o" : "x",
    );

    if (winningCells.length > 0) {
      // If there's a winning combination, pick a random cell from the winningCells array
      console.log("Dealer has a winning move!");
      await performUpdateCell(selectRandomCell(winningCells));
      return;
    } else if (defensiveCells.length > 0) {
      // If there's a defensive combination, pick a random cell from the defensiveCells array
      console.log("Dealer has a defensive move!");
      await performUpdateCell(selectRandomCell(defensiveCells));
      return;
    }

    // If no winning combinations, just pick a random unoccupied cell
    console.log("Dealer has no winning or defensive moves.");
    await performUpdateCell(selectRandomCell(unoccupiedCells));
  } else {
    // If blank, just pump the shotgun
    console.log("Dealer has a blank shell. Pumping shotgun.");
    console.log("Real Shell: ", shells[0]);
    await performPumpShotgun();
  }
}
