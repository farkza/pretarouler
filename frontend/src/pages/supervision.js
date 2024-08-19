import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/supervision.css';
import { useNavigate } from "react-router-dom";

const Supervision = () => {
    const [reservations, setReservations] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [activeReservations, setActiveReservations] = useState(0);
    const [mostRentedCar, setMostRentedCar] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async (token) => {
            try {
                const response = await fetch(`http://localhost:8000/api/get_user_by_token/${token}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error fetching user data');
                }
                const data = await response.json();
                
                if (data.email === "admin@pretarouler.com") {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('access_token'); 
        if (token) {
            fetchUserData(token);
        } else {
            navigate("/login"); 
        }
    }, [navigate]);

    useEffect(() => {
        if (isAuthorized) {
            const fetchData = async () => {
                try {
                    const response = await axios.get("http://localhost:8000/api/reservations/");
                    const reservationsData = response.data;
                    setReservations(reservationsData);

                    const revenue = reservationsData.reduce((acc, reservation) => acc + reservation.price, 0);
                    setTotalRevenue(revenue);

                    const today = new Date();
                    const activeRes = reservationsData.filter(reservation => new Date(reservation.end_date) > today).length;
                    setActiveReservations(activeRes);

                    const carCount = {};
                    reservationsData.forEach(reservation => {
                        carCount[reservation.car] = (carCount[reservation.car] || 0) + 1;
                    });

                    const mostRentedCarId = Object.keys(carCount).reduce((a, b) => carCount[a] > carCount[b] ? a : b);
                    
                    if (mostRentedCarId) {
                        const carResponse = await axios.get(`http://localhost:8000/api/cars/${mostRentedCarId}`);
                        setMostRentedCar(carResponse.data);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données", error);
                }
            };

            fetchData();
        }
    }, [isAuthorized]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/reservations/${id}`);
            setReservations(reservations.filter(reservation => reservation.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de la réservation", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate("/login");
    };

    const getStatus = (endDate) => {
        const today = new Date();
        return new Date(endDate) > today ? 'En cours' : 'Terminé';
    };

    if (loading) {
        return <div>Chargement...</div>; 
    }

    if (!isAuthorized) {
        return (
            <div className="restricted-access-container">
                <div className="restricted-access">Accès restreint aux administrateurs</div>
                <button onClick={handleLogout}>Se connecter</button>
            </div>
        );
    }

    return (
        <div className="supervision-container">
            <h1>Supervision</h1>
            <div className="stats">
                <p><strong>Chiffre d'affaire total :</strong> {totalRevenue} €</p>
                <p><strong>Nombre de réservations actives :</strong> {activeReservations}</p>
                {mostRentedCar && (
                    <p><strong>Voiture la plus louée :</strong> {mostRentedCar.make} {mostRentedCar.model}</p>
                )}
            </div>

            <h2>Liste des Réservations</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date de début</th>
                        <th>Date de fin</th>
                        <th>Prix</th>
                        <th>Ville</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map(reservation => (
                        <tr key={reservation.id}>
                            <td>{new Date(reservation.start_date).toLocaleDateString()}</td>
                            <td>{new Date(reservation.end_date).toLocaleDateString()}</td>
                            <td>{reservation.price} €</td>
                            <td>{reservation.city}</td>
                            <td>
                                <span className={getStatus(reservation.end_date) === 'En cours' ? 'status-in-progress' : 'status-completed'}>
                                    {getStatus(reservation.end_date)}
                                </span>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(reservation.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Supervision;
