import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  browserLocalPersistence, 
  browserSessionPersistence,
  inMemoryPersistence, 
  Auth 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBMzA_ZTW-x1rBhqc-fKRnHWcoUeY61PV8',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'prodsync06.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'prodsync06',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'prodsync06.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '422057153373',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:422057153373:web:8e80f90180ad735b7e0eb4',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DZ4TVV83S7',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_api_key_here'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (app) return app;
  if (!isFirebaseConfigured) return null;
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    return app;
  } catch (e) {
    console.warn('Firebase app init notice:', e);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (auth) return auth;
  const currentApp = getFirebaseApp();
  if (!currentApp) return null;

  try {
    auth = getAuth(currentApp);
    return auth;
  } catch {
    try {
      auth = initializeAuth(currentApp, {
        persistence: [browserLocalPersistence, browserSessionPersistence, inMemoryPersistence],
      });
      return auth;
    } catch (e) {
      console.warn('Firebase auth persistence fallback notice:', e);
      try {
        auth = initializeAuth(currentApp, {
          persistence: inMemoryPersistence,
        });
        return auth;
      } catch {
        return null;
      }
    }
  }
}

// Client initialization
if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    app = getFirebaseApp();
    auth = getFirebaseAuth();
  } catch (e) {
    console.warn('Firebase client init notice:', e);
  }
}

export { app, auth };
export default app;
