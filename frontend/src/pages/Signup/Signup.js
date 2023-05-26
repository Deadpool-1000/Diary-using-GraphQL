import { gql, useMutation } from "@apollo/client"
import {  useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../components/modal/ModalComponent";
import Form from "react-bootstrap/Form";
import styles from './Signup.module.css';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import useInput from '../../utils/use-input';

const ADD_USER = gql`
    mutation AddUser($username: String!, $password: String!, $email: String!, $fullName: String!) {
       addUser(username: $username, password: $password, email: $email, fullName: $fullName) {
         username
       } 
    }
`;

function reducer(state, action) {
    switch (action.type) {
        case "SIGNUP_SUCCESS":
            return {
                title: "Success!",
                message: "You have successfully signed-up 😃"
            }
        default:
            return state;
    }
}
function emailValidator(val){
    val=val.trim();
    const mailFormat = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
    if(val.length===0) return false;
    if(!val.match(mailFormat)) return false;
    return true;
}

export default function Signup() {
    let errorMessage='';
    const {value:username,blurHandler:usernameBlurHandler, changeHandler:usernameChangeHandler, isInvalid:usernameHasError , isValid:usernameIsValid}= useInput((val)=>val.trim()!=='');
    const {value:password,blurHandler:passwordBlurHandler, changeHandler:passwordChangeHandler,isValid:passwordIsValid, isInvalid:passwordHasError} = useInput((val)=>val.trim().length>6);
    const {value:email,blurHandler:emailBlurHandler, changeHandler:emailChangeHandler,isValid:emailIsValid, isInvalid:emailHasError} = useInput(emailValidator);
    const {value:fname,blurHandler:fnameBlurHandler, changeHandler:fnameChangeHandler,isValid:fnameIsValid, isInvalid:fnameHasError} = useInput((val)=>val.trim()!=='');

    let formIsValid = false;
    if(usernameIsValid && emailIsValid && passwordIsValid && fnameIsValid){
        formIsValid=true;
    }

    const navigate = useNavigate()
    const [signup, { loading, error }] = useMutation(ADD_USER);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, dispatch] = useReducer(reducer, { title: "", message: "" })
    function closeHandler() {
        setShowModal(false);
        navigate('/login')
    }

    async function submitHandler(e) {
        e.preventDefault();
        if(!formIsValid){
            return;
        }
        try {
            const response = await signup({ variables: { username, password, email, fullName:fname } });
            console.log(response);
            if (response.data.addUser) {
                dispatch({ type: "SIGNUP_SUCCESS" })
                setShowModal(true);
            }
        } catch (e) {}
    }
    if(error){
        if (error.networkError) {
            errorMessage="There was a network error";
        } else {
            errorMessage='An error occured'
        }
    }

    return <>
        <Form className="w-50 container-md px-3 py-3" onSubmit={submitHandler}>
            <h1 className="display-4">Signup</h1>
            {errorMessage && <h3 className={styles.error}>{errorMessage}</h3>}
            <ModalComponent show={showModal} handleClose={closeHandler} title={modalContent.title} body={modalContent.message} />
            <Form.Group className="mx-auto mb-3">
                <Form.Label htmlFor="username">Username</Form.Label><br />
                <Form.Control type="text" onBlur={usernameBlurHandler} onChange={usernameChangeHandler} id="username" value={username} />
                {usernameHasError && <p className={styles.error}>Please enter your Username correctly.</p>}
            </Form.Group>
            <Form.Group className="mx-auto mb-3">
                <Form.Label htmlFor="email">Email</Form.Label><br />
                <Form.Control type="text" onBlur={emailBlurHandler} onChange={emailChangeHandler} id="email" value={email} />
                {emailHasError&& <p className={styles.error}>Please enter your email correctly.</p>}
            </Form.Group>
            <Form.Group className="mx-auto mb-3">
                <Form.Label htmlFor="password">Password</Form.Label><br />
                <Form.Control type="text" onBlur={passwordBlurHandler} onChange={passwordChangeHandler} id="password" value={password}/>
                {passwordHasError && <p className={styles.error}>Password must be atleat 6 character long.</p>}
            </Form.Group>
            <Form.Group className="mx-auto mb-3">
                <Form.Label htmlFor="fullName">Full Name</Form.Label><br />
                <Form.Control type="text" onBlur={fnameBlurHandler} onChange={fnameChangeHandler} id="fullName" value={fname} />
                {fnameHasError && <p className={styles.error}>Please Enter your full name correctly.</p>}
            </Form.Group> 
            <Button className="btn btn-dark" disabled={loading ||!formIsValid ? true : false} type="submit">{loading ? (<><Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            /> Loading...</>) : "Signup"}</Button>
        </Form>
    </>
}