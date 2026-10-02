class ExpiredVodka extends InventoryItemBase {
  get imageSource() {
    return "assets/items/expired-vodka.png";
  }

  get altText() {
    return "Expired Vodka";
  }

  useItem() {
    // Add or remove 1 to the player's health when the expired vodka is used
    if (randint(0, 1) === 0) {
      updateHealth(1);
    } else {
      updateHealth(-1);
    }

    // Remove the expired vodka from the inventory
    this.remove();
    this.clearSlot();
  }
}

customElements.define("expired-vodka", ExpiredVodka);
