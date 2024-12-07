
import axios from "axios";
import React, { useState } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // To store dynamic alert messages
  const [alertVisible, setAlertVisible] = useState(false);

  const navigate = useNavigate();
  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setAlertMessage("Please fill the missing fields.");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 10000);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match.");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 10000);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password },
        config
      );

      setAlertMessage("Registration Successful");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 50000);

      // Store user info and navigate
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      setAlertMessage("Error Occurred!");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 50000);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <Form style={{ width: "80%" }}>
        {alertVisible && (
          <Alert variant="secondary" className="text-center">
            {alertMessage}
          </Alert>
        )}
        <Form.Group className="mb-3" controlId="first-name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={show ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirm-password">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={show ? "text" : "password"}
              placeholder="Confirm Your Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputGroup>
        </Form.Group>

        <Button
          style={{ backgroundColor: "#2cc3ff", width: "100%" }}
          className="mt-3"
          onClick={submitHandler}
        >
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
