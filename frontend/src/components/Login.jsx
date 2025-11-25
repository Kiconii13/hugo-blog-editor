import React, { useState } from "react";

// Simple login form component
const Login = ({ onLogin }) => {
  // Local state for username, password, and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get credentials from environment variables
    const ADMIN_USER = process.env.REACT_APP_ADMIN_USER;
    const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS;

    // Check if entered credentials match
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      onLogin(); // Unlock the editor
    } else {
      setError("Invalid credentials"); // Show error message
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Submit button */}
        <button type="submit">Login</button>
      </form>
      {/* Display error if login fails */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
