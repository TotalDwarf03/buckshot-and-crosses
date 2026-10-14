class Jammer extends InventoryItemBase {
  get imageSource() {
    return "assets/items/jammer.png";
  }

  get altText() {
    return "Jammer";
  }

  useItem() {
    skipTurn = true;
    this.consume();
  }
}

customElements.define("custom-jammer", Jammer);
