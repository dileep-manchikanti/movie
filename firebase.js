import {initializeApp} from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyBFsgHElaHzPs8cSYxxE6dgRpYO4x_34JU",
    authDomain: "movieapp-production-9c56a.firebaseapp.com",
    projectId: "movieapp-production-9c56a",
    storageBucket: "movieapp-production-9c56a.appspot.com",
    messagingSenderId: "368226227203",
    appId: "1:368226227203:web:7f01658bfa4a694bd82a36"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);