/**
 * This is the main entry point of the application.
 * It initialises the game and sets up event listeners.
 */

elements.startButton.addEventListener("click", () => {
  // Fade out home screen
  elements.homeLayer.style.opacity = "0";

  setTimeout(() => {
    elements.homeLayer.style.display = "none";
  }, 500); // Wait for fade transition to complete

  // Start the game
  setupGlobalEventHandlers();
  setupInteractionHandlers();
  updateHealthDisplay();

  queueAction(() =>
    animateDealerText(chooseRandomDialogue("sign"), 1500, 1200),
  );

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
  elements.shotgunImage.addEventListener("click", pickupShotgun);
  elements.briefcase.addEventListener("click", () => {
    elements.briefcaseImage.src = "assets/briefcase/briefcase-open.png";
    elements.briefcaseImage.alt = "Opened briefcase";
    elements.briefcase.disabled = true;

    setTimeout(() => {
      elements.statusText.textContent = "Spend your winnings wisely!";
      elements.endScreen.classList.add("is-visible");
    }, 3000);
  });

  elements.restartButton.addEventListener("click", () => {
    window.location.reload();
  });
}

function handlePointerLockChange() {
  if (shotgunPickedUp && document.pointerLockElement === null) {
    resetShotgun();
  }
}

function handleDocumentKeydown(event) {
  if (shotgunPickedUp && event.key === "Escape") {
    resetShotgun();
  }
}

function toggleWaiver(visible) {
  const waiver = elements.waiver;

  if (!visible) {
    waiver.classList.remove("is-visible");
    waiver.classList.add("is-exiting");

    setTimeout(() => {
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
      queueAction(() =>
        animateDealerText(chooseRandomDialogue("start"), 1500, 1200),
      );
    }, 500);

    setTimeout(() => {
      document.body.classList.remove("hud-hidden");
    }, 3700);

    setTimeout(() => {
      loadShotgun();
    }, 4700);
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
