/**
 * This file manages the game state and has a series of useful constants that are used throughout the application.
 */

let grid = Array(9).fill(null);
let win = null;

let skipTurn = false;
let dealerTurn = false;

let crosshairListener = null;
let shotgunClickListener = null;
let pumpListener = null;
let shotgunPickedUp = false;
let shells;
let reloading = false;
let pumpAnimating = false;
let currentAimPoint = null;

let actionQueue = Promise.resolve();
let actionQueueRunning = false;

function queueAction(action) {
  const queuedAction = actionQueue.then(async () => {
    actionQueueRunning = true;

    try {
      return await action();
    } finally {
      actionQueueRunning = false;
    }
  });

  actionQueue = queuedAction.then(
    () => undefined,
    () => undefined,
  );

  return queuedAction;
}

const CROSSHAIR_OFFSET_X = 817.5;
const CROSSHAIR_OFFSET_Y = 210;

// When changing this, also update the CSS variable --max-health in src/styles/main.css
const MAX_HEALTH = 4;

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
  healthContainer: document.getElementById("health-container"),
  crosshair: document.getElementById("crosshair"),
  vignette: document.getElementById("vignette"),
  inventory: document.getElementById("inventory"),
  inventorySlots: [
    document.getElementById("item-slot-1"),
    document.getElementById("item-slot-2"),
    document.getElementById("item-slot-3"),
  ],
  dealerContainer: document.getElementById("dealer-container"),
  dealerText: document.getElementById("dealer-text"),
};

const itemsPerRound = 2;

let items = Array(3).fill(null);
let health = 2;
let previousShot;

let winCounter = 0;

const availableItems = [
  "custom-handcuffs",
  "custom-flashlight",
  "cigarette-pack",
  "strange-contraption",
  "expired-vodka",
];

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
