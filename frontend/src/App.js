import React, { useContext } from "react";
import Login from './pages/Login/Login';
import Compose from "./pages/Compose/Compose";
import Diary from "./pages/Diary/Diary"
import Home from "./pages/Home/Home"
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import AuthContext from "./store/auth-context";
function App() {
  const authCtx = useContext(AuthContext)
  return (
    
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/diary" element={authCtx.isLoggedIn ? <Diary /> : <Navigate to="/" replace="true" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/compose" element={authCtx.isLoggedIn ? <Compose /> : <Navigate to="/" replace="true" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<App />} />
      </Routes>
    
  );
}

export default App;
