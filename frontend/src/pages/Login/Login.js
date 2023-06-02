import React, { useContext, useReducer, useState } from "react";
import { useRef } from "react";
import { gql, useMutation } from '@apollo/client';
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ModalComponent from "../../components/modal/ModalComponent";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import styles from './Login.module.css';



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

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        title: "Sucess!",
        message: `You were logged in successfully 😃,${action.username}`
      }
    default: return state
  }
}

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  let errorMessage = '';
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [login, { client, loading, error }] = useMutation(LOGIN_USER);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, dispatch] = useReducer(reducer, { title: "", message: "" })
  function closeHandler() {
    setShowModal(false);
    navigate('/diary')
  }

  async function submitHandler(e) {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    
    try {
      const response = await login({ variables: { username, password } });
      //calculating expiration time and getting token from response
      const token = response.data.login.token;
      const expiresIn = response.data.login.expiresIn;
      const expTime = new Date(new Date().getTime() + +expiresIn * 1000);

      client.clearStore();
      //Local Storage
      authCtx.login(token, expTime)

      //set-up Modal
      dispatch({ type: "LOGIN_SUCCESS", username: response.data.login.user.username })
      setShowModal(true);
    } catch (e) {
      errorMessage=e.message
    }
  }
  if (error) {
    if (error.networkError) {
      errorMessage = "There was a network error";
    } else {
      errorMessage = error.message;
    }
  }


  return <Form className="w-50 container-md px-3 py-3" onSubmit={submitHandler}>
    <h1 className="display-4">Login</h1>
    {errorMessage && <h3 className={styles.error}>{errorMessage}</h3>}
    <ModalComponent show={showModal} handleClose={closeHandler} title={modalContent.title} body={modalContent.message} />
    <Form.Group className="mx-auto mb-3">
      <Form.Label htmlFor="username">Username</Form.Label><br />
      <Form.Control type="text" id="username" ref={usernameRef} />
    </Form.Group>
    <Form.Group className="mx-auto mb-3">
      <Form.Label htmlFor="password">Password</Form.Label><br />
      <Form.Control type="text" id="password" ref={passwordRef} />
    </Form.Group>
    <Button className="btn btn-dark" disabled={loading ? true : false} type="submit">{loading ? (<><Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    /> Submitting...</>) : "Login"}</Button>
    <p>new user <Link to='/signup'>signup here</Link></p>
  </Form>
}

export default Login;