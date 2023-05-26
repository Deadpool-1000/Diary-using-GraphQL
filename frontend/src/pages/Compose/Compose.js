import { useMutation, gql } from '@apollo/client';
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ModalComponent from '../../components/modal/ModalComponent';
import useInput from '../../utils/use-input';
import styles from './Compose.module.css';
import Spinner from 'react-bootstrap/Spinner';


const ADD_POST = gql`
mutation AddPost($title: String!, $description: String!) {
  addPost(title: $title, description: $description) {
    title,
    description
  }
}
`;




function Compose() {
  let errorMessage = '';
  const { value: title, changeHandler: titleChangeHandler, blurHandler: titleBlurHandler, reset: resetTitle, isInvalid: titleHasError, isValid: titleIsValid } = useInput((val) => val.trim() !== '');
  const { value: body, changeHandler: bodyChangeHandler, blurHandler: bodyBlurHandler, reset: resetBody, isInvalid: bodyHasError, isValid: bodyIsValid } = useInput((val) => val.trim() !== '');
  const [showModal, setShowModal] = useState(false);
  const [compose, { error, loading }] = useMutation(ADD_POST);

  let formIsValid = false;
  if (titleIsValid && bodyIsValid) {
    formIsValid = true;
  }
  async function submitHandler(e) {
    e.preventDefault();
    if (!formIsValid) {
      return;
    }


    await compose({ variables: { title, description: body } });
    resetTitle();
    resetBody();
    setShowModal(true);
  }

  if (error) {
    if (error.networkError) {
      errorMessage = "There was a network error";
    } else {
      errorMessage = 'An error occured'
    }
  }

  return (
    <Form className="w-50 container-md px-3 py-3" onSubmit={submitHandler} >
      <h1 className="display-4">Compose</h1>
      {errorMessage && <h3 className={styles.error}>{errorMessage}</h3>}
      <ModalComponent show={showModal} handleClose={() => setShowModal(false)} title="Success" body="Your diary entry was added successfully" />
      <Form.Group className="mx-auto mb-3">
        <Form.Label htmlFor="title">Title</Form.Label><br />
        <Form.Control onChange={titleChangeHandler} onBlur={titleBlurHandler} type="text" id="title" value={title} />
        {titleHasError && <p className={styles.error}>This field can't be empty</p>}
      </Form.Group>
      <Form.Group className="mx-auto mb-3">
        <Form.Label htmlFor="body">Description</Form.Label><br />
        <Form.Control onChange={bodyChangeHandler} onBlur={bodyBlurHandler} as="textarea" rows={6} id="body" value={body} />
        {bodyHasError && <p className={styles.error}>This field can't be empty</p>}
      </Form.Group>
      <Button className="btn btn-dark" disabled={loading || !formIsValid ? true : false} type="submit">{loading ? (<><Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      /> submitting...</>) : "Submit"}</Button>
    </Form >
  )

}

export default Compose