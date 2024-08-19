// pages/CreateAccount.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/pretarouler-logo.png';
import '../css/login.css';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [mainActivity, setMainActivity] = useState('');
  const [status, setStatus] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Toulouse');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    // Validation du numéro de téléphone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Le numéro de téléphone doit comporter 10 chiffres.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/create_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          first_name: firstName,
          age: parseInt(age),
          email,
          main_activity: mainActivity,
          status,
          phone_number: phoneNumber,
          password,
          city,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      // Redirection vers la page de connexion après la création du compte
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="PretaRouler Logo" className="logo" />
      <h2>Créer un compte</h2>
      <form className="login-form" onSubmit={handleCreateAccount}>
        <input 
          type="text" 
          placeholder="Nom" 
          className="login-input" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Prénom" 
          className="login-input" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Âge" 
          className="login-input" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="login-input" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Activité principale" 
          className="login-input" 
          value={mainActivity} 
          onChange={(e) => setMainActivity(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Statut" 
          className="login-input" 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Numéro de téléphone" 
          className="login-input" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          required 
        />
        <select 
          className="login-input" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          required
        >
          <option value="Toulouse">Toulouse</option>
          <option value="Paris">Paris</option>
        </select>
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
          <button type="submit" className="login-btn">Créer un compte</button>
          <button type="button" className="create-account-btn" onClick={() => navigate('/login')}>
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
