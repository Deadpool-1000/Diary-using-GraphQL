import React, { useContext, useReducer, useState } from "react";
import { useRef } from "react";
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ModalComponent from "../../components/modal/ModalComponent";


const LOGIN_USER = gql`
    mutation Login($username: String!, $password: String!){
      login(username: $username, password: $password) { 
        user {
          username
        }, 
        token,
        expiresIn
      }
    }
`;

function reducer(state,action){
  switch(action.type){
    case "LOGIN_SUCCESS":
      return {
        title:"Sucess!",
        message:`You were logged in successfully 😃,${action.username}`
      }
  }
}

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [login, { loading }]=useMutation(LOGIN_USER);
  const [showModal,setShowModal]=useState(false);
  const [ modalContent, dispatch ]=useReducer(reducer,{title:"",message:""})
  function closeHandler(){
    setShowModal(false);
    navigate('/diary')
  }

  async function submitHandler(e) {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const response = await login({variables:{username,password}});
    
    //calculating expiration time and getting token from response
    const token = response.data.login.token;
    const expiresIn = response.data.login.expiresIn;
    const expTime = new Date(new Date().getTime() + +expiresIn * 1000);
    
    //Local Storage
    authCtx.login(token,expTime)

    //set-up Modal
    dispatch({type:"LOGIN_SUCCESS",username:response.data.login.user.username})
    setShowModal(true);
  }


  return <form onSubmit={submitHandler}>
    <ModalComponent show={showModal} handleClose={closeHandler} title={modalContent.title} body={modalContent.message} />
    <div>
      <label htmlFor="username">Username</label><br />
      <input type="text" id="username" ref={usernameRef} />
    </div>
    <div>
      <label htmlFor="password">Password</label><br />
      <input type="text" id="password" ref={passwordRef} />
    </div>
    <button type="submit">{loading?"Submitting...":"Login"}</button>
  </form>
}

export default Login;