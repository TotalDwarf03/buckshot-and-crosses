class ExpiredVodka extends InventoryItemBase {
  get imageSource() {
    return "assets/items/expired-vodka.png";
  }

  get altText() {
    return "Expired Vodka";
  }

  useItem() {
    // Pumps the shotgun, giving the user a second turn, regardless of the current shell.
    pumpShotgun("expired-vodka");

    // Remove the expired vodka from the inventory
    this.consume();
  }
}

customElements.define("expired-vodka", ExpiredVodka);
