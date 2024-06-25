// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCKggAPDiTxxSwZmfFduSO7bmA4Z3FBqww",
    authDomain: "iconic-leather.firebaseapp.com",
    projectId: "iconic-leather",
    storageBucket: "iconic-leather.appspot.com",
    messagingSenderId: "895236323348",
    appId: "1:895236323348:web:11ad570431999065f84f01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export { storage, app };
