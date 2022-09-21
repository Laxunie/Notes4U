import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGESENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

initializeApp(firebaseConfig);

// const addProcessor = async (name, brand, cores, threads) => {
//   const docRef = await addDoc(collection(db, "processors"), {
//     name: name.toString(),
//     brand: brand.toString(),
//     cores: cores.toString(),
//     threads: threads.toString(),
//   });
//   console.log("Document written with ID: ", docRef.id);
// };

export const auth = getAuth();
export const db = getFirestore();
// export { addProcessor };
