const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
require("dotenv").config({ path: ".env.local" });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "rayjyoti66@gmail.com";
const password = "Password123!";

console.log("------------------------------------------------");
console.log("DEBUG CONFIG:");
console.log("API KEY starts with:", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 4) : "UNDEFINED");
console.log("PROJECT ID:", firebaseConfig.projectId);
console.log("AUTH DOMAIN:", firebaseConfig.authDomain);
console.log("------------------------------------------------");

console.log("Attempting to create user:", email);

createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log("SUCCESS: User created!");
        console.log("UID:", userCredential.user.uid);
        process.exit(0);
    })
    .catch((error) => {
        console.error("ERROR:", error.code, error.message);
        process.exit(1);
    });
