import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
// @ts-expect-error Firebase exporta esta función en React Native, pero no en sus tipos públicos.
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const configurado = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
const appExistente = getApps().find(({ name }) => name === "[DEFAULT]");
const app = configurado ? (appExistente ?? initializeApp(firebaseConfig)) : null;

export const auth = app
  ? appExistente
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  : null;

export const firestore = app ? getFirestore(app) : null;
