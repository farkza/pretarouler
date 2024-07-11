import React, { useState, useEffect } from 'react';
import { DatePicker, notification } from 'antd';
import moment from 'moment';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../css/reservation.css';

const { RangePicker } = DatePicker;

const ReservationPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userId, setUserId] = useState('');

  // Récupérer accessToken depuis le localStorage
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchUserData = async () => {
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

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/cars/${carId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch car data');
        }
        const carData = await response.json();
        setSelectedCar(carData);
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    };

    if (carId) {
      fetchCarData();
    }
  }, [carId]);

  const handleDateChange = dates => {
    setSelectedDates(dates);
    if (dates && dates.length === 2) {
      const daysDifference = dates[1].diff(dates[0], 'days');
      const price = daysDifference * selectedCar.price_per_day;
      setTotalPrice(price);
    } else {
      setTotalPrice(0); // Reset total price when dates change
    }
  };

  const handleValidateReservation = async () => {
    try {
      const reservationData = {
        start_date: selectedDates[0].toISOString(),
        end_date: selectedDates[1].toISOString(),
        user: userId,
        car: selectedCar.id,
        price: totalPrice,
        city: selectedCar.city
      };

      const response = await fetch('http://localhost:8000/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(reservationData)
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      notification.success({
        message: 'Réservation effectuée',
        description: 'Votre réservation a été enregistrée avec succès.'
      });

      navigate('/home');
    } catch (error) {
      console.error('Error creating reservation:', error);
      notification.error({
        message: 'Erreur',
        description: 'Une erreur est survenue lors de la création de la réservation.'
      });
    }
  };

  const disabledDate = current => {
    return current && current < moment().startOf('day');
  };

  const disabledDateRange = (start, end) => {
    // Implementez la logique de dates réservées ici si nécessaire
    return false;
  };

  if (!selectedCar) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="reservation-page">
      <div className="reservation-left">
        <h2>Réserver {selectedCar.brand} {selectedCar.model}</h2>
        <RangePicker
          disabledDate={disabledDate}
          disabledDateRange={disabledDateRange}
          onChange={handleDateChange}
        />
      </div>
      <div className="reservation-right">
        <div className="reservation-details">
          <h3>ID de la voiture : {selectedCar.id}</h3>
          <p>Prix par jour : {selectedCar.price_per_day}€</p>
          <h3>ID de l'utilisateur : {userId}</h3>
          <h3>Prix total : {totalPrice}€</h3>
          <button onClick={handleValidateReservation}>Payer</button>
        </div>
        <Link to="/home" className="return-home-link">Retourner à l'accueil</Link>
      </div>
    </div>
  );
};

export default ReservationPage;
