# ORIGINALS Printing Co. - Professional Project Structure

A modern, responsive landing page for ORIGINALS Printing Co., built with vanilla HTML, CSS, and JavaScript with Firebase integration.

## 📁 Project Structure

```
originals-printing-co/
├── public/                       # Static assets served to the client
│   ├── images/                   # Image assets
│   │   ├── logo.png             # Company logo
│   │   ├── background.jpg       # Hero section background
│   │   └── why-choose-us.jpg    # Benefits section image
│   └── index.html               # Main landing page
│
├── src/                          # Source code (organized by feature)
│   ├── components/               # Reusable web components
│   │   ├── Header.js            # Site header component
│   │   ├── Footer.js            # Site footer component
│   │   ├── ProductCard.js       # Product card component
│   │   └── ProductList.js       # Product list component
│   │
│   ├── services/                 # Business logic and API services
│   │   ├── ApiService.js        # API communication
│   │   └── State.js             # State management
│   │
│   ├── js/                       # Core JavaScript files
│   │   ├── main.js              # Entry point
│   │   ├── components.js        # Web components definitions
│   │   └── auth.js              # Authentication logic
│   │
│   ├── config/                   # Configuration files
│   │   └── firebase-config.js   # Firebase configuration
│   │
│   ├── pages/                    # Page-specific content
│   │   ├── admin/               # Admin panel
│   │   │   ├── admin.html       # Admin panel interface
│   │   │   ├── admin.js         # Admin logic
│   │   │   └── admin.css        # Admin styles
│   │   └── login-popup-template.html  # Login form template
│   │
│   └── styles/                   # Global styles
│       └── style.css            # Main stylesheet
│
├── docs/                         # Documentation
│   └── README.md                # Blueprint and project documentation
│
├── .firebase/                    # Firebase cache (gitignored)
├── .git/                         # Git repository
├── package.json                  # Project dependencies
├── firebase.json                 # Firebase configuration
└── .gitignore                    # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- Firebase account set up

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:8000`

### Project Layout Benefits

- **`public/`** - Contains only files served directly to clients (HTML and images)
- **`src/`** - Contains all source code, organized logically:
  - **Components** - Reusable UI building blocks
  - **Services** - Business logic, API calls, state management
  - **JS** - Core application logic
  - **Config** - Environment and service configuration
  - **Pages** - Page-specific content (admin panel)
  - **Styles** - Global and layout CSS

## 📋 File Organization

### Public Files
- `public/index.html` - Main landing page entry point
- `public/images/` - All static images and assets

### Source Code
- `src/js/main.js` - Application entry point that imports all modules
- `src/js/auth.js` - Firebase authentication and login popup
- `src/js/components.js` - Custom web components (Header, Footer)
- `src/config/firebase-config.js` - Firebase initialization
- `src/pages/admin/` - Isolated admin panel with its own styles and logic
- `src/components/` - Reusable component modules
- `src/services/` - API and state management services
- `src/styles/` - Global styling

## 🔧 Key Features

- **Responsive Design** - Mobile-first approach with media queries
- **Custom Web Components** - Encapsulated, reusable UI elements
- **Firebase Integration** - Authentication and real-time database
- **Admin Panel** - Secure dashboard for website management
- **Modern JavaScript** - ES6 modules and async/await
- **Professional Structure** - Scalable and maintainable codebase

## 📦 Dependencies

- Firebase SDK (v9.6.1+)
- Boxicons (for icons)
- http-server (for local development)

## 🔐 Authentication

The project uses Firebase Authentication with:
- Google OAuth
- Facebook OAuth
- Email/Password
- Email verification
- Password reset functionality

## 📝 Notes

- All relative paths have been updated to reflect the new structure
- Images are served from `public/images/`
- Styles are centralized in `src/styles/`
- Admin panel is isolated in `src/pages/admin/`
- Firebase config is in `src/config/`

## 📄 Documentation

See `docs/README.md` for detailed project blueprint and architecture.
