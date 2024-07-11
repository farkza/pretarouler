import React, { useState, useEffect, useCallback } from 'react';
import '../css/catalog.css';
import Navbar from '../components/NavBar';
import Car from '../components/Car'; // Import du composant Car

const Catalog = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cars, setCars] = useState([]);
  const [location, setLocation] = useState('');
  const [brand, setBrand] = useState('');
  const [sortOrder, setSortOrder] = useState('relevance');

  const fetchCars = useCallback(async () => {
    try {
      let apiUrl = 'http://localhost:8000/api/cars';

      // Si l'emplacement, la marque ou le tri sont spécifiés
      if (location || brand || sortOrder === 'newest') {
        apiUrl += '?';

        // Si l'emplacement est spécifié
        if (location) {
          apiUrl += `city=${location}`;
        }

        // Si la marque est spécifiée
        if (brand) {
          if (location) apiUrl += '&';
          apiUrl += `brand=${brand}`;
        }

        // Si le tri par les plus récents est spécifié
        if (sortOrder === 'newest') {
          if (location || brand) apiUrl += '&';
          apiUrl += 'sort=newest';
        }
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Error fetching filtered cars');
      }
      const data = await response.json();

      // Si le tri est par pertinence, laissez les données intactes, sinon inversez l'ordre
      if (sortOrder === 'relevance') {
        setCars(data);
      } else {
        setCars([...data].reverse()); // inversion de l'ordre des données
      }
    } catch (error) {
      console.error('Error filtering cars:', error);
    }
  }, [location, brand, sortOrder]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    fetchCars();
  }, [location, brand, sortOrder, fetchCars]);

  const handleReset = async () => {
    setLocation('');
    setBrand('');
    setSortOrder('relevance');
    await fetchCars();
  };

  return (
    <div className="Catalog">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={() => localStorage.removeItem('access_token')} />
      <div className="filters">
        <div className="filter">
          <label>Localisation</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Toutes les localisations</option>
            <option value="Toulouse">Toulouse</option>
            <option value="Paris">Paris</option>
          </select>
        </div>
        <div className="filter">
          <label>Marque</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">Toutes les marques</option>
            <option value="Porsche">Porsche</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes">Mercedes</option>
          </select>
        </div>
        <div className="filter">
          <label>Tri</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="relevance">Pertinence</option>
            <option value="newest">Les plus récents</option>
          </select>
        </div>
        <div className="filter-buttons">
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
      <div className="car-list">
        <Car cars={cars} selectedLocation={location} selectedBrand={brand} sortOrder={sortOrder} />
      </div>
    </div>
  );
};

export default Catalog;
