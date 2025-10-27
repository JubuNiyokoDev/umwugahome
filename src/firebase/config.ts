import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  "projectId": "studio-8404575895-b3416",
  "appId": "1:977404918447:web:de25351d0c5fcd91a1725a",
  "apiKey": "AIzaSyAhQOrv3bEgHHV9vnO2ugosagwrQWmyE50",
  "authDomain": "studio-8404575895-b3416.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "977404918447"
};

let firebaseApp: any;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const firestore = getFirestore(firebaseApp);

export { firebaseApp, firestore };

export function initializeFirebase() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  // ... any other initialization
  return { firebaseApp: app, auth: {} as any, firestore };
}
