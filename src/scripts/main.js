let turn = 'X';
let grid = Array(9).fill(null);
let win = null;
let crosshairListener = null;
let shotgunClickListener = null;
let shotgunPickedUp = false;

function updateCell(cell) {
    if (win) {
        return;
    }

    const index = Array.from(cell.parentNode.children).indexOf(cell);
    
    if (grid[index] === null) {
        grid[index] = turn;
        cell.textContent = turn;
        turn = turn === 'X' ? 'O' : 'X';

        win = checkWin();

        updateTurnDisplay(win);

        console.log(`Grid state: ${grid}`);
    } else {
        alert('Cell is already occupied!');
    }
}

function checkWin() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        const gridStatus = [grid[a], grid[b], grid[c]];

        let uniqueValues = new Set(gridStatus);

        if(uniqueValues.size === 1 && !uniqueValues.has(null)) {
            return `${grid[a]} wins!`;
        }
    }

    if (!grid.includes(null)) {
        return 'Draw';
    }

    return null;
}

function updateTurnDisplay(win = null) {
    const turnDisplay = document.getElementById('turn-display');

    if (win) {
        turnDisplay.textContent = win;
    } else {
        turnDisplay.textContent = `Turn: ${turn}`;
    }
}

function resetGame() {
    if (!confirm('Are you sure you want to reset the game?')) {
        return;
    }

    grid = Array(9).fill(null);
    turn = 'X';
    win = null;

    const cells = document.querySelectorAll('.grid-item');
    cells.forEach(cell => cell.textContent = '');
    
    updateTurnDisplay();
}

function pickupShotgun() {
    if (shotgunPickedUp) return;
    
    shotgunPickedUp = true;
    const shotgunImage = document.getElementById('shotgun-image');

    // grey out the shotgun image to indicate it's been picked up
    shotgunImage.style.filter = 'grayscale(100%)';
    shotgunImage.style.opacity = '0.5';

    // Make a crosshair appear, following the mouse cursor
    const crosshair = document.getElementById('crosshair');
    crosshair.hidden = false;

    // Remove old listener if it exists
    if (crosshairListener) {
        document.removeEventListener('mousemove', crosshairListener);
    }

    crosshairListener = (event) => {
        crosshair.style.left = `${event.pageX - crosshair.width / 2}px`;
        crosshair.style.top = `${event.pageY - crosshair.height / 2}px`;
    };

    document.addEventListener('mousemove', crosshairListener);


    // Setup drop event for the crosshair to place the shotgun back in shotgun slot
    // Remove old click listener if it exists
    if (shotgunClickListener) {
        shotgunImage.removeEventListener('click', shotgunClickListener);
    }
    
    shotgunClickListener = (e) => {
        e.stopPropagation();
        if (shotgunPickedUp) {
            resetShotgun();
        }
    };
    
    shotgunImage.addEventListener('click', shotgunClickListener);

    // Move crosshair to mouse position immediately
    crosshair.style.left = `${event.pageX - crosshair.width / 2}px`;
    crosshair.style.top = `${event.pageY - crosshair.height / 2}px`;
}

function resetShotgun() {
    shotgunPickedUp = false;
    const shotgunImage = document.getElementById('shotgun-image');

    // Restore the shotgun image to its original state
    shotgunImage.style.filter = '';
    shotgunImage.style.opacity = '';

    // Hide the crosshair and remove the mousemove listener
    const crosshair = document.getElementById('crosshair');
    crosshair.hidden = true;

    if (crosshairListener) {
        document.removeEventListener('mousemove', crosshairListener);
        crosshairListener = null;
    }

    // Remove the click event listener from the image
    if (shotgunClickListener) {
        shotgunImage.removeEventListener('click', shotgunClickListener);
        shotgunClickListener = null;
    }
}
