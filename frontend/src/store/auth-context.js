import React, { useState } from "react";

const AuthContext = React.createContext({
    token:'',
    isLoggedIn:false,
    login: function(token){},
    logout: function(){}
});
let logoutTimer;


function getExpirationTime(expTime){
    const currentTime = new Date().getTime();
    const adjExpTime = new Date(expTime).getTime();
    return adjExpTime-currentTime;
}
function getStoredToken(){
    const initialToken = localStorage.getItem('token');
    const storedExpDate = localStorage.getItem('expTime');
    const remainingTime = getExpirationTime(storedExpDate);
    if(remainingTime<=0){
        localStorage.removeItem('token');
        localStorage.removeItem('expTime');
        return null;
    }
    return {
        token:initialToken,
        duration:remainingTime
    };
}

export function AuthContextProvider(props){
    const store=getStoredToken();
    let init ='';
    if(store){
        init=store.token;
    }
    const [token,setToken]=useState(init);
    const userIsLoggedIn = !!token;
    function logoutHandler(){
        setToken(null);
        localStorage.removeItem('token');
        if(logoutTimer){
            clearTimeout(logoutTimer);
        }
    }
    function loginHandler(token,expTime){
        localStorage.setItem('token',token);
        localStorage.setItem('expTime',expTime);
        setToken(token);
        const remainingTime = getExpirationTime(expTime);
        logoutTimer=setTimeout(logoutHandler,remainingTime);
    }
    const contextValue ={
        token,
        isLoggedIn:userIsLoggedIn,
        login:loginHandler,
        logout:logoutHandler
    };
    return ( 
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

