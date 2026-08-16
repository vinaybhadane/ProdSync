import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  browserLocalPersistence, 
  inMemoryPersistence, 
  Auth 
} from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';

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
let analytics: Analytics | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (app) return app;
  if (!isFirebaseConfigured) return null;
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    return app;
  } catch (e) {
    console.warn('Firebase app init error:', e);
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
        persistence: [browserLocalPersistence, inMemoryPersistence],
      });
      return auth;
    } catch (e) {
      console.warn('Firebase auth init error:', e);
      return null;
    }
  }
}

// Eager initialization on browser
if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    app = getFirebaseApp();
    auth = getFirebaseAuth();
    if (firebaseConfig.measurementId) {
      try {
        if (app) analytics = getAnalytics(app);
      } catch {}
    }
  } catch (e) {
    console.warn('Firebase init error:', e);
  }
}

export { app, auth, analytics };
export default app;
