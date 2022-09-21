import { AuthContextProvider } from "./Auth/AuthAPI";
import SignIn from './signIn'
import React, {useState} from 'react'

function App() {
  return (
    <div>
      <AuthContextProvider>
        <SignIn/>
        
      </AuthContextProvider>
    </div>
    
  );
}

export default App;
