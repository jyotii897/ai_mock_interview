import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth;
let db: Firestore | undefined;

try {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
    } else {
        console.warn("Firebase credentials missing. Using mock/null objects.");
        auth = {
            currentUser: null,
            signOut: async () => { },
            onAuthStateChanged: () => () => { }
        } as unknown as Auth;
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
    auth = {
        currentUser: null,
        signOut: async () => { },
        onAuthStateChanged: () => () => { }
    } as unknown as Auth;
}

export { app, auth, db };