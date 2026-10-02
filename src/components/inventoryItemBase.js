class InventoryItemBase extends HTMLElement {
  connectedCallback() {
    this.renderItem();
    this.addEventListener("click", () => this.useItem(this.slot));
  }

  get slot() {
    return Number(this.dataset.slot);
  }

  renderItem() {
    this.innerHTML = `
      <img src="${this.imageSource}" alt="${this.altText}" class="inventory-item" />
    `;
  }

  clearSlot() {
    items[this.slot] = null;
  }
}
