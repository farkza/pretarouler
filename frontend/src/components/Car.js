import React, { useState, useEffect } from 'react';
import '../css/car.css';
import { Link } from 'react-router-dom';
import Navbar from './NavBar'; // Assurez-vous que le chemin d'importation soit correct

const Car = ({ accessToken, selectedLocation, selectedBrand, sortOrder }) => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
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
    const fetchUserData = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(`http://localhost:8000/api/get_user_by_token/${accessToken}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserId(userData._id.toString());
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [accessToken]);

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

  let filteredCars = cars;

  if (accessToken && city) {
    filteredCars = filteredCars.filter(car => car.city === city);
  }

  if (selectedLocation && selectedLocation !== "") {
    filteredCars = filteredCars.filter(car => car.city === selectedLocation);
  }

  if (selectedBrand && selectedBrand !== "") {
    filteredCars = filteredCars.filter(car => car.brand === selectedBrand);
  }

  filteredCars = filteredCars.filter(car => car.id !== '664e2e2a23a8e0dcdc3e567f');

  if (sortOrder === "newest" && selectedLocation === "" && selectedBrand === "") {
    filteredCars = filteredCars.reverse();
  }

  const handleCardClick = car => {
    setSelectedCar(car);
    setIsPopupVisible(true);
    document.body.style.overflow = 'hidden'; // Bloquer le scroll de la page
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedCar(null);
    document.body.style.overflow = 'auto'; // Réactiver le scroll de la page
  };

  // Gérer le changement de page ou le retour en arrière
  const handleNavigation = () => {
    document.body.style.overflow = 'auto'; // Réactiver le scroll de la page lors du changement de page
  };

  // Utiliser useEffect pour écouter les changements de route
  useEffect(() => {
    const cleanupScrollLock = () => {
      document.body.style.overflow = 'auto'; // Réactiver le scroll de la page lorsque le composant est démonté
    };

    if (isPopupVisible) {
      document.body.style.overflow = 'hidden'; // Bloquer le scroll de la page lorsque la popup est ouverte
    } else {
      document.body.style.overflow = 'auto'; // Réactiver le scroll de la page lorsque la popup est fermée
    }

    window.addEventListener('popstate', handleNavigation); // Écouter les événements de navigation (retour arrière)
    return () => {
      window.removeEventListener('popstate', handleNavigation); // Désinscrire l'écouteur lors du démontage du composant
      cleanupScrollLock(); // Assurer que le scroll est réactivé lors du démontage du composant
    };
  }, [isPopupVisible]);

  // Fonction pour fermer la popup
  const handlePopupClose = () => {
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
              <span className="car-price">{car.price_per_day}€</span><span>/jour</span>
            </p>
          </div>
        </div>
      ))}

      {isPopupVisible && selectedCar && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Navbar /> {/* Inclure la Navbar ici */}
            {/* Bouton "Retour" en haut à gauche de la popup */}
            <div className="popup-content-2">
              <p className="back-to-top-btn" onClick={handlePopupClose}>
                Retour
              </p>
              <div className="popup-left">
                <div className="popup-image-container">
                  <img src={`http://localhost:8000${selectedCar.img}`} alt={`${selectedCar.brand} ${selectedCar.model}`} />
                </div>
                <p className='more-photos'>Autres photos à venir</p>
              </div>
              <div className="popup-right">
                <h3 className="car-model">{selectedCar.model}</h3>
                <h4 className="car-brand">{selectedCar.brand}</h4>
                <div className="stars-container">
                  {[...Array(5)].map((star, index) => (
                    <span key={index} className="star">&#9733;</span>
                  ))}
                  <span className='avis-container'>(127 avis)</span>
                </div>
                <div className="separator" style={{ backgroundColor: 'rgba(15, 14, 67, 0.2)' }}></div>
                <p><strong>Horsepower:</strong> {selectedCar.horsepower}</p>
                <p><strong>Autonomy:</strong> {selectedCar.autonomy}</p>
                <p><strong>Acceleration (0-100):</strong> {selectedCar.acceleration_0_100}s</p>
                <p><strong>GPS:</strong> {selectedCar.GPS ? 'Yes' : 'No'}</p>
                <p><strong>Air Conditioning:</strong> {selectedCar.air_conditioning ? 'Yes' : 'No'}</p>
                <p><strong>Fuel Consumption:</strong> {selectedCar.fuel_consumption}L/100km</p>
                <p><strong>Fuel Type:</strong> {selectedCar.fuel_type}</p>
                <p><strong>City:</strong> {selectedCar.city}</p>
                <div className="separator" style={{ backgroundColor: 'rgba(15, 14, 67, 0.2)' }}></div>
                <div className="price-container">
                  <div className="price-section">
                    <p className="price">{selectedCar.price_per_day} €</p>
                    <p className="price-per-day">/jour</p>
                  </div>
                  <Link to={`/reservation/${selectedCar.id}`} className="reserve-button">Réserver</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Car;
