/**
 * This file contains the core gameplay logic for the application.
 * It handles turn flow and win resolution.
 */

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function updateCell(cell) {
  return queueAction(() => performUpdateCell(cell));
}

function getCellIndex(cell) {
  return Array.from(cell.parentNode.children).indexOf(cell);
}

function applyShotToCell(cell, index) {
  previousShot = { cell, index };
  grid[index] = shells[0];
  renderCellMark(cell, shells[0]);
  resetShotgun();
}

async function handleDealerRoundWin() {
  if (health !== 1) {
    await animateDealerText(chooseRandomDialogue("dealerWin"), 1000, 800);
    updateHealth(-1);

    // Empty the grid and update the UI
    resetGrid();
    await performLoadShotgun();
    await performSwitchTurn();
    return true;
  }

  await animateDealerText(chooseRandomDialogue("gameLose"), 1000, 800);
  updateHealth(-1);

  elements.statusText.textContent = "You're lucky he's letting you live...";
  elements.endScreen.classList.add("is-visible");
  return true;
}

async function handlePlayerRoundWin() {
  winCounter++;
  updateTableBackdrop(winCounter);

  if (winCounter !== 2) {
    await animateDealerText(chooseRandomDialogue("playerWin"), 1000, 800);
    resetGrid();
    await performLoadShotgun();
    return true;
  }

  // Player has won 2 rounds, they win the game
  await animateDealerText(chooseRandomDialogue("gameWin"), 1000, 800);

  elements.briefcase.disabled = false;
  elements.briefcase.classList.add("is-visible");
  return true;
}

async function handleShotOutcome() {
  win = checkWin();

  if (win === "win") {
    return dealerTurn ? handleDealerRoundWin() : handlePlayerRoundWin();
  }

  if (win === "draw") {
    await animateDealerText(chooseRandomDialogue("reset"), 1000, 800);

    // Empty the grid and update the UI
    resetGrid();
    await performLoadShotgun();
    await performSwitchTurn();
    return true;
  }

  return false;
}

async function handleBlankShot() {
  resetShotgun();

  if (dealerTurn) {
    await animateDealerText(chooseRandomDialogue("mistake"), 1000, 800);
    return;
  }

  await animateDealerText(chooseRandomDialogue("blank"), 1000, 800);
}

async function finalizeShotTurn() {
  if (shells.length === 1) {
    // If shotgun empty, new round starts
    await performLoadShotgun();
    await performSwitchTurn();
    return;
  }

  shells.shift();
  await performSwitchTurn();
}

async function performUpdateCell(cell) {
  if ((win || !shotgunPickedUp) && !dealerTurn) {
    return;
  }

  const index = getCellIndex(cell);

  if (grid[index] != null) {
    await animateDealerText(chooseRandomDialogue("occupied"), 1000, 800);
    return;
  }

  if (shells[0] === "blank") {
    await handleBlankShot();
  } else {
    applyShotToCell(cell, index);

    if (await handleShotOutcome()) {
      return;
    }
  }

  await finalizeShotTurn();
}

function resetGrid() {
  grid = Array(9).fill(null);
  elements.grid.querySelectorAll(".cell-mark").forEach((mark) => {
    mark.remove();
  });
  win = null;
}

async function handTurnToPlayer() {
  dealerTurn = false;
  console.log("Dealer's turn ended. Player's turn now.");
  await animateDealerText(chooseRandomDialogue("playerTurn"), 1000, 800);
  console.log("Post text animation. Player's turn now.");
}

async function handTurnToDealer() {
  dealerTurn = true;
  console.log("Dealer's turn: ", dealerTurn);
  console.log("Starting new dealer turn action sequence...");
  await performActionDealerTurn();
}

async function performSwitchTurn() {
  console.log(
    "Switching turn. Dealer turn:",
    dealerTurn,
    "Skip turn:",
    skipTurn,
  );

  if (dealerTurn) {
    await handTurnToPlayer();
    return;
  }

  if (skipTurn) {
    await animateDealerText(chooseRandomDialogue("skip"), 1000, 800);
    skipTurn = false;
    return;
  }

  await handTurnToDealer();
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

function updateHealth(increment) {
  health = Math.max(0, Math.min(health + increment, MAX_HEALTH));
  updateHealthDisplay();
}
