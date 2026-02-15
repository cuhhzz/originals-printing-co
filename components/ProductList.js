import './ProductCard.js';
import { initializeState, getState } from '../services/State.js';

class ProductList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .product-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                }
            </style>
            <div class="product-list">
                <p>Loading products...</p>
            </div>
        `;
    }

    async connectedCallback() {
        await initializeState();
        const { products } = getState();
        this.render(products);
    }

    render(products) {
        const productList = this.shadowRoot.querySelector('.product-list');
        productList.innerHTML = ''; // Clear the loading message

        if (products && products.length > 0) {
            products.forEach(product => {
                const productCard = document.createElement('product-card');
                productCard.setAttribute('name', product.title);
                productCard.setAttribute('price', `$${product.price}`);
                productCard.setAttribute('image', product.image);
                productList.appendChild(productCard);
            });
        } else {
            productList.innerHTML = '<p>No products found.</p>';
        }
    }
}

customElements.define('product-list', ProductList);
