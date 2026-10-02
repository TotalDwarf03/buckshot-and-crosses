class Flashlight extends InventoryItemBase {
  get imageSource() {
    return "assets/items/flashlight.png";
  }

  get altText() {
    return "Flashlight";
  }

  useItem() {
    // Reveal current shell to player
    pumpShotgun(true);

    // Remove the flashlight from the inventory
    this.remove();
    this.clearSlot();
  }
}

customElements.define("custom-flashlight", Flashlight);
