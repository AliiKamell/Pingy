import React from "react";
import { Container, Nav, Tab, Card } from "react-bootstrap";
import Login from "../../components/Authentication/Login";
import Signup from "../../components/Authentication/Signup";

const Home = () => {
  return (
    <Container className="d-flex flex-column align-items-center">
      <Card
        className="text-center my-4 w-100"
        style={{ borderRadius: "0.5rem", border: "1px solid #ccc" }}
      >
        <Card.Body>
          <Card.Title style={{ fontSize: "2rem", fontFamily: "Work sans" }}>
            Stay Connected
          </Card.Title>
        </Card.Body>
      </Card>
      <Card
        className="w-100 p-3"
        style={{ borderRadius: "0.5rem", border: "1px solid #ccc" }}
      >
        <Tab.Container defaultActiveKey="login">
          <Nav variant="tabs" className="mb-3 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="login">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="signup">Sign Up</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="login">
              <Login />
            </Tab.Pane>
            <Tab.Pane eventKey="signup">
              <Signup />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card>
    </Container>
  );
};

export default Home;
