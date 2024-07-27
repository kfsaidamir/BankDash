import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Panel from './pages/Panel';
import Credit from './pages/Credit';
import Investments from './pages/Investments';
import Accounts from './pages/Accounts';
import Loans from './pages/Loans';
import { UserProvider } from './context/UserContext';

const App = () => {
  return (
    <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Account />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/panel" element={<Panel />} />
          <Route path="/cards" element={<Credit />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/loans" element={<Loans />} />
        </Routes>
    </UserProvider>
  );
};

export default App;
