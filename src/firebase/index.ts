'use client';

import { firebaseApp } from '@/firebase/config';
import { FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';

let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let persistenceEnabled = false;

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
  }
  
  if (!persistenceEnabled) {
      persistenceEnabled = true;
      enableIndexedDbPersistence(firestoreInstance).catch((err) => {
          if (err.code == 'failed-precondition') {
              // Multiple tabs open, persistence can only be enabled
              // in one tab at a time.
              console.warn('Firestore persistence failed: failed-precondition. Multiple tabs open?');
          } else if (err.code == 'unimplemented') {
              // The current browser does not support all of the
              // features required to enable persistence
              console.warn('Firestore persistence failed: unimplemented.');
          }
      });
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