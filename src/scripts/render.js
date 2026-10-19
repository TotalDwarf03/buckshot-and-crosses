/**
 * This file contains functions responsible for rendering and updating the game's visual elements.
 */

function getGridBounds() {
  return elements.grid.getBoundingClientRect();
}

function updatePlayerControls() {
  document.body.classList.toggle(
    "player-controls-disabled",
    !canPlayerUseControls(),
  );
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
  elements.healthContainer.innerHTML = "";

  for (let i = 0; i < health; i++) {
    const heartImage = document.createElement("img");
    heartImage.src = "assets/health-point.png";
    heartImage.alt = "health point";
    heartImage.className = "health-point";
    elements.healthContainer.appendChild(heartImage);
  }
}

function animateDealerText(
  message,
  typingDuration = 2500,
  postTypingPause = 300,
) {
  return new Promise((resolve) => {
    const dealerText = elements.dealerText;
    const dealerContainer = elements.dealerContainer;
    const firstBuzzDuration = 400;
    const pauseDuration = 200;
    const secondBuzzDuration = 400;
    const charDelay = typingDuration / Math.max(message.length, 1);
    const totalDuration =
      firstBuzzDuration +
      pauseDuration +
      secondBuzzDuration +
      typingDuration +
      postTypingPause +
      500;

    dealerText.classList.remove("animating");
    dealerText.classList.remove("typing");
    dealerContainer.classList.remove("buzzing");
    dealerText.textContent = "";

    dealerContainer.classList.add("buzzing");

    setTimeout(() => {
      dealerContainer.classList.remove("buzzing");
    }, firstBuzzDuration);

    setTimeout(() => {
      dealerContainer.classList.add("buzzing");
    }, firstBuzzDuration + pauseDuration);

    setTimeout(
      () => {
        dealerContainer.classList.remove("buzzing");
        dealerText.textContent = "";
        playSound("dealer-talk");
        dealerText.classList.add("typing");

        message.split("").forEach((char, index) => {
          setTimeout(() => {
            dealerText.textContent += char;
          }, index * charDelay);
        });
      },
      firstBuzzDuration + pauseDuration + secondBuzzDuration,
    );

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

    setTimeout(() => {
      dealerText.textContent = "";
      dealerText.classList.remove("animating");
      dealerContainer.classList.remove("buzzing");
      dealerText.classList.remove("typing");
      resolve(totalDuration);
    }, totalDuration);
  });
}

function updateTableBackdrop(winCounter) {
  const tableBackdrop = elements.tableBackdrop;
  tableBackdrop.style.backgroundImage = `url('assets/backdrops/table-${winCounter}-win.png')`;
}
