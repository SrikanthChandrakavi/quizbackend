import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number.');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      errors.push('Password must contain at least one special character (e.g., !@#$%).');
    }
    return errors;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const errors = validatePassword(newPassword);
    setPasswordErrors(errors);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        username,
        email,
        password,
        role
      });
      if (response.status === 200) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Registration failed. Please ensure your password meets all requirements.');
      } else {
        alert('Registration failed. Email may already be in use.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {passwordErrors.length > 0 && (
            <ul className="password-errors">
              {passwordErrors.map((error, index) => (
                <li key={index} className="error-message">{error}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button type="submit" className="auth-btn">Register</button>
      </form>
    </div>
  );
};

export default Register;