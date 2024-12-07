import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleShowPassword = () => setShow(!show);

  const handleSubmit = async () => {
    try {
      // Fetch the list of friends/users from the backend
      const { data } = await axios.get("/api/user/friends");
      const users = Array.isArray(data) ? data : data.users; // Adjust to match the backend response
      const user = users.find((user) => user.email === email);

      console.log("Backend response:", user);
      // Find user by email

      if (user) {
        // Compare the password
        const matchedPassword = password === user.password;

        if (matchedPassword) {
          console.log("Login successful:", user);
          // Redirect to the dashboard
          navigate("/dashboard");
          localStorage.setItem("userInfo", JSON.stringify(user));
        } else {
          alert("Invalid password. Please try again.");
        }
      } else {
        alert("No user found with this email.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center mt-4">
      <Form style={{ width: "80%" }}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={show ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={handleShowPassword}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputGroup>
        </Form.Group>

        <Button
          className="mb-3"
          style={{ backgroundColor: "#2cc3ff", width: "100%" }}
          onClick={handleSubmit}
        >
          Login
        </Button>

        <Button
          style={{
            backgroundColor: "#f33a3a",
            width: "100%",
          }}
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Get Guest User Credentials
        </Button>
      </Form>
    </div>
  );
};

export default Login;
