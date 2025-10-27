'use client';

import { firebaseApp } from '@/firebase/config';
import { FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';

let firestoreInstance: Firestore | null = null;
let authInstance: any = null;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // During server-side rendering, return null or minimal instances.
    return {
      firebaseApp: firebaseApp, // app instance is safe
      auth: null,
      firestore: null,
    };
  }

  // Initialize Auth if it hasn't been already
  if (!authInstance) {
    authInstance = getAuth(firebaseApp);
    if (process.env.NODE_ENV === 'development') {
      // It's safe to connect multiple times, it's a no-op if already connected.
      try {
        connectAuthEmulator(authInstance, 'http://127.0.0.1:9099', { disableWarnings: true });
      } catch (e) {
        // console.error('Error connecting to auth emulator:', e);
      }
    }
  }

  // Initialize Firestore if it hasn't been already
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(firebaseApp);
    if (process.env.NODE_ENV === 'development') {
      try {
        connectFirestoreEmulator(firestoreInstance, '127.0.0.1', 8080);
      } catch (e) {
        // console.error('Error connecting to firestore emulator:', e);
      }
    }
    // Enable persistence. It's safe to call this multiple times, it only tries to enable it once.
    try {
      enableIndexedDbPersistence(firestoreInstance);
    } catch (e: any) {
      if (e.code !== 'failed-precondition' && e.code !== 'unimplemented') {
         // console.error('Error enabling persistence:', e);
      }
    }
  }
  
  return {
    firebaseApp: firebaseApp,
    auth: authInstance,
    firestore: firestoreInstance,
  };
}


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
