import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, getDocs, getFirestore, collection, updateDoc, doc, setDoc, serverTimestamp, deleteDoc, query, orderBy, where } from "firebase/firestore";

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
    hearted: false,
    timeStamp: serverTimestamp(),
    updatedTimeStamp: serverTimestamp()
  })
};

const getNotes = async (uid, search) => {
  const data = [];
  const notesRef = collection(db, "notes/" + uid + "/note");
  var q = query(notesRef, where("title", ">=", search), where("title", "<=", search + '\uf8ff'), orderBy("title", 'desc'),  orderBy("hearted", 'desc'))
  if(search === ""){
    q = query(notesRef, orderBy("hearted", 'desc'), orderBy("timeStamp", "desc"))
  }
  
  await getDocs(q).then((results) => {
    results.forEach((doc) => {
      data.push(doc.data())
    });
  })
  
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

const addToFavourite = async (uid, refId, status) => {
  const noteRef = doc(db, "notes/" + uid + "/note", refId);
  await updateDoc(noteRef, {
    hearted: status
  });
}

export const auth = getAuth();
export const db = getFirestore();
export { addNote, getNotes, updateNotes, deleteNotes, addToFavourite };
