import { auth } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
      <style>
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .logo {
          height: 50px;
        }
        .logo-text {
            font-size: 1.5rem;
            font-weight: bold;
        }
        .logo-text .originals {
            color: white;
        }
        .logo-text .printing-co {
            color: var(--accent-color);
        }
        nav a {
          margin: 0 1rem;
          color: white;
          text-decoration: none;
          font-weight: bold;
          text-shadow: 0 0 5px rgba(0,0,0,0.5);
          transition: color 0.3s;
        }
        nav a:hover, nav a.active {
            color: var(--accent-color);
        }
        .auth-section {
            position: relative;
        }
        #login-button {
            background-color: var(--accent-color);
            color: black;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #login-button:hover {
            background-color: white;
        }
        #user-profile {
            display: none;
            align-items: center;
            cursor: pointer;
        }
        #user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 1rem;
        }
        #user-name {
            color: white;
            font-weight: bold;
        }
        #logout-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background-color: rgba(0,0,0,0.8);
            border-radius: 5px;
            padding: 0.5rem;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        #user-profile:hover #logout-dropdown {
            display: block;
        }
        #logout-button {
            background: none;
            border: none;
            color: var(--accent-color);
            cursor: pointer;
            padding: 0.5rem;
            text-align: left;
            width: 100%;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        #logout-button:hover {
            background-color: rgba(255,255,255,0.1);
        }
        #logout-button i {
            font-size: 1.2rem;
        }
      </style>
      <header>
        <div class="logo-container">
          <img src="logo.png" alt="ORIGINALS Printing Co. Logo" class="logo">
          <div class="logo-text">
            <span class="originals">ORIGINALS</span>
            <span class="printing-co">Printing Co.</span>
          </div>
        </div>
        <nav>
          <a href="#home" class="active">Home</a>
          <a href="#getting-started">Getting Started</a>
          <a href="#why-choose-us">Why Us?</a>
        </nav>
        <div class="auth-section">
          <a href="#" id="login-button">Login</a>
          <div id="user-profile">
            <img id="user-avatar" src="" alt="User Avatar">
            <span id="user-name"></span>
            <div id="logout-dropdown">
                <button id="logout-button">
                    <i class='bx bx-log-out'></i>
                    <span>Logout</span>
                </button>
            </div>
          </div>
        </div>
      </header>
    `;

    this.loginButton = this.shadowRoot.querySelector('#login-button');
    this.userProfile = this.shadowRoot.querySelector('#user-profile');
    this.userName = this.shadowRoot.querySelector('#user-name');
    this.userAvatar = this.shadowRoot.querySelector('#user-avatar');
    this.logoutButton = this.shadowRoot.querySelector('#logout-button');
  }

  connectedCallback() {
    document.addEventListener('authStateChanged', this._handleAuthStateChange.bind(this));
    
    this.loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        const loginPopup = document.createElement('login-popup');
        document.body.appendChild(loginPopup);
    });
    
    this.logoutButton.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                const targetElement = document.querySelector('#home');
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    });

    this._initSmoothScrolling();
    this._initScrollSpy();
  }

  _handleAuthStateChange(event) {
    const user = event.detail.user;
    if (user && user.emailVerified) {
      this.userName.textContent = user.displayName || 'User';
      this.userAvatar.src = user.photoURL || 'https://www.gravatar.com/avatar/?d=mp';
      this.userProfile.style.display = 'flex';
      this.loginButton.style.display = 'none';
    } else {
      this.userProfile.style.display = 'none';
      this.loginButton.style.display = 'block';
    }
  }

  _initSmoothScrolling() {
    this.shadowRoot.querySelector('nav').addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  _initScrollSpy() {
    const sections = document.querySelectorAll('main section');
    const navLinks = this.shadowRoot.querySelectorAll('nav a');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => {
      observer.observe(section);
    });
  }
}

class SiteFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 3rem 2rem;
          text-align: center;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        .footer-section h4 {
          font-size: 1.2rem;
          color: var(--accent-color);
          margin-bottom: 1rem;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-section a {
          color: white;
          text-decoration: none;
          margin-bottom: 0.5rem;
          display: inline-block;
          transition: color 0.3s;
        }
        .footer-section a:hover {
          color: var(--accent-color);
        }
        .social-icons a {
          display: inline-block;
          margin: 0 0.5rem;
          transition: transform 0.3s;
        }
        .social-icons a:hover {
          transform: scale(1.1);
        }
        .social-icons svg {
          width: 24px;
          height: 24px;
          fill: white;
        }
        .copyright {
          margin-top: 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          font-size: 0.9rem;
        }
      </style>
      <footer>
        <div class="footer-content">
          <div class="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Products</h4>
            <ul>
              <li><a href="#">Apparel</a></li>
              <li><a href="#">Accessories</a></li>
              <li><a href="#">Promotional</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Follow Us</h4>
            <div class="social-icons">
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12s4.5 9.96 10 9.96c5.5 0 10-4.47 10-9.96S17.5 2.04 12 2.04zm3.6 5.44h-2.17c-.55 0-.67.26-.67.66v1.44h2.81l-.37 2.76h-2.44v7.12h-2.81v-7.12H8.34v-2.76h2.17V8.08c0-2.14 1.3-3.3 3.2-3.3h2.17v2.7z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2c-2.72 0-3.05.01-4.12.06-1.06.05-1.79.24-2.43.51-.65.27-1.18.63-1.73 1.18-.55.55-.91 1.08-1.18 1.73-.27.64-.46 1.37-.51 2.43C2.01 8.95 2 9.28 2 12s.01 3.05.06 4.12c.05 1.06.24 1.79.51 2.43.27.65.63 1.18 1.18 1.73.55.55 1.08.91 1.73 1.18.64.27 1.37.46 2.43.51 1.07.05 1.4.06 4.12.06s3.05-.01 4.12-.06c1.06-.05 1.79-.24 2.43-.51.65-.27 1.18-.63 1.73-1.18.55-.55.91 1.08-1.18-1.73.27-.64.46-1.37.51-2.43.05-1.07.06-1.4.06-4.12s-.01-3.05-.06-4.12c-.05-1.06-.24-1.79-.51-2.43-.27-.65-.63-1.18-1.18-1.73-.55-.55-1.08-.91-1.73-1.18-.64-.27-1.37-.46-2.43-.51C15.05 2.01 14.72 2 12 2zm0 1.8c2.67 0 2.98.01 4.04.06 1.02.05 1.58.23 1.98.4.49.21.82.47 1.18.82.35.35.61.69.82 1.18.17.4.35.96.4 1.98.05 1.06.06 1.37.06 4.04s-.01 2.98-.06 4.04c-.05 1.02-.23 1.58-.4 1.98-.21.49-.47.82-.82 1.18-.35.35-.69.61-1.18.82-.4.17-.96.35-1.98.4-1.06.05-1.37.06-4.04.06s-2.98-.01-4.04-.06c-1.02-.05-1.58-.23-1.98-.4-.49-.21-.82-.47-1.18-.82-.35-.35-.61-.69-.82-1.18-.17-.4-.35-.96-.4-1.98-.05-1.06-.06-1.37-.06-4.04s.01-2.98.06-4.04c.05-1.02.23-1.58.4-1.98.21-.49.47.82.82-1.18.35-.35.69-.61-1.18-.82.4-.17.96-.35 1.98-.4C9.02 3.81 9.33 3.8 12 3.8zm0 3.35c-2.8 0-5.05 2.25-5.05 5.05s2.25 5.05 5.05 5.05 5.05-2.25 5.05-5.05S14.8 7.15 12 7.15zm0 8.3c-1.8 0-3.25-1.45-3.25-3.25S10.2 8.95 12 8.95s3.25 1.45 3.25 3.25-1.45 3.25-3.25 3.25zm5.35-8.4c-.66 0-1.2.54-1.2 1.2s.54 1.2 1.2 1.2 1.2-.54 1.2-1.2-.54-1.2-1.2-1.2z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.34-1.6.57-2.47.68.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.04C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.27 0 .34.04.67.11.98-3.56-.18-6.72-1.88-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.48.75 2.79 1.9 3.55-.7-.02-1.36-.21-1.94-.53v.05c0 2.07 1.47 3.8 3.42 4.19-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.7 2.1 2.93 3.96 2.96-1.46 1.14-3.3 1.82-5.3 1.82-.34 0-.68-.02-1.02-.06 1.88 1.21 4.12 1.92 6.56 1.92 7.88 0 12.2-6.54 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.22z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="copyright">
          &copy; ${new Date().getFullYear()} ORIGINALS Printing Co. All rights reserved.
        </div>
      </footer>
    `;
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
