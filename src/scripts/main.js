/**
 * This is the main entry point of the application.
 * It initialises the game and sets up event listeners.
 */

window.addEventListener("DOMContentLoaded", () => {
  setupGlobalEventHandlers();
  setupInteractionHandlers();
  updateHealthDisplay();

  animateDealerText("Sign the waiver.", 1500, 1200);

  // Show the waiver after the dealer text animation is complete.
  setTimeout(() => {
    // Show the waiver and animate it in from the center.
    toggleWaiver(true);
  }, 3000);

  // The game will then start once the waiver is signed, which is handled in toggleWaiver().
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

function toggleWaiver(visible) {
  const waiver = document.getElementById("waiver");

  if (!visible) {
    waiver.classList.remove("is-visible");
    waiver.classList.add("is-exiting");

    window.setTimeout(() => {
      waiver.classList.remove("is-exiting");
      waiver.style.display = "none";
    }, 320);

    return;
  }

  waiver.style.display = "flex";
  waiver.classList.remove("is-exiting");

  waiver.addEventListener("click", () => {
    if (waiver.classList.contains("is-exiting")) {
      return;
    }

    toggleWaiver(false);

    setTimeout(() => {
      animateDealerText("Good Luck.", 1500, 1200);
    }, 500);

    setTimeout(() => {
      document.body.classList.remove("hud-hidden");
    }, 3500);

    setTimeout(() => {
      loadShotgun();
    }, 4500);
  });

  requestAnimationFrame(() => {
    if (visible) {
      waiver.classList.add("is-visible");
    } else {
      waiver.classList.remove("is-visible");
    }
  });

  return waiver;
}
