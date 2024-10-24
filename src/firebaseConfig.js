
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCxDKgpbf8AXs8sii05jorCXKcSJ7ERQxo",
    authDomain: "mapquest-2e211.firebaseapp.com",
    projectId: "mapquest-2e211",
    storageBucket: "mapquest-2e211.appspot.com",
    messagingSenderId: "724467612438",
    appId: "1:724467612438:web:3f8e89784848391879ae37",
    measurementId: "G-CPKW189MS2"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { app, db };
