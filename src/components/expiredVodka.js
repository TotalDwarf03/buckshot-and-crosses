class ExpiredVodka extends HTMLElement {
  constructor() {
    super();
  }

  useItem(emptySlot) {
    // Remove the expired vodka from the inventory
    this.remove();
    items[emptySlot] = null;
  }

  connectedCallback(emptySlot) {
    this.innerHTML = `
            <img src="assets/items/expired_vodka.png" alt="Expired Vodka" class="inventory-item" />
        `;
    this.onclick = () => this.useItem(emptySlot);
  }
}

customElements.define("expired-vodka", ExpiredVodka);
