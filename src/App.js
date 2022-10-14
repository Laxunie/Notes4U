import { AuthContextProvider } from "./Auth/AuthAPI";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Home, ProtectedRoutes, Notes, Login} from './components'
import React from 'react'

function App() {
  return (
    <div>
      <BrowserRouter basename="/">
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route
              path="/notes"
              element={
                <ProtectedRoutes>
                  <Notes/>
                </ProtectedRoutes>
              }
            />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
    
  );
}

export default App;
