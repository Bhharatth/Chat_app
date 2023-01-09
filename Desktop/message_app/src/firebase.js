import { initializeApp } from "firebase/app";
import {  getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA-K2zUMDoInTDHpBiR_ZB0JmKAplusN3s",
  authDomain: "chat-7cb88.firebaseapp.com",
  projectId: "chat-7cb88",
  storageBucket: "chat-7cb88.appspot.com",
  messagingSenderId: "2699247448",
  appId: "1:2699247448:web:195114c66dfa39780d6f2d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();