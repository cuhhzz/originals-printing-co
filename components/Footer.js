class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 1rem;
                    text-align: center;
                }
            </style>
            <footer>
                <p>&copy; 2024 E-Commerce App</p>
            </footer>
        `;
    }
}

customElements.define('footer-component', Footer);
