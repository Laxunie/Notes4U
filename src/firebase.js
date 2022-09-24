import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, getDocs, getFirestore, collection, updateDoc, doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

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
console.log(process.env.REACT_APP_FIREBASE_MEASUREMENTID)
const addNote = async (title, note, uid) => {
  const querySnapshot = await getDocs(collection(db,  "notes/" + uid + "/note"));
  var setId = querySnapshot.size + 1;

  const addRef = await addDoc(collection(db, "notes/" + uid + "/note"), {
    
  });

  //Inorder to update my documents easily, I created a reference then 'updated' the reference so I can add a key/value pair of the documents reference id
  //for me to grab in the future and update/delete the specified document
  await setDoc(doc(db, "notes/" + uid + "/note/", addRef.id),{
    title: title,
    note: note,
    id: setId,
    ref: addRef.id,
    timeStamp: serverTimestamp(),
    updatedTimeStamp: serverTimestamp()
  })
};

const getNotes = async (uid) => {
  const data = [];
  const querySnapshot = await getDocs(collection(db, "notes/" + uid + "/note"));
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
  });
  return data
}

const updateNotes = async (uid, refId, title, note) => {
  await updateDoc(doc(db, "notes/" + uid + "/note", refId), {
    title: title,
    note: note,
    updatedTimeStamp: serverTimestamp()
  });
}

const deleteNotes = async (uid, refId) => {
  await deleteDoc(doc(db, "notes/" + uid + "/note", refId))
}

export const auth = getAuth();
export const db = getFirestore();
export { addNote, getNotes, updateNotes, deleteNotes };
