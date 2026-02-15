# ORIGINALS Printing Co. - Blueprint

## Overview

A modern, responsive landing page for a fictional printing company called "ORIGINALS Printing Co.". The application is built using modern web standards (HTML, CSS, and JavaScript) with no external frameworks. It features a visually appealing design, smooth animations, and a clear call to action. The project is set up to be easily extended with additional features, such as user authentication and a product catalog.

## Project Structure

```
.
├── index.html        # Main HTML file
├── style.css         # Main CSS file
├── main.js           # Main JavaScript file (ESM)
├── components.js     # Reusable web components
├── auth.js           # Firebase authentication logic
├── firebase-config.js # Firebase configuration
├── logo.png          # Company logo
├── background.jpg    # Background image
├── why-choose-us.jpg # Image for the "Why Choose Us" section
└── blueprint.md      # This file
```

## Design & Features

### General

*   **Responsive Design:** The layout adapts to different screen sizes, ensuring a great user experience on both desktop and mobile devices. Media queries are used to adjust the layout, font sizes, and navigation for a seamless experience on tablets and smartphones.
*   **Modern Aesthetics:** The design features a dark theme with a vibrant accent color, creating a bold and professional look.
*   **Web Components:** Reusable UI elements (`site-header`, `site-footer`) are encapsulated as custom elements for better code organization and maintainability.

### Header (`<site-header>`)

*   **Sticky Header:** The header remains fixed at the top of the page for easy navigation.
*   **Logo:** The company logo is prominently displayed.
*   **Navigation:** The navigation menu features smooth scrolling to different sections of the page and active link highlighting. The navigation is hidden on smaller screens to provide a cleaner mobile experience.
*   **Authentication:** The header now includes a user authentication section with a login button and a user profile dropdown menu.

### Hero Section

*   **Compelling Headline:** A clear and concise headline that communicates the company's value proposition.
*   **Call to Action:** A prominent "Get a Quote" button that encourages users to take the next step.

### Getting Started Section

*   **Three-Step Process:** A simple and easy-to-understand guide on how to use the company's services.
*   **Icons:** Each step is accompanied by an icon for visual appeal.

### Why Choose Us Section

*   **Two-Column Layout:** A visually balanced layout that combines an image with a list of key benefits.
*   **Feature List:** A bulleted list that highlights the company's strengths, such as quality, customization, and reliability.

### Footer (`<site-footer>`)

*   **Comprehensive Footer:** The footer includes links to various pages, social media icons, and a copyright notice.
*   **SVG Icons:** The social media links now use SVG icons for a cleaner and more modern look.
*   **Organized Layout:** The footer content is organized into sections for easy readability.

## Authentication

*   **Firebase Authentication:** User authentication is handled by Firebase Authentication, providing a secure and reliable solution.
*   **Advanced Login & Sign-Up:** The authentication popup provides a seamless experience for both new and returning users.
    *   **Login:** Users can log in with their email and password, or use Google and Facebook for social sign-in.
    *   **Sign-Up:** The sign-up form includes fields for email, username, and password, with real-time password validation.
    *   **Password Strength:** A password strength indicator (Weak, Moderate, Strong) and a checklist of requirements guide users to create secure passwords.
    *   **Password Matching:** The "Confirm Password" field glows green when the passwords match and red when they do not, providing immediate visual feedback.
    *   **Password Visibility:** A toggle button (eye icon) is available on all password fields, allowing users to show or hide their password.
    *   **Comprehensive Notifications:** All user notifications, including success and error messages, are displayed in custom-styled popups. This replaces generic browser alerts and ensures clear, consistent feedback for actions like password mismatches, unverified emails, and successful sign-ups.
    *   **Terms & Conditions:** Users must agree to the Terms & Conditions and Privacy Policy before signing up. The policies are available in a separate popup.
    *   **Email Verification:** After signing up, a verification email is automatically sent to the user. The login flow prevents unverified users from signing in and provides an option to resend the verification email.
*   **User-Friendly Features:**
    *   "Remember Me" checkbox
    *   Forgot password functionality (sends a reset email)

## Current Plan

*   **All tasks complete!**
