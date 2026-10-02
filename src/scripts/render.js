/**
 * This file contains functions responsible for rendering and updating the game's visual elements.
 */

function getGridBounds() {
  return elements.grid.getBoundingClientRect();
}

function hideHUD(hide) {
  elements.shellContainer.classList.toggle("aiming", hide);
  elements.shotgunContainer.classList.toggle("aiming", hide);
  elements.healthContainer.classList.toggle("aiming", hide);
  elements.inventory.classList.toggle("aiming", hide);
}

function setAimingMode(isAiming) {
  elements.crosshair.hidden = !isAiming;
  elements.vignette.hidden = !isAiming;
  elements.gameContainer.classList.toggle("aiming", isAiming);
  document.body.classList.toggle("aiming", isAiming);
  elements.dealerContainer.classList.toggle("aiming", isAiming);

  hideHUD(isAiming);
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

function renderShellTray(sortedShells, shellMotionProfiles) {
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
}

function updateInventoryDisplay(newItem, emptySlot) {
  const slotToUpdate = elements.inventorySlots[emptySlot];
  slotToUpdate.innerHTML = "";

  if (newItem) {
    const itemElement = document.createElement(newItem);
    itemElement.dataset.slot = String(emptySlot);
    slotToUpdate.appendChild(itemElement);
  }
}

function updateHealthDisplay() {
  const healthBar = elements.healthBar;
  healthBar.innerHTML = "";

  for (let i = 0; i < health; i++) {
    const heartImage = document.createElement("img");
    heartImage.src = "assets/health-point.png";
    heartImage.alt = "health point";
    heartImage.className = "health-point";
    healthBar.appendChild(heartImage);
  }
}

function animateDealerText(
  message,
  typingDuration = 2500,
  postTypingPause = 300,
  fadeOutDuration = 500,
) {
  const dealerText = elements.dealerText;
  const dealerContainer = elements.dealerContainer;

  // Reset animations and classes
  dealerText.classList.remove("animating");
  dealerContainer.classList.remove("buzzing");
  dealerText.textContent = "";

  const firstBuzzDuration = 400; // First buzz
  const pauseDuration = 200; // Pause between buzzes
  const secondBuzzDuration = 400; // Second buzz

  // Start first buzz (0-500ms)
  dealerContainer.classList.add("buzzing");

  // Stop first buzz and start pause
  setTimeout(() => {
    dealerContainer.classList.remove("buzzing");
  }, firstBuzzDuration);

  // Start second buzz after pause (800-1300ms)
  setTimeout(() => {
    dealerContainer.classList.add("buzzing");
  }, firstBuzzDuration + pauseDuration);

  // Stop second buzz and start typing
  setTimeout(
    () => {
      dealerContainer.classList.remove("buzzing");
      dealerText.textContent = "";
      dealerText.classList.add("typing");

      // Calculate character delay for typewriter effect
      const charDelay = typingDuration / message.length;

      // Typewriter effect: reveal one character at a time
      message.split("").forEach((char, index) => {
        setTimeout(() => {
          dealerText.textContent += char;
        }, index * charDelay);
      });
    },
    firstBuzzDuration + pauseDuration + secondBuzzDuration,
  );

  // Start fade out after typing completes with a short pause
  setTimeout(
    () => {
      dealerText.classList.add("animating");
    },
    firstBuzzDuration +
      pauseDuration +
      secondBuzzDuration +
      typingDuration +
      postTypingPause,
  );

  // Reset after everything completes
  setTimeout(
    () => {
      dealerText.textContent = "";
      dealerText.classList.remove("animating");
      dealerContainer.classList.remove("buzzing");
      dealerText.classList.remove("typing");
    },
    firstBuzzDuration +
      pauseDuration +
      secondBuzzDuration +
      typingDuration +
      postTypingPause +
      fadeOutDuration,
  );
}
