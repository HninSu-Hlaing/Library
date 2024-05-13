import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZEH3hUeSY4pyvCGo-j-ZaOHlZA4YG5-E",
  authDomain: "library-app-9a3ca.firebaseapp.com",
  projectId: "library-app-9a3ca",
  storageBucket: "library-app-9a3ca.appspot.com",
  messagingSenderId: "489432372644",
  appId: "1:489432372644:web:ecb53820aa2cc0cf655d31",
  measurementId: "G-0VG83VQVCZ"
};

const app = initializeApp(firebaseConfig);
let db = getFirestore(app);
let auth = getAuth(app);
let storage = getStorage(app);

export { db, auth, storage };
