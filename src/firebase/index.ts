'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  if (process.env.NODE_ENV === 'development') {
    // Connect to emulator BEFORE any other Firestore operations
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  }

  // Enable persistence must be called after emulator connection but before other operations.
  // We'll wrap it in a try-catch to avoid errors if it has already been enabled.
  try {
    enableIndexedDbPersistence(firestore);
  } catch (e: any) {
    if (e.code !== 'failed-precondition') {
      // This can happen if persistence is enabled in another tab.
      // It's safe to ignore.
    }
  }
  
  return {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: firestore,
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