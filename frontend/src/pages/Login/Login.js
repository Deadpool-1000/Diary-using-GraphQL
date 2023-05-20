import React, { useContext, useReducer, useState } from "react";
import { useRef } from "react";
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ModalComponent from "../../components/modal/ModalComponent";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


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
  }
}

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [login, { loading }] = useMutation(LOGIN_USER);
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
    const response = await login({ variables: { username, password } });

    //calculating expiration time and getting token from response
    const token = response.data.login.token;
    const expiresIn = response.data.login.expiresIn;
    const expTime = new Date(new Date().getTime() + +expiresIn * 1000);

    //Local Storage
    authCtx.login(token, expTime)

    //set-up Modal
    dispatch({ type: "LOGIN_SUCCESS", username: response.data.login.user.username })
    setShowModal(true);
  }


  return <Form className="w-50 container-md px-3 py-3" onSubmit={submitHandler}>
    <h1 className="display-4">Login</h1>
    <ModalComponent show={showModal} handleClose={closeHandler} title={modalContent.title} body={modalContent.message} />
    <Form.Group className="mx-auto mb-3">
      <Form.Label htmlFor="username">Username</Form.Label><br />
      <Form.Control type="text" id="username" ref={usernameRef} />
    </Form.Group>
    <Form.Group className="mx-auto mb-3">
      <Form.Label htmlFor="password">Password</Form.Label><br />
      <Form.Control type="text" id="password" ref={passwordRef} />
    </Form.Group>
    <Button className="btn btn-dark" type="submit">{loading ? "Submitting..." : "Login"}</Button>
  </Form>
}

export default Login;