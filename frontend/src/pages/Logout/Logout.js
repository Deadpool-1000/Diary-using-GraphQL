import React, { useContext, useEffect } from "react";
import AuthContext from "../../store/auth-context";
import { Navigate } from "react-router-dom";
function Logout(){
    const authCtx = useContext(AuthContext);
    useEffect(()=>{
        authCtx.logout();
    });
    return <Navigate to='/'/>;
}

export default Logout;