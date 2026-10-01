class Flashlight extends HTMLElement {
  constructor() {
    super();
  }

  useItem(emptySlot) {
    // Remove the flashlight from the inventory
    this.remove();
    items[emptySlot] = null;
  }

  connectedCallback(emptySlot) {
    this.innerHTML = `
            <img src="assets/items/flashlight.png" alt="Flashlight" class="inventory-item" />
        `;
    this.onclick = () => this.useItem(emptySlot);
  }
}

customElements.define("custom-flashlight", Flashlight);
