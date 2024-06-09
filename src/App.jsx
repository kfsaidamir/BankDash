import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Account from './pages/Account';
import Dashboard from './components/Dashboard/Dashboard';
import Transactions from './pages/Transactions';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Account />} />
        <Route path='/home' element={<Home/>} />
        <Route path='/dashboard' element={<Home/>} />
        <Route path='/transactions' element={<Transactions/>} />
      </Routes>
  );
};

  
export default App;
