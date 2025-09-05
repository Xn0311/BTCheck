import 'firebase/auth/react-native';

import { initializeApp } from 'firebase/app';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDtsAZ5z48Q8foukduodCGhS4Hrduoc52A",
  authDomain: "jobapp-fe931.firebaseapp.com",
  projectId: "jobapp-fe931",
  storageBucket: "jobapp-fe931.appspot.com",
  messagingSenderId: "321340780478",
  appId: "1:321340780478:web:61d5abd9da7810fbf253ef",
  measurementId: "G-Y6L41W5SS8"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage };