import {
  onAuthStateChanged,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signOut
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState({});

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:3000/login',
    // This must be true.
    handleCodeInApp: true,
  };

  const SendEmail = async (email) => {
    try{
      await sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
        window.localStorage.setItem('emailForSignIn', email);
      })
    }
    catch{

    }
  }

  const SignIn = async () => {
    try{
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        console.log(email)
        if (!email) {
            email = window.prompt('Please provide your email for confirmation');
        }
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            <Navigate to="/notes"/>
          })
          .catch((error) => {
            console.log(error)
          });
      }
    }
    catch(error){
      console.log(error)
    }
  }

  const SignOut = async () => {
    signOut(auth)
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
        SendEmail,
        SignIn,
        SignOut,
        user
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
