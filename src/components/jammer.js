class Jammer extends InventoryItemBase {
  get imageSource() {
    return "assets/items/jammer.png";
  }

  get altText() {
    return "Jammer";
  }

  get description() {
    return "Skips the dealer's next turn.";
  }

  useItem() {
    skipTurn = true;
    this.consume();
  }
}

customElements.define("custom-jammer", Jammer);
