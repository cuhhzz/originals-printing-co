import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './firebase-config.js';

class LoginPopup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
            <style>
                :host {
                    --accent-color: #ffa500;
                    --success-color: #28a745;
                    --error-color: #dc3545;
                    --weak-color: #dc3545;
                    --moderate-color: #ffc107;
                    --strong-color: #28a745;
                }
                .popup-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(5px);
                }
                .popup {
                    background: #1e1e1e; width: 420px; padding: 2.5rem; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); position: relative; color: white;
                }
                .popup-logo-container { text-align: center; margin-bottom: 1rem; }
                .popup-logo { max-width: 100px; height: auto; }
                #close-popup { position: absolute; top: 15px; right: 15px; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
                h2 { text-align: center; font-size: 2rem; margin-bottom: 1.5rem; color: var(--accent-color); }
                .form-group { margin-bottom: 1.25rem; }
                .input-wrapper { position: relative; }
                input[type="email"], input[type="password"], input[type="text"] {
                    width: 100%; padding: 1rem; box-sizing: border-box; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; font-size: 1rem; transition: box-shadow 0.3s, border-color 0.3s;
                }
                .password-toggle-btn {
                    position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: transparent; border: none; padding: 0; margin: 0; cursor: pointer; color: #aaa; display: inline-flex; align-items: center; justify-content: center;
                }
                .password-toggle-btn i { font-size: 1.5rem; }

                /* Password Matching Glow */
                input#signup-password-confirm.match {
                    border-color: var(--success-color);
                    box-shadow: 0 0 8px var(--success-color);
                }
                input#signup-password-confirm.no-match {
                    border-color: var(--error-color);
                    box-shadow: 0 0 8px var(--error-color);
                }

                /* Password Strength & Validation */
                .password-validation-container { font-size: 0.8rem; margin-top: 0.75rem; }
                #password-strength-text { margin-bottom: 0.5rem; text-align: right; font-weight: bold; }
                .validation-list { list-style: none; padding: 0; margin: 0; color: #aaa; }
                .validation-list li { transition: color 0.3s; }
                .validation-list li.valid { color: var(--success-color); text-decoration: line-through; }

                .options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.9rem; }
                .remember-me { display: flex; align-items: center; }
                #forgot-password, .terms-group a { color: var(--accent-color); text-decoration: none; }
                .login-btn { width: 100%; padding: 1rem; background-color: var(--accent-color); color: black; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: background-color 0.3s; }
                .login-btn:hover { background-color: white; }
                .separator { text-align: center; margin: 1.5rem 0; color: #888; }
                .social-logins { display: flex; justify-content: center; gap: 1rem; }
                .social-btn { border: 1px solid rgba(255,255,255,0.2); background: none; padding: 0.75rem; border-radius: 50%; cursor: pointer; transition: background-color 0.3s; }
                .social-btn:hover { background-color: rgba(255,255,255,0.1); }
                .social-btn svg { width: 24px; height: 24px; fill: white; }
                .signup-link { text-align: center; margin-top: 1.5rem; }
                .signup-link a { color: var(--accent-color); text-decoration: none; font-weight: bold; }
                .terms-group { font-size: 0.8rem; text-align: center; }

                /* Sub-Popups (Terms, Privacy, Success, Error) */
                .sub-popup-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); display: none; align-items: center; justify-content: center; z-index: 3000; }
                .sub-popup-content { background: #2a2a2a; padding: 2rem; border-radius: 10px; max-width: 600px; color: #eee; position: relative; text-align: left; }
                .sub-popup-content h3 { margin-top: 0; font-size: 1.5rem; color: var(--accent-color); text-align: center;}
                .sub-popup-content p { margin-bottom: 1rem; }
                .close-sub-popup { position: absolute; top: 10px; right: 15px; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
            </style>

            <div class="popup-overlay">
                <div class="popup">
                    <div class="popup-logo-container">
                        <img src="logo.png" alt="ORIGINALS Printing Co. Logo" class="popup-logo">
                    </div>
                    <button id="close-popup">&times;</button>

                    <!-- Login View -->
                    <div id="login-view">
                        <h2>Login</h2>
                        <form id="login-form">
                            <div class="form-group">
                                <div class="input-wrapper">
                                    <input type="email" id="email" placeholder="Email" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-wrapper">
                                    <input type="password" id="password" placeholder="Password" required>
                                    <button type="button" class="password-toggle-btn" data-for="password"><i class='bx bx-hide'></i></button>
                                </div>
                            </div>
                            <div class="options">
                                <label class="remember-me"><input type="checkbox" id="remember-me"> Remember me</label>
                                <a href="#" id="forgot-password">Forgot Password?</a>
                            </div>
                            <button type="submit" class="login-btn" id="login-btn">Login</button>
                        </form>
                        <div class="separator">or continue with</div>
                        <div class="social-logins">
                             <button class="social-btn" id="google-login" aria-label="Login with Google">
                                <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                            </button>
                            <button class="social-btn" id="facebook-login" aria-label="Login with Facebook">
                               <svg viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12s4.5 9.96 10 9.96c5.5 0 10-4.47 10-9.96S17.5 2.04 12 2.04zm3.6 5.44h-2.17c-.55 0-.67.26-.67.66v1.44h2.81l-.37 2.76h-2.44v7.12h-2.81v-7.12H8.34v-2.76h2.17V8.08c0-2.14 1.3-3.3 3.2-3.3h2.17v2.7z" fill="#1877F2"/></svg>
                            </button>
                        </div>
                        <div class="signup-link">
                            Don't have an account? <a href="#" id="show-signup">Sign up</a>
                        </div>
                    </div>

                    <!-- Signup View -->
                    <div id="signup-view" style="display:none;">
                        <h2>Sign Up</h2>
                        <form id="signup-form">
                            <div class="form-group">
                                <input type="text" id="signup-username" placeholder="Username" required>
                            </div>
                            <div class="form-group">
                                <input type="email" id="signup-email" placeholder="Email" required>
                            </div>
                            <div class="form-group">
                                <div class="input-wrapper">
                                    <input type="password" id="signup-password" placeholder="Create Password" required>
                                    <button type="button" class="password-toggle-btn" data-for="signup-password"><i class='bx bx-hide'></i></button>
                                </div>
                                <div class="password-validation-container">
                                     <div id="password-strength-text"></div>
                                     <ul class="validation-list">
                                        <p>Password Requirements:</p>
                                        <li data-req="length"><i class='bx bx-radio-circle'></i> 8-20 characters</li>
                                        <li data-req="upper"><i class='bx bx-radio-circle'></i> 1 uppercase</li>
                                        <li data-req="lower"><i class='bx bx-radio-circle'></i> 1 lowercase</li>
                                        <li data-req="number"><i class='bx bx-radio-circle'></i> 1 number</li>
                                        <li data-req="special"><i class='bx bx-radio-circle'></i> 1 special character</li>
                                     </ul>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-wrapper">
                                    <input type="password" id="signup-password-confirm" placeholder="Confirm Password" required>
                                     <button type="button" class="password-toggle-btn" data-for="signup-password-confirm"><i class='bx bx-hide'></i></button>
                                </div>
                            </div>
                            <div class="form-group terms-group">
                                <label>
                                    <input type="checkbox" id="terms-agree"> I agree to the <a href="#" id="show-terms">Terms & Conditions</a> and <a href="#" id="show-privacy">Privacy Policy</a>.
                                </label>
                            </div>
                            <button type="submit" class="login-btn" id="signup-btn">Create Account</button>
                        </form>
                        <div class="signup-link">
                            Already have an account? <a href="#" id="show-login">Login</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sub-Popups -->
            <div id="terms-popup" class="sub-popup-overlay">
                <div class="sub-popup-content">
                    <button class="close-sub-popup">&times;</button>
                    <h3>Terms and Conditions</h3>
                    <p>This is where your terms and conditions would go. It's important to have this clearly defined.</p>
                </div>
            </div>
            <div id="privacy-popup" class="sub-popup-overlay">
                 <div class="sub-popup-content">
                    <button class="close-sub-popup">&times;</button>
                    <h3>Privacy Policy</h3>
                    <p>This is where your privacy policy would go. It should detail how you handle user data.</p>
                </div>
            </div>
            <div id="success-popup" class="sub-popup-overlay">
                <div class="sub-popup-content">
                    <button class="close-sub-popup">&times;</button>
                    <h3 id="success-title" style="color: var(--success-color);">Success</h3>
                    <p id="success-message"></p>
                </div>
            </div>
            <div id="error-popup" class="sub-popup-overlay">
                <div class="sub-popup-content">
                    <button class="close-sub-popup">&times;</button>
                    <h3 id="error-title" style="color: var(--error-color);">Error</h3>
                    <p id="error-message"></p>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#close-popup').addEventListener('click', this.closePopup.bind(this));
        this.shadowRoot.querySelector('#show-signup').addEventListener('click', (e) => { e.preventDefault(); this._switchView('signup-view'); });
        this.shadowRoot.querySelector('#show-login').addEventListener('click', (e) => { e.preventDefault(); this._switchView('login-view'); });

        this.shadowRoot.querySelectorAll('.password-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = this.shadowRoot.querySelector(`#${e.currentTarget.dataset.for}`);
                const icon = e.currentTarget.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('bx-hide');
                    icon.classList.add('bx-show');
                } else {
                    input.type = 'password';
                    icon.classList.remove('bx-show');
                    icon.classList.add('bx-hide');
                }
            });
        });

        // Password validation
        const passwordInput = this.shadowRoot.querySelector('#signup-password');
        const passwordConfirmInput = this.shadowRoot.querySelector('#signup-password-confirm');
        passwordInput.addEventListener('input', this._validatePassword.bind(this));
        passwordConfirmInput.addEventListener('input', this._validatePassword.bind(this));

        // Sub-popup listeners
        this.shadowRoot.querySelector('#show-terms').addEventListener('click', (e) => { e.preventDefault(); this.shadowRoot.querySelector('#terms-popup').style.display = 'flex'; });
        this.shadowRoot.querySelector('#show-privacy').addEventListener('click', (e) => { e.preventDefault(); this.shadowRoot.querySelector('#privacy-popup').style.display = 'flex'; });
        this.shadowRoot.querySelectorAll('.close-sub-popup').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const popup = e.currentTarget.closest('.sub-popup-overlay');
                popup.style.display = 'none';
                if (popup.id === 'success-popup') {
                    this.closePopup();
                }
            });
        });

        // Auth listeners
        this.shadowRoot.querySelector('#signup-btn').addEventListener('click', this._handleEmailSignUp.bind(this));
        this.shadowRoot.querySelector('#login-btn').addEventListener('click', this._handleEmailLogin.bind(this));
        this.shadowRoot.querySelector('#google-login').addEventListener('click', this._handleGoogleLogin.bind(this));
        this.shadowRoot.querySelector('#facebook-login').addEventListener('click', this._handleFacebookLogin.bind(this));
        this.shadowRoot.querySelector('#forgot-password').addEventListener('click', this._handleForgotPassword.bind(this));
    }

    _switchView(viewId) {
        this.shadowRoot.querySelector('#login-view').style.display = viewId === 'login-view' ? 'block' : 'none';
        this.shadowRoot.querySelector('#signup-view').style.display = viewId === 'signup-view' ? 'block' : 'none';
    }

    _validatePassword() {
        const password = this.shadowRoot.querySelector('#signup-password').value;
        const confirmPassword = this.shadowRoot.querySelector('#signup-password-confirm').value;
        const strengthText = this.shadowRoot.querySelector('#password-strength-text');
        const validationItems = this.shadowRoot.querySelectorAll('.validation-list li');

        // Strength Logic
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score < 3) {
            strengthText.textContent = 'Weak';
            strengthText.style.color = 'var(--weak-color)';
        } else if (score < 5) {
            strengthText.textContent = 'Moderate';
            strengthText.style.color = 'var(--moderate-color)';
        } else {
            strengthText.textContent = 'Strong';
            strengthText.style.color = 'var(--strong-color)';
        }

        // Validation Checklist
        validationItems.forEach(item => {
            const req = item.dataset.req;
            let valid = false;
            if (req === 'length') valid = password.length >= 8 && password.length <= 20;
            if (req === 'upper') valid = /[A-Z]/.test(password);
            if (req === 'lower') valid = /[a-z]/.test(password);
            if (req === 'number') valid = /[0-9]/.test(password);
            if (req === 'special') valid = /[^A-Za-z0-9]/.test(password);
            item.classList.toggle('valid', valid);
        });

        // Password Confirmation Match
        const confirmInput = this.shadowRoot.querySelector('#signup-password-confirm');
         if (confirmPassword) {
            if (password === confirmPassword) {
                confirmInput.classList.add('match');
                confirmInput.classList.remove('no-match');
            } else {
                confirmInput.classList.add('no-match');
                confirmInput.classList.remove('match');
            }
        } else {
            confirmInput.classList.remove('match', 'no-match');
        }
    }

    _showSuccessPopup(title, message) {
        this.shadowRoot.querySelector('.popup').style.display = 'none';
        const successPopup = this.shadowRoot.querySelector('#success-popup');
        successPopup.querySelector('#success-title').textContent = title;
        successPopup.querySelector('#success-message').textContent = message;
        successPopup.style.display = 'flex';
    }

    _showErrorPopup(title, message) {
        const errorPopup = this.shadowRoot.querySelector('#error-popup');
        errorPopup.querySelector('#error-title').textContent = title;
        errorPopup.querySelector('#error-message').textContent = message;
        errorPopup.style.display = 'flex';
    }

    _handleEmailSignUp(e) {
        e.preventDefault();
        const email = this.shadowRoot.querySelector('#signup-email').value;
        const password = this.shadowRoot.querySelector('#signup-password').value;
        const passwordConfirm = this.shadowRoot.querySelector('#signup-password-confirm').value;
        const termsAgree = this.shadowRoot.querySelector('#terms-agree').checked;

        if (!termsAgree) {
            this._showErrorPopup('Terms Not Agreed', 'You must agree to the Terms & Conditions and Privacy Policy.');
            return;
        }
        if (password !== passwordConfirm) {
            this._showErrorPopup('Password Mismatch', "The passwords you entered do not match.");
            return;
        }
        
        this._validatePassword();
        const isValid = this.shadowRoot.querySelectorAll('.validation-list li.valid').length === 5;
        if (!isValid) {
            this._showErrorPopup('Invalid Password', 'Please ensure your password meets all the requirements.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                sendEmailVerification(userCredential.user)
                    .then(() => {
                        this._showSuccessPopup(
                            'Confirm Your Account',
                            'A verification link has been sent to your email address. Please check your inbox to complete your sign-up.'
                        );
                    });
            })
            .catch(err => {
                this._showErrorPopup('Sign-Up Failed', this._getFriendlyErrorMessage(err));
            });
    }

    _handleEmailLogin(e) {
        e.preventDefault();
        const email = this.shadowRoot.querySelector('#email').value;
        const password = this.shadowRoot.querySelector('#password').value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (userCredential.user.emailVerified) {
                    this.closePopup();
                } else {
                    sendEmailVerification(userCredential.user).then(() => {
                         this._showSuccessPopup(
                            'Email Not Verified',
                            'Please verify your email address before logging in. Another verification email has been sent.'
                        );
                    });
                }
            })
            .catch(err => {
                this._showErrorPopup('Login Failed', this._getFriendlyErrorMessage(err));
            });
    }

    _handleGoogleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(() => this.closePopup())
            .catch(err => this._showErrorPopup('Google Sign-In Failed', this._getFriendlyErrorMessage(err)));
    }

    _handleFacebookLogin() {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then(() => this.closePopup())
            .catch(err => this._showErrorPopup('Facebook Sign-In Failed', this._getFriendlyErrorMessage(err)));
    }
    
    _handleForgotPassword(e) {
        e.preventDefault();
        const email = this.shadowRoot.querySelector('#email').value;
        if (!email) {
            this._showErrorPopup('Missing Email', 'Please enter your email address in the login form to reset your password.');
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                this._showSuccessPopup('Password Reset', 'A password reset link has been sent to your email address.');
            })
            .catch(err => {
                this._showErrorPopup('Password Reset Failed', this._getFriendlyErrorMessage(err));
            });
    }

    _getFriendlyErrorMessage(err) {
        switch (err.code) {
            case 'auth/invalid-email':
                return 'The email address you entered is not valid.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/user-not-found':
                return 'No account was found with this email address.';
            case 'auth/wrong-password':
                return 'The password you entered is incorrect.';
            case 'auth/email-already-in-use':
                return 'An account already exists with this email address.';
            case 'auth/weak-password':
                return 'The password is too weak. Please choose a stronger password.';
            case 'auth/popup-closed-by-user':
                return 'The sign-in popup was closed before completing the operation.';
            default:
                return err.message;
        }
    }

    closePopup() {
        this.remove();
    }
}

customElements.define('login-popup', LoginPopup);

// Dispatch auth state changes for other components to listen to
auth.onAuthStateChanged(user => {
    document.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user } }));
});
