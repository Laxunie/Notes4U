import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({})

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:3000',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    dynamicLinkDomain: 'example.page.link'
  };

  const SignInEmail = async (email) => {
    try{
      sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        console.log(user)
      })
    }
    catch{

    }
  }

  useEffect(() => {
    const AuthState = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      AuthState();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        SignInEmail
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
