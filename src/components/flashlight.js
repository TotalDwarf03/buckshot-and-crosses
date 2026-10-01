class Flashlight extends HTMLElement {
  constructor() {
    super();
  }

  useItem(emptySlot) {
    // Reveal current shell to player
    pumpShotgun(true);

    // Remove the flashlight from the inventory
    this.remove();
    items.fill(null, emptySlot, emptySlot);

    console.log(items);
  }

  connectedCallback(emptySlot) {
    this.innerHTML = `
            <img src="assets/items/flashlight.png" alt="Flashlight" class="inventory-item" />
        `;
    this.onclick = () => this.useItem(emptySlot);
  }
}

customElements.define("custom-flashlight", Flashlight);
