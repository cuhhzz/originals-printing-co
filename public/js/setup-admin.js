import { db } from './config/firebase-config.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firestore.js';

async function setupAdmin() {
    try {
        const uid = 'nIG2emOWKGQj3pn3DxIRbKqQER13';
        const email = 'marcaidajessmar@gmail.com';
        const displayName = 'jess';

        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
            email: email,
            displayName: displayName,
            isAdmin: true,
            createdAt: new Date(),
            emailVerified: true
        });

        console.log('✓ Admin created successfully!');
        console.log('UID:', uid);
        console.log('Email:', email);
        return true;
    } catch (error) {
        console.error('Error creating admin:', error);
        return false;
    }
}

// Run the setup
setupAdmin();
