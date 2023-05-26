import React, { useContext } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button  from "react-bootstrap/Button";
import AuthContext from "../store/auth-context";
import { useNavigate } from "react-router-dom";

function Bar() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <Navbar  expand="lg" className="mx-auto">
      <Container>
        <Navbar.Brand href="/">Diary</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {authCtx.isLoggedIn && <Nav.Link href="/diary">Home</Nav.Link>}
            {authCtx.isLoggedIn && <Nav.Link href="/compose">Compose</Nav.Link>}
          </Nav>
          {authCtx.isLoggedIn && <Nav className="ms-auto">
            <Button variant="dark" onClick={()=>navigate('/logout')}>Logout</Button>
          </Nav>}
          {!authCtx.isLoggedIn && <Nav className="ms-auto">
            <Button onClick={()=>navigate('/login')} variant="dark" >Login</Button>
          </Nav>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Bar;
