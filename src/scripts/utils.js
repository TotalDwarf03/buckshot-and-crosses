/**
 * This file contains utility functions that are used throughout the application.
 * These functions can be reused in different parts of the codebase, promoting code reusability and maintainability.
 */

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomUnit(min, max, unit, precision = 2) {
  return `${randomFloat(min, max).toFixed(precision)}${unit}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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
