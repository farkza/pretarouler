// pages/Login.js
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import logo from '../img/pretarouler-logo.png';
import '../css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      const { access_token } = await response.json();
      localStorage.setItem('access_token', access_token); // Stocker l'access_token dans localStorage

      // Récupérer les informations utilisateur...
      const userResponse = await fetch(`http://localhost:8000/api/get_user/?email=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.detail);
      }

      const userData = await userResponse.json();

      // Stocker les informations utilisateur dans des cookies
      Cookies.set('user_id', userData._id);
      Cookies.set('user_name', userData.name);
      Cookies.set('user_first_name', userData.first_name);
      Cookies.set('user_email', userData.email);

      // Redirection après connexion réussie
      window.location.href = `/home`; 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="PretaRouler Logo" className="logo" />
      <h2>Connectez-vous</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          className="login-input" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          className="login-input" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {error && <p className="error-message">{error}</p>}
        <div className="form-footer">
          <button type="button" className="create-account-btn">Créer un compte</button>
          <button type="submit" className="login-btn">Se connecter</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
