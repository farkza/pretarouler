// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Catalog from './pages/catalog';
import Reservation from './pages/reservation';
import Login from './pages/login';
import Supervision from './pages/supervision';
import CreateAccount from './pages/CreateAccount';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/reservation/:carId" element={<Reservation />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/supervision" element={<Supervision />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
