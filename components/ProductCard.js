class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .product-card {
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 1rem;
                    text-align: center;
                }
                .product-card img {
                    max-width: 100%;
                }
            </style>
            <div class="product-card">
                <img src="${this.getAttribute('image')}" alt="${this.getAttribute('name')}">
                <h3>${this.getAttribute('name')}</h3>
                <p>${this.getAttribute('price')}</p>
                <button>Add to Cart</button>
            </div>
        `;
    }
}

customElements.define('product-card', ProductCard);
