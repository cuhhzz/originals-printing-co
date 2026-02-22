import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './firebase-config.js';

class LoginPopup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.MAX_LOGIN_ATTEMPTS = 3;
        this.LOCKOUT_TIME = 2 * 60 * 1000; // 2 minutes in milliseconds
        this.OTP_EXPIRATION = 10 * 60 * 1000; // 10 minutes for OTP validity
        this.lockedOutEmail = null;
    }

    async _loadTemplate() {
        try {
            const response = await fetch('./login-popup-template.html');
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status}`);
            }
            const template = await response.text();
            this.shadowRoot.innerHTML = template;
            return true;
        } catch (error) {
            console.error('Error loading login popup template:', error);
            this.shadowRoot.innerHTML = '<p>Error loading login form. Please refresh the page.</p>';
            return false;
        }
    }

    connectedCallback() {
        this._loadTemplate().then(() => {
            this._initializeEventListeners();
        });
    }

    _initializeEventListeners() {
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
        this.shadowRoot.querySelector('#signup-form').addEventListener('submit', this._handleEmailSignUp.bind(this));
        this.shadowRoot.querySelector('#login-form').addEventListener('submit', this._handleEmailLogin.bind(this));
        this.shadowRoot.querySelector('#google-login').addEventListener('click', this._handleGoogleLogin.bind(this));
        this.shadowRoot.querySelector('#facebook-login').addEventListener('click', this._handleFacebookLogin.bind(this));
        this.shadowRoot.querySelector('#forgot-password').addEventListener('click', this._handleForgotPassword.bind(this));

        // OTP listeners
        this.shadowRoot.querySelector('#request-otp-btn').addEventListener('click', this._handleRequestOTP.bind(this));
        this.shadowRoot.querySelector('#verify-otp-btn').addEventListener('click', this._handleVerifyOTP.bind(this));
        this.shadowRoot.querySelector('#resend-otp-btn').addEventListener('click', this._handleResendOTP.bind(this));
        this.shadowRoot.querySelector('#otp-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this._handleVerifyOTP.call(this);
            }
        });

        // Allow only digits in OTP input
        this.shadowRoot.querySelector('#otp-input').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
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
        const countdownElement = this.shadowRoot.querySelector('#countdown-timer');
        const otpBtn = this.shadowRoot.querySelector('#request-otp-btn');
        
        const isLockedOut = this._isLockedOut();
        
        // Show countdown if user is currently locked out
        if (isLockedOut) {
            countdownElement.style.display = 'block';
            countdownElement.textContent = 'Countdown loading...';
            this._startCountdown(countdownElement);
            
            // Show OTP request button if email is available
            if (this.lockedOutEmail) {
                otpBtn.style.display = 'block';
            }
        } else {
            countdownElement.style.display = 'none';
            otpBtn.style.display = 'none';
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
            }
        }
        
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
            .then((userCredential) => {
                sendEmailVerification(userCredential.user)
                    .then(() => {
                        this._showSuccessPopup('Account Created!', `A verification link has been sent to ${email}. Please verify your email before logging in.`);
                        this._switchView('login-view');
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

        console.log('LOGIN_ATTEMPT:', {email, isLockedOut: this._isLockedOut(), attempts: this._getLoginAttempts()});

        // Check if account is locked out
        if (this._isLockedOut()) {
            console.log('ACCOUNT_LOCKED_OUT');
            this.lockedOutEmail = email;
            this._showErrorPopup('Too Many Requests', 'You have exceeded the maximum login attempts. Please try again in 2 minutes.');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Reset login attempts on successful login
                this._resetLoginAttempts();
                console.log('LOGIN_SUCCESS, ATTEMPTS_RESET');
                if (user.email === 'kylebriannt@gmail.com') {
                    window.location.href = 'admin.html';
                } else {
                    this.closePopup();
                }
            })
            .catch(err => {
                // Increment login attempts on failed login
                this._incrementLoginAttempts();
                const attemptsRemaining = this.MAX_LOGIN_ATTEMPTS - this._getLoginAttempts();
                
                console.log('LOGIN_FAILED:', {error: err.code, attempts: this._getLoginAttempts(), attemptsRemaining});
                
                if (this._isLockedOut()) {
                    console.log('NOW_LOCKED_OUT');
                    this.lockedOutEmail = email;
                    this._showErrorPopup('Too Many Requests', 'You have exceeded the maximum login attempts. Please try again in 2 minutes.');
                } else if (attemptsRemaining > 0) {
                    this._showErrorPopup('Login Failed', this._getFriendlyErrorMessage(err) + ` (${attemptsRemaining} attempts remaining)`);
                } else {
                    this._showErrorPopup('Too Many Requests', 'You have exceeded the maximum login attempts. Please try again in 2 minutes.');
                }
            });
    }

    _handleForgotPassword(e) {
        e.preventDefault();
        const email = this.shadowRoot.querySelector('#email').value;
        if (!email) {
            this._showErrorPopup('Missing Email', 'Please enter your email address in the login form to request a password reset.');
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                this._showSuccessPopup('Password Reset Email Sent', `A password reset link has been sent to ${email}. Please check your inbox.`);
            })
            .catch(err => {
                this._showErrorPopup('Reset Failed', this._getFriendlyErrorMessage(err));
            });
    }

    _handleGoogleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                if (user.email === 'kylebriannt@gmail.com') {
                    window.location.href = 'admin.html';
                } else {
                    this.closePopup();
                }
            })
            .catch(err => this._showErrorPopup('Google Sign-In Failed', this._getFriendlyErrorMessage(err)));
    }

    _handleFacebookLogin() {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                if (user && user.email === 'kylebriannt@gmail.com') {
                    window.location.href = 'admin.html';
                } else {
                    this.closePopup();
                }
            })
            .catch(err => this._showErrorPopup('Facebook Sign-In Failed', this._getFriendlyErrorMessage(err)));
    }
    
    _getFriendlyErrorMessage(err) {
        if (err.message && err.message.includes('auth/invalid-credential')) {
            return 'Invalid credentials. Please check your email and password.';
        }

        switch (err.code) {
            case 'auth/invalid-email': return 'The email address you entered is not valid.';
            case 'auth/user-disabled': return 'This account has been disabled.';
            case 'auth/user-not-found': return 'No account was found with this email address.';
            case 'auth/wrong-password': return 'The password you entered is incorrect.';
            case 'auth/email-already-in-use': return 'An account already exists with this email address.';
            case 'auth/credential-already-in-use': return 'This email is already associated with another account.';
            case 'auth/weak-password': return 'The password is too weak. Please choose a stronger password.';
            case 'auth/popup-closed-by-user': return 'The sign-in popup was closed before completing the operation.';
            case 'auth/too-many-requests': return 'You have sent too many requests. Please try again later.';
            case 'auth/invalid-credential': return 'Invalid credentials. Please check your email and password.';
            default: return err.message || 'An unexpected error occurred.';
        }
    }

    closePopup() {
        this.remove();
    }

    _getLoginAttempts() {
        const data = JSON.parse(localStorage.getItem('loginAttempts') || '{"count": 0, "timestamp": 0}');
        const now = Date.now();
        
        // Reset if lockout time has passed
        if (now - data.timestamp > this.LOCKOUT_TIME) {
            return 0;
        }
        return data.count;
    }

    _incrementLoginAttempts() {
        const data = JSON.parse(localStorage.getItem('loginAttempts') || '{"count": 0, "timestamp": 0}');
        const now = Date.now();
        
        // Reset if lockout time has passed
        if (now - data.timestamp > this.LOCKOUT_TIME) {
            data.count = 1;
            data.timestamp = now;
        } else {
            data.count += 1;
            data.timestamp = now;
        }
        
        localStorage.setItem('loginAttempts', JSON.stringify(data));
    }

    _resetLoginAttempts() {
        localStorage.setItem('loginAttempts', JSON.stringify({"count": 0, "timestamp": 0}));
    }

    _isLockedOut() {
        return this._getLoginAttempts() >= this.MAX_LOGIN_ATTEMPTS;
    }

    _startCountdown(countdownElement) {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        const updateCountdown = () => {
            const data = JSON.parse(localStorage.getItem('loginAttempts') || '{"count": 0, "timestamp": 0}');
            const now = Date.now();
            const timeRemaining = this.LOCKOUT_TIME - (now - data.timestamp);

            if (timeRemaining <= 0) {
                clearInterval(this.countdownInterval);
                countdownElement.style.display = 'none';
                return;
            }

            const seconds = Math.ceil(timeRemaining / 1000);
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const text = `Try again in ${minutes}:${secs.toString().padStart(2, '0')}`;
            countdownElement.textContent = text;
        };

        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    _generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    _sendOTP(email) {
        const otp = this._generateOTP();
        const otpData = {
            otp: otp,
            email: email,
            timestamp: Date.now(),
            attempts: 0
        };
        localStorage.setItem('otpData', JSON.stringify(otpData));
        
        // For demo purposes, log OTP to console
        // In production, this would be sent via Firebase Cloud Function or backend
        console.log(`OTP for ${email}: ${otp}`);
        
        // Display OTP in a more visible way for testing (can be removed in production)
        this._showSuccessPopup('OTP Sent', `An OTP has been sent to ${email}. For testing, your OTP is: ${otp}`);
        
        return otp;
    }

    _handleRequestOTP() {
        const email = this.lockedOutEmail;
        if (!email) {
            this._showErrorPopup('Error', 'Unable to determine email address.');
            return;
        }

        this._sendOTP(email);
        
        // Close error popup and show OTP popup
        this.shadowRoot.querySelector('#error-popup').style.display = 'none';
        const otpPopup = this.shadowRoot.querySelector('#otp-popup');
        otpPopup.style.display = 'flex';
        
        // Focus on OTP input
        setTimeout(() => {
            this.shadowRoot.querySelector('#otp-input').focus();
        }, 100);

        // Start OTP timer
        this._startOTPTimer();
    }

    _handleVerifyOTP() {
        const otpInput = this.shadowRoot.querySelector('#otp-input').value;
        
        if (otpInput.length !== 6) {
            this._showErrorPopup('Invalid OTP', 'Please enter a valid 6-digit OTP.');
            return;
        }

        if (this._verifyOTP(otpInput)) {
            // Reset the lockout when OTP is verified
            this._resetLoginAttempts();
            this.shadowRoot.querySelector('#otp-popup').style.display = 'none';
            this._showSuccessPopup('Success', 'Account unlocked! You can now try logging in again.');
        } else {
            const otpData = JSON.parse(localStorage.getItem('otpData') || '{}');
            otpData.attempts = (otpData.attempts || 0) + 1;
            localStorage.setItem('otpData', JSON.stringify(otpData));

            if (otpData.attempts >= 3) {
                this.shadowRoot.querySelector('#otp-popup').style.display = 'none';
                this._showErrorPopup('Too Many Attempts', 'You have exceeded the maximum OTP verification attempts. Please request a new OTP.');
            } else {
                this._showErrorPopup('Invalid OTP', `Incorrect OTP. ${3 - otpData.attempts} attempts remaining.`);
                this.shadowRoot.querySelector('#otp-input').value = '';
            }
        }
    }

    _handleResendOTP() {
        const otpData = JSON.parse(localStorage.getItem('otpData') || '{}');
        if (!otpData.email) {
            this._showErrorPopup('Error', 'Unable to resend OTP.');
            return;
        }

        localStorage.removeItem('otpData');
        this._sendOTP(otpData.email);
        this.shadowRoot.querySelector('#otp-input').value = '';
        this._startOTPTimer();
    }

    _verifyOTP(inputOTP) {
        const otpData = JSON.parse(localStorage.getItem('otpData') || '{}');
        
        // Check if OTP has expired
        if (Date.now() - otpData.timestamp > this.OTP_EXPIRATION) {
            this._showErrorPopup('OTP Expired', 'Your OTP has expired. Please request a new one.');
            return false;
        }

        return otpData.otp === inputOTP;
    }

    _startOTPTimer() {
        if (this.otpTimerInterval) {
            clearInterval(this.otpTimerInterval);
        }

        const updateOTPTimer = () => {
            const otpData = JSON.parse(localStorage.getItem('otpData') || '{}');
            const now = Date.now();
            const timeRemaining = this.OTP_EXPIRATION - (now - otpData.timestamp);

            const otpTimerElement = this.shadowRoot.querySelector('#otp-timer');
            if (!otpTimerElement) return;

            if (timeRemaining <= 0) {
                clearInterval(this.otpTimerInterval);
                otpTimerElement.textContent = 'OTP Expired - Request a new one';
                this.shadowRoot.querySelector('#verify-otp-btn').disabled = true;
                return;
            }

            const seconds = Math.ceil(timeRemaining / 1000);
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            otpTimerElement.textContent = `Expires in ${minutes}:${secs.toString().padStart(2, '0')}`;
        };

        updateOTPTimer();
        this.otpTimerInterval = setInterval(updateOTPTimer, 1000);
    }
}

customElements.define('login-popup', LoginPopup);

// Dispatch auth state changes for other components to listen to
auth.onAuthStateChanged(user => {
    document.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user } }));
});
