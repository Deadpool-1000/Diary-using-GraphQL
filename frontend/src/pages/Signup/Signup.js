import { gql, useMutation } from "@apollo/client"
import { useRef, useReducer,useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../components/modal/ModalComponent";
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
    }
}


export default function Signup() {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const emailRef = useRef();
    const fullnameRef = useRef();
    const navigate = useNavigate()
    const [signup, { loading }] = useMutation(ADD_USER);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, dispatch] = useReducer(reducer, { title: "", message: "" })

    function closeHandler() {
        setShowModal(false);
        navigate('/login')
    }

    async function submitHandler(e) {
        e.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const fullName = fullnameRef.current.value;
        const email = emailRef.current.value;

        const response = await signup({ variables: { username, password, email, fullName } });
        console.log(response);
        if(response.data.addUser){
            dispatch({ type: "SIGNUP_SUCCESS"})
            setShowModal(true);
        }
    }


    return <>
        <form onSubmit={submitHandler}>
            <ModalComponent show={showModal} handleClose={closeHandler} title={modalContent.title} body={modalContent.message} />
            <div>
                <label htmlFor="username">Username</label><br />
                <input type="text" id="username" ref={usernameRef} />
            </div>
            <div>
                <label htmlFor="email">Email</label><br />
                <input type="text" id="email" ref={emailRef} />
            </div>
            <div>
                <label htmlFor="password">Password</label><br />
                <input type="text" id="password" ref={passwordRef} />
            </div>
            <div>
                <label htmlFor="fullName">Full Name</label><br />
                <input type="text" id="fullName" ref={fullnameRef} />
            </div>
            <button type="submit">{loading ? "Loading..." : "Signup"}</button>
        </form>
    </>
}