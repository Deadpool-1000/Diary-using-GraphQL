import React, { useContext, useEffect } from "react";
import AuthContext from "../../store/auth-context";
import { Navigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
const LOGOUT_USER = gql`
    mutation LOGOUT_USER{
        logout
    }
`;
function Logout() {
    const [logout,{loading,error,client}] = useMutation(LOGOUT_USER);
    const authCtx = useContext(AuthContext);
    useEffect(() => {
        async function logoutUser() {
            try {
               await logout();
                authCtx.logout();
                client.clearStore();
            } catch (e) {
                console.log(e);
            }
        }
        logoutUser();
       
    }, [authCtx,logout])
    if(error){
        return <h1>There was an error</h1>//will never run 
    } else return <Navigate to='/' />;
}

export default Logout;