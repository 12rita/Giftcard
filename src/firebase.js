// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyAGTRDR9KpZPNICRh6Eph-FnoRmgUyCuZ0',
    authDomain: 'giftcard-a9a75.firebaseapp.com',
    projectId: 'giftcard-a9a75',
    storageBucket: 'giftcard-a9a75.appspot.com',
    messagingSenderId: '451665703337',
    appId: '1:451665703337:web:e0e5a06762a47c965c54b8'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
