class CigarettePack extends InventoryItemBase {
  get imageSource() {
    return "assets/items/cigarette-pack.png";
  }

  get altText() {
    return "Cigarette Pack";
  }

  useItem() {
    // Add 1 to the player's health when the cigarette pack is used
    updateHealth(1);

    // Remove the cigarette pack from the inventory
    this.consume();
  }
}

customElements.define("cigarette-pack", CigarettePack);
