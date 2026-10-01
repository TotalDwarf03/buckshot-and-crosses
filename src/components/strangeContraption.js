class StrangeContraption extends HTMLElement {
  constructor() {
    super();
  }

  useItem(emptySlot) {
    // Remove the strange contraption from the inventory
    this.remove();
    items[emptySlot] = null;
  }

  connectedCallback(emptySlot) {
    this.innerHTML = `
            <img src="assets/items/strange_contraption.png" alt="Strange Contraption" class="inventory-item" />
        `;
    this.onclick = () => this.useItem(emptySlot);
  }
}

customElements.define("strange-contraption", StrangeContraption);
