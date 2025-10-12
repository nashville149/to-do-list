import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA_s3WxnXq_YHHWjmgif6Bq4dNWsVvPpY8",
  authDomain: "to-do-list-a50f8.firebaseapp.com",
  projectId: "to-do-list-a50f8",
  storageBucket: "to-do-list-a50f8.appspot.com",
  messagingSenderId: "222458837497",
  appId: "1:222458837497:web:ec0d91ec7b7fcc02d9a528",
  measurementId: "G-VJ929LEQZC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);