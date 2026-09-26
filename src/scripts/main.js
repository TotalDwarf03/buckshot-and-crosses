let turn = 'X';
let grid = Array(9).fill(null);
let win = null;

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
