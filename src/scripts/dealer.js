/**
 * This file contains dealer decision-making and dealer turn execution.
 */

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

function getDealerShellChances() {
  return {
    x: calculateShellProbabilities("x"),
    o: calculateShellProbabilities("o"),
    blank: calculateShellProbabilities("blank"),
  };
}

function getHighestChanceShellType(chances) {
  return Object.keys(chances).reduce((a, b) =>
    chances[a] > chances[b] ? a : b,
  );
}

function getUnoccupiedCells() {
  return Array.from(elements.grid.children).filter(
    (cell, index) => grid[index] === null,
  );
}

function chooseDealerTargetCell(shellType) {
  const winningCells = findWinningCells(shellType);

  if (winningCells.length > 0) {
    console.log("Dealer has a winning move!");
    return selectRandomCell(winningCells);
  }

  const defensiveCells = findWinningCells(shellType === "x" ? "o" : "x");

  if (defensiveCells.length > 0) {
    console.log("Dealer has a defensive move!");
    return selectRandomCell(defensiveCells);
  }

  console.log("Dealer has no winning or defensive moves.");
  return selectRandomCell(getUnoccupiedCells());
}

function chooseDealerAction() {
  const chances = getDealerShellChances();
  const shellType = getHighestChanceShellType(chances);

  console.log("Dealer's shell probabilities:", chances);
  console.log("Dealer's highest chance shell type:", shellType);

  if (["x", "o"].includes(shellType)) {
    return {
      type: "shoot",
      targetCell: chooseDealerTargetCell(shellType),
    };
  }

  return { type: "pump" };
}

async function executeDealerAction(action) {
  if (action.type === "shoot") {
    await performUpdateCell(action.targetCell);
    return;
  }

  console.log("Dealer has a blank shell. Pumping shotgun.");
  console.log("Real Shell: ", shells[0]);
  await performPumpShotgun();
}

async function performActionDealerTurn() {
  await delay(1000); // Simulate dealer thinking time
  const action = chooseDealerAction();
  await executeDealerAction(action);
}
