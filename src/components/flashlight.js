class Flashlight extends InventoryItemBase {
  get imageSource() {
    return "assets/items/flashlight.png";
  }

  get altText() {
    return "Flashlight";
  }

  useItem() {
    // Reveal current shell to player
    pumpShotgun("custom-flashlight");

    // Remove the flashlight from the inventory
    this.consume();
  }
}

customElements.define("custom-flashlight", Flashlight);
