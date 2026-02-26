import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHy4gnb-gf4Hf6O7bLno1ReNo_REduGoU",
  authDomain: "originals-website.firebaseapp.com",
  projectId: "originals-website",
  storageBucket: "originals-website.appspot.com",
  messagingSenderId: "368704000921",
  appId: "1:368704000921:web:5cfca95d6ad861bd9fb908",
  measurementId: "G-J8RYV0HCP9"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
