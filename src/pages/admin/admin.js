import { auth } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    const dashboardLink = document.getElementById('dashboard-link');
    const userManagementLink = document.getElementById('user-management-link');
    const contentManagementLink = document.getElementById('content-management-link');
    const dashboardSection = document.getElementById('dashboard-section');
    const userManagementSection = document.getElementById('user-management-section');
    const contentManagementSection = document.getElementById('content-management-section');

    // Redirect if not logged in or not an admin
    auth.onAuthStateChanged(user => {
        if (!user || user.email !== 'kylebriannt@gmail.com') {
            window.location.href = 'index.html';
        }
    });

    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Logout Error:', error);
        });
    });

    dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('dashboard');
    });

    userManagementLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('user-management');
        fetchAndDisplayUsers();
    });

    contentManagementLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('content-management');
    });

    function showSection(section) {
        dashboardSection.style.display = 'none';
        userManagementSection.style.display = 'none';
        contentManagementSection.style.display = 'none';

        if (section === 'dashboard') {
            dashboardSection.style.display = 'block';
        } else if (section === 'user-management') {
            userManagementSection.style.display = 'block';
        } else if (section === 'content-management') {
            contentManagementSection.style.display = 'block';
        }
    }

    function fetchAndDisplayUsers() {
        const users = {"users": [
            {
              "localId": "A3JBraH2BvPbGrUFaBlZqPegrTP2",
              "email": "admin@example.com",
              "emailVerified": false,
              "passwordHash": "KlCVMmEA6nnr1Hz+Po8ykdmA/7PsgsdIcORd0zjFkwDfYTIYAaWNLB+r2VSzQSyMF4Lfl2kNRv+YwbUeLtpA6Q==",
              "salt": "Q5YWL+OF+dRHag==",
              "lastSignedInAt": "1771190668102",
              "createdAt": "1771190668102",
              "providerUserInfo": []
            },
            {
              "localId": "SaYKQnyeJwPoEmhXHHICIrI1qni1",
              "email": "testuser@gmail.com",
              "emailVerified": false,
              "passwordHash": "n8gAnb2ENSEL821AnX6vE8V3+3tBNE1i3iFpCEHwb3soJ2Co0j3b6r2t2TMYk8gA5C41L+g1gBgg8CbyiDqB+A==",
              "salt": "aNewSecureSalt==",
              "lastSignedInAt": "1771005474909",
              "createdAt": "1771005474909",
              "providerUserInfo": []
            },
            {
              "localId": "qnZHA0imGffRDSIGpc61i0izN5Q2",
              "email": "kylebriantonido123@gmail.com",
              "emailVerified": true,
              "passwordHash": "9n6k/Rmkw3ZOQb9QXaFk3t0GiF661RFi4ujov9c4v2zdq/dohkAaIC6iZG1T06GYKLrr8wnbHkyqWqnDoTEdtQ==",
              "salt": "AfNbkCQOgRibxw==",
              "lastSignedInAt": "1771188138842",
              "createdAt": "1771187177865",
              "providerUserInfo": []
            },
            {
              "localId": "tZ838af739g5e77N1hwysclOJZd2",
              "email": "kylebriannt@gmail.com",
              "emailVerified": true,
              "passwordHash": "jThx+wotEjWHcSbt5coSLuvpnVlNZ9e+qbbCLpkgKQzCXQJjfWOlSomolUjwfvGSrQRCgrpPyFSzFh0sgo1Lgw==",
              "salt": "s3GzjE7G67iZHg==",
              "lastSignedInAt": "1771188766200",
              "createdAt": "1771009494354",
              "providerUserInfo": []
            }]};

        const usersTableBody = document.querySelector('#users-table tbody');
        usersTableBody.innerHTML = ''; // Clear existing data

        users.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.localId}</td>
                <td>${user.email}</td>
                <td>${user.providerUserInfo.length > 0 ? user.providerUserInfo[0].providerId : 'password'}</td>
                <td>${new Date(parseInt(user.createdAt)).toLocaleDateString()}</td>
            `;
            usersTableBody.appendChild(row);
        });
    }
});
