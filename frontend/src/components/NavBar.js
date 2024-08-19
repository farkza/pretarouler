import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../img/pretarouler-logo.png';
import userLogo from '../img/user-logo.svg';
import '../css/navbar.css';

const NavBar = () => {
  const location = useLocation();
  const [userFirstName, setUserFirstName] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);

      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/get_user_by_token/${storedAccessToken}`);
          if (response.ok) {
            const userDataFromServer = await response.json();
            setUserFirstName(userDataFromServer.first_name); // Mise à jour du first_name
          } else {
            console.error('Erreur lors de la récupération des données utilisateur');
          }
        } catch (error) {
          console.error('Erreur réseau', error);
        }
      };

      fetchUserData();
    }
  }, []);

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setAccessToken('');
    setUserFirstName('');
    // Autres étapes de déconnexion...
  };

  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav>
        <ul>
          <li><Link to="/home" className={getNavLinkClass('/home')}>Accueil</Link></li>
          <li><Link to="/catalog" className={getNavLinkClass('/catalog')}>Catalogue</Link></li>
          <li><Link to="/about" className={getNavLinkClass('/about')}>À propos</Link></li>
        </ul>
      </nav>
      {accessToken ? (
        <div className="user-info">
          <span onClick={handleLogout}>{userFirstName}</span> {/* Afficher le first_name */}
          <img src={userLogo} alt="User Logo" />
        </div>
      ) : (
        <Link to="/login">
          <button className="login-button">Se connecter</button>
        </Link>
      )}
    </header>
  );
};

export default NavBar;
