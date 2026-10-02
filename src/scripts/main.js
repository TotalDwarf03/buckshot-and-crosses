/**
 * This is the main entry point of the application.
 * It initialises the game and sets up event listeners.
 */

window.addEventListener("DOMContentLoaded", () => {
  setupGlobalEventHandlers();
  setupInteractionHandlers();
  updateHealthDisplay();

  setTimeout(() => {
    shells = loadShotgun();
  }, 1000);
});

function setupGlobalEventHandlers() {
  document.addEventListener("pointerlockchange", handlePointerLockChange);
  document.addEventListener("keydown", handleDocumentKeydown);
}

function setupInteractionHandlers() {
  elements.grid.addEventListener("click", handleGridClick);
  elements.shotgunImage.addEventListener("click", pickupShotgun);
}

function handlePointerLockChange() {
  if (shotgunPickedUp && document.pointerLockElement == null) {
    resetShotgun();
  }
}

function handleDocumentKeydown(event) {
  if (shotgunPickedUp && event.key === "Escape") {
    resetShotgun();
  }
}

function handleGridClick(event) {
  const targetCell = event.target.closest(".grid-item");

  if (targetCell) {
    updateCell(targetCell);
  }
}
