class Handcuffs extends InventoryItemBase {
  get imageSource() {
    return "assets/items/handcuffs.png";
  }

  get altText() {
    return "Handcuffs";
  }

  useItem() {
    // Skip the next turn
    skipTurn = true;

    // Remove the handcuffs from the inventory
    this.consume();
  }
}

customElements.define("custom-handcuffs", Handcuffs);
