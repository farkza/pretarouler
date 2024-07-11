import React, { useState, useEffect } from 'react';
import '../css/home.css';
import {Link, useNavigate } from 'react-router-dom';
import Car from '../components/Car'; // Import du composant Car
import FAQ from '../components/FAQ'; // Import du composant FAQ
import Navbar from '../components/NavBar';

function Home() {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setAccessToken(token); 

    const userIsLoggedIn = !!token;
    setIsLoggedIn(userIsLoggedIn);

    if (userIsLoggedIn) {
      fetchUserData(token);
    }

    fetchCarDetails();
  }, []);

  const fetchUserData = async (accessToken) => {
    try {
      const response = await fetch('http://localhost:8000/api/get_user_by_token/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error fetching user data');
      }
      const data = await response.json();
      setUserFirstName(data.first_name);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCarDetails = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cars/664e2e2a23a8e0dcdc3e567f');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCar(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="Home">
      <Navbar isLoggedIn={isLoggedIn} userFirstName={userFirstName} handleLogout={handleLogout} />

      <main className="car-details">
        <div className="main-container">
          <div className="car-container">
            <h1>{car.model}</h1>
            <div className="car-img">
              <img src={`http://localhost:8000${car.img}`} alt={`${car.brand} ${car.model}`} />
            </div>
          </div>
        </div>
        <div className="car-info">
          <div className="car-info-item">
            <span className="car-info-value">{car.horsepower}</span>
            <span className="car-info-title">Chevaux</span>
          </div>
          <div className="car-info-separator"></div>
          <div className="car-info-item">
            <span className="car-info-value">{car.acceleration_0_100}s</span>
            <span className="car-info-title">0-100 km/h</span>
          </div>
          <div className="car-info-separator"></div>
          <div className="car-info-item">
            <span className="car-info-value">{car.autonomy} km</span>
            <span className="car-info-title">Autonomie</span>
          </div>
          <div className="car-info-separator"></div>
          <div className="car-info-item">
            <span className="car-info-value">{car.fuel_type}</span>
            <span className="car-info-title">Type d'essence</span>
          </div>
          <div className="reserve-container">
            <Link to="/catalog">
              <button className="reserve-button">Réserver</button>
            </Link>
          </div>
        </div>
      </main>
      
      <section className="most-rented">
        <h2 className="most-rented-title">Les plus louées</h2>
        <h3 className="most-rented-subtitle">Réserve ta voiture dès maintenant !</h3>
        <Car />
      </section>
      <section className="most-rented">
        <h2 className="most-rented-title">Proche de chez vous</h2>
        <h3 className="most-rented-subtitle">Loue une voiture à côté de chez toi</h3>
        <Car accessToken={accessToken} />
      </section>
      <section className="advertisement">
        <h1 className="bottom-section-title">Conduit la tienne aujourd’hui</h1>
        <h2 className="bottom-section-subtitle">Visite dès maintenant notre catalogue de véhicule et réserve la voiture de tes rêves !</h2>
        <Link to="/catalog">
          <button className="bottom-section-button">Réservez maintenant</button>
        </Link>
      </section>
      <section className="faq-section-wrapper">
        <FAQ />
      </section>
      <footer>
        <p>&copy; 2024 Pret A Rouler</p>
      </footer>
    </div>
  );
}

export default Home;
