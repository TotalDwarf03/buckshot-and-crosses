class ExpiredVodka extends HTMLElement {
  constructor() {
    super();
  }

  useItem(emptySlot) {
    // Add or remove 1 to the player's health when the expired vodka is used
    if (randint(0, 1) === 0) {
      updateHealth(1);
    } else {
      updateHealth(-1);
    }

    // Remove the expired vodka from the inventory
    this.remove();
    items.fill(null, emptySlot, emptySlot);
  }

  connectedCallback(emptySlot) {
    this.innerHTML = `
            <img src="assets/items/expired_vodka.png" alt="Expired Vodka" class="inventory-item" />
        `;
    this.onclick = () => this.useItem(emptySlot);
  }
}

customElements.define("expired-vodka", ExpiredVodka);
