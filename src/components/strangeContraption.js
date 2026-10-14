class StrangeContraption extends InventoryItemBase {
  get imageSource() {
    return "assets/items/strange-contraption.png";
  }

  get altText() {
    return "Strange Contraption";
  }

  get description() {
    return "May undo the last shot, do nothing, or reset the board and cost one health.";
  }

  useItem() {
    // 60% revert previous shot, 30% do nothing, 10% blow up
    const roll = randint(1, 100);

    if (roll <= 60) {
      if (previousShot) {
        // Update grid + cell contents
        previousShot.cell.innerHTML = "";
        grid[previousShot.index] = null;
      }
    } else if (roll >= 90) {
      // Reset grid
      grid = Array(9).fill(null);

      // Empty all cells
      const cells = elements.grid.querySelectorAll(".grid-item");
      cells.forEach((cell) => {
        cell.innerHTML = "";
      });

      updateHealth(-1);
    }

    // Remove the strange contraption from the inventory
    this.consume();
  }
}

customElements.define("strange-contraption", StrangeContraption);
