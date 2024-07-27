import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Main from '../Main/Main';

const Investments = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      axios.get(`/api/transactions?userId=${user.id}`)
        .then(response => {
          setTransactions(response.data);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
        });
    } else {
      console.error('User is not defined or user.id is missing');
    }
  }, [user]);

  return (
    <Main>
      <h1>Your Investments</h1>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map(transaction => (
            <li key={transaction.id}>
              {transaction.name} - {transaction.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </Main>
  );
};

export default Investments;
