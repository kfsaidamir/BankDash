import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Account from './pages/Account';
import Dashboard from './components/Dashboard';
import AuthDetails from './components/auth/SignUp';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Account />} />
        <Route path='/auth' element={<AuthDetails/>} />
        <Route path="/home" element={<HomeWithDashboard />} />
      </Routes>
  );
};

const HomeWithDashboard = () => {
  return (
    <Home>
      <Dashboard />
    </Home>
  );
};

export default App;
