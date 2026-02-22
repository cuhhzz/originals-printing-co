class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 1rem;
                    text-align: center;
                }
            </style>
            <header>
                <h1>E-Commerce App</h1>
            </header>
        `;
    }
}

customElements.define('header-component', Header);
