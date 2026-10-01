class CigarettePack extends HTMLElement {
  constructor() {
    super();
  }

  useItem(emptySlot) {
    // Add 1 to the player's health when the cigarette pack is used
    updateHealth(1);

    // Remove the cigarette pack from the inventory
    this.remove();
    items[emptySlot] = null;
  }

  connectedCallback(emptySlot) {
    this.innerHTML = `
            <img src="assets/items/cigarette_pack.png" alt="Cigarette Pack" class="inventory-item" />
        `;
    this.onclick = () => this.useItem(emptySlot);
  }
}

customElements.define("cigarette-pack", CigarettePack);
