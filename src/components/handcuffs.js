class Handcuffs extends InventoryItemBase {
  get imageSource() {
    return "assets/items/handcuffs.png";
  }

  get altText() {
    return "Handcuffs";
  }

  useItem() {
    // Remove the handcuffs from the inventory
    this.remove();
    this.clearSlot();
  }
}

customElements.define("custom-handcuffs", Handcuffs);
