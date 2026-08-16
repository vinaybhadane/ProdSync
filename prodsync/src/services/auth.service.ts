import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, getFirebaseAuth } from '@/lib/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

const STORAGE_KEY = 'prodsync_auth_user';

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    return null;
  } catch {
    return null;
  }
}

function setStoredUser(user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

const authListeners: Array<(user: AuthUser | null) => void> = [];

function notifyAuthListeners(user: AuthUser | null) {
  authListeners.forEach((l) => l(user));
}

function mapFirebaseError(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password. Please try again.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Google sign-in popup was closed before completing.',
    'auth/cancelled-popup-request': 'Only one sign-in popup can be open at a time.',
    'auth/popup-blocked': 'Sign-in popup was blocked by browser. Please allow popups for localhost:3000.',
    'auth/unauthorized-domain': 'This domain (localhost) is not authorized in Firebase Console.',
    'auth/operation-not-allowed': 'Google Sign-In is not enabled in Firebase Console.',
  };
  return map[code] || 'Authentication error. Please try again.';
}

export const authService = {
  /**
   * Real Google Authentication using Firebase GoogleAuthProvider & signInWithPopup
   * Retrieves actual Gmail address, display name, photo, and Firebase token
   */
  async signInWithGoogle(): Promise<AuthUser> {
    const firebaseAuth = getFirebaseAuth() || auth;
    if (!firebaseAuth || !isFirebaseConfigured) {
      throw new Error('Firebase Authentication is not configured in .env.local');
    }

    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    const credential = await signInWithPopup(firebaseAuth, provider);
    const fbUser = credential.user;

    const realUser: AuthUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      photoURL: fbUser.photoURL,
      emailVerified: fbUser.emailVerified,
    };

    setStoredUser(realUser);
    notifyAuthListeners(realUser);
    return realUser;
  },

  /**
   * Real Microsoft Authentication
   */
  async signInWithMicrosoft(): Promise<AuthUser> {
    const firebaseAuth = getFirebaseAuth() || auth;
    if (!firebaseAuth || !isFirebaseConfigured) {
      throw new Error('Firebase Authentication is not configured in .env.local');
    }

    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('email');
    provider.addScope('profile');

    const credential = await signInWithPopup(firebaseAuth, provider);
    const fbUser = credential.user;

    const realUser: AuthUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      photoURL: fbUser.photoURL,
      emailVerified: fbUser.emailVerified,
    };

    setStoredUser(realUser);
    notifyAuthListeners(realUser);
    return realUser;
  },

  /**
   * Real Email / Password Sign In
   */
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const firebaseAuth = getFirebaseAuth() || auth;
    if (!firebaseAuth || !isFirebaseConfigured) {
      throw new Error('Firebase Authentication is not configured in .env.local');
    }

    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const fbUser = credential.user;

    const realUser: AuthUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      photoURL: fbUser.photoURL,
      emailVerified: fbUser.emailVerified,
    };

    setStoredUser(realUser);
    notifyAuthListeners(realUser);
    return realUser;
  },

  /**
   * Real Email / Password Sign Up
   */
  async signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthUser> {
    const firebaseAuth = getFirebaseAuth() || auth;
    if (!firebaseAuth || !isFirebaseConfigured) {
      throw new Error('Firebase Authentication is not configured in .env.local');
    }

    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(credential.user, { displayName });
    
    try {
      await sendEmailVerification(credential.user);
    } catch (e) {
      console.warn('Verification email notice:', e);
    }

    const realUser: AuthUser = {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: displayName || credential.user.displayName,
      photoURL: credential.user.photoURL,
      emailVerified: credential.user.emailVerified,
    };

    setStoredUser(realUser);
    notifyAuthListeners(realUser);
    return realUser;
  },

  /**
   * Real Password Reset
   */
  async sendPasswordReset(email: string): Promise<void> {
    const firebaseAuth = getFirebaseAuth() || auth;
    if (!firebaseAuth || !isFirebaseConfigured) {
      throw new Error('Firebase Authentication is not configured.');
    }
    await sendPasswordResetEmail(firebaseAuth, email);
  },

  /**
   * Real Sign Out
   */
  async signOut(): Promise<void> {
    const firebaseAuth = getFirebaseAuth() || auth;
    if (firebaseAuth && isFirebaseConfigured) {
      try {
        await firebaseSignOut(firebaseAuth);
      } catch (e) {
        console.warn('Firebase sign out notice:', e);
      }
    }
    setStoredUser(null);
    notifyAuthListeners(null);
  },

  /**
   * Real Auth State Observer (Listens directly to Firebase Auth session)
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    const firebaseAuth = getFirebaseAuth() || auth;
    if (firebaseAuth && isFirebaseConfigured) {
      return onAuthStateChanged(firebaseAuth, (fbUser) => {
        if (fbUser) {
          const user: AuthUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            photoURL: fbUser.photoURL,
            emailVerified: fbUser.emailVerified,
          };
          setStoredUser(user);
          callback(user);
        } else {
          setStoredUser(null);
          callback(null);
        }
      });
    }

    // Fallback if Firebase not configured
    const stored = getStoredUser();
    callback(stored);
    authListeners.push(callback);
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx !== -1) authListeners.splice(idx, 1);
    };
  },

  mapError: mapFirebaseError,
};
