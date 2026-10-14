class Flashlight extends InventoryItemBase {
  get imageSource() {
    return "assets/items/flashlight.png";
  }

  get altText() {
    return "Flashlight";
  }

  get description() {
    return "Reveals the current shell without consuming it.";
  }

  useItem() {
    // Reveal current shell to player
    pumpShotgun("custom-flashlight");

    // Remove the flashlight from the inventory
    this.consume();
  }
}

customElements.define("custom-flashlight", Flashlight);
