import React, { useState, useEffect } from 'react';
import '../css/car.css';
import { Link } from 'react-router-dom';

const Car = ({ accessToken, selectedLocation, selectedBrand, sortOrder }) => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulation de récupération des voitures depuis une API
    const fetchCars = async () => {
      try {
        // Remplacez cette URL par votre API endpoint pour récupérer les voitures
        const response = await fetch('http://localhost:8000/api/cars');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    // Simulation de récupération des données utilisateur
    const fetchUserData = async () => {
      try {
        // Remplacez cette URL par votre API endpoint pour récupérer les données utilisateur
        const response = await fetch(`http://localhost:8000/api/get_user_by_token/${accessToken}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserId(userData._id.toString()); // Convertir l'ID en chaîne de caractères
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  // Récupérer la ville de l'utilisateur si accessToken est fourni
  useEffect(() => {
    const fetchUserCity = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(`http://localhost:8000/api/get_user_by_token/${accessToken}`);
        if (!response.ok) {
          throw new Error('Error fetching user city');
        }
        const userData = await response.json();
        setCity(userData.city);
      } catch (error) {
        setError(error);
      }
    };

    fetchUserCity();
  }, [accessToken]);

  // Filtrage des voitures en fonction des critères sélectionnés
  let filteredCars = cars;

  // Filtrer les voitures par ville de l'utilisateur si accessToken est fourni
  if (accessToken && city) {
    filteredCars = filteredCars.filter(car => car.city === city); // Adapter la logique selon votre modèle de données
  }

  // Filtrer les voitures par selectedLocation
  if (selectedLocation && selectedLocation !== "") {
    filteredCars = filteredCars.filter(car => car.city === selectedLocation);
  }

  // Filtrer les voitures par selectedBrand
  if (selectedBrand && selectedBrand !== "") {
    filteredCars = filteredCars.filter(car => car.brand === selectedBrand);
  }

  // Exclure une voiture spécifique par son ID
  filteredCars = filteredCars.filter(car => car.id !== '664e2e2a23a8e0dcdc3e567f');

  // Inverser l'ordre des voitures si l'ordre est "newest"
  if (sortOrder === "newest" && selectedLocation === "" && selectedBrand === "") {
    filteredCars = filteredCars.reverse();
  }

  const handleCardClick = car => {
    setSelectedCar(car);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedCar(null);
  };

  return (
    <div>
      {filteredCars.map((car, index) => (
        <div className="car-card" key={index} onClick={() => handleCardClick(car)}>
          <div className="car-card-details">
            <h3>{car.model}</h3>
            <h4>{car.brand}</h4>
            <img src={`http://localhost:8000${car.img}`} alt={`${car.brand} ${car.model}`} />
            <p>
              <span>{car.price_per_day}€</span><span>/jour</span>
            </p>
          </div>
        </div>
      ))}

      {isPopupVisible && selectedCar && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-left">
              <div className="popup-image-container">
                <img src={`http://localhost:8000${selectedCar.img}`} alt={`${selectedCar.brand} ${selectedCar.model}`} />
              </div>
              <p>Autres photos à venir</p>
            </div>
            <div className="popup-right">
              <h3>{selectedCar.model}</h3>
              <h4>{selectedCar.brand}</h4>
              <p><strong>Horsepower:</strong> {selectedCar.horsepower}</p>
              <p><strong>Autonomy:</strong> {selectedCar.autonomy}</p>
              <p><strong>Acceleration (0-100):</strong> {selectedCar.acceleration_0_100}s</p>
              <p><strong>GPS:</strong> {selectedCar.GPS ? 'Yes' : 'No'}</p>
              <p><strong>Air Conditioning:</strong> {selectedCar.air_conditioning ? 'Yes' : 'No'}</p>
              <p><strong>Fuel Consumption:</strong> {selectedCar.fuel_consumption}L/100km</p>
              <p><strong>Fuel Type:</strong> {selectedCar.fuel_type}</p>
              <p><strong>City:</strong> {selectedCar.city}</p>
              <p><strong>Price per day:</strong> {selectedCar.price_per_day}€</p>
              <Link to={`/reservation/${selectedCar.id}`} className="reserve-button">Réserver</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Car;
