// src/pages/Credit.jsx
import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Button, Select, FormControl, FormLabel, Alert, AlertIcon, useColorModeValue, Input } from '@chakra-ui/react';
import Main from '../Main/Main';
import CardList from './../components/Card/CardList';
import CardForm from './../components/Card/CardForm';
import { auth } from '../Firebase';
import Header from '../components/Header/Header';

const Credit = () => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [transactions, setTransactions] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState(null);
  const [showReplenishForm, setShowReplenishForm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [replenishAmount, setReplenishAmount] = useState('');
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [selectedBuyCardId, setSelectedBuyCardId] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const bg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const currentUser = auth.currentUser;
        setUserId(currentUser ? currentUser.uid : null);

        if (currentUser) {
          const response = await fetch(`http://localhost:3000/cards?userId=${currentUser.uid}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setCards(data.map(card => ({ ...card, balance: card.balance || 0 })));
          setFilteredCards(data.map(card => ({ ...card, balance: card.balance || 0 })));
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    const fetchTransactions = async () => { 
      try {
        const response = await fetch('http://localhost:3000/transactions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchCards();
    fetchTransactions(); 
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = cards.filter(card =>
        card.cardNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(cards);
    }
  }, [searchQuery, cards]);

  const addCard = async (cardData) => {
    if (userId) {
      try {
        const response = await fetch('http://localhost:3000/cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...cardData, userId, balance: 0 }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const newCard = await response.json();
        console.log('New card added:', newCard);
        setCards([...cards, newCard]);
        setFilteredCards([...cards, newCard]);
        setSuccessMessage('Карта успешно добавлена!');
      } catch (error) {
        setError('Ошибка при добавлении карты. Пожалуйста, попробуйте еще раз.');
        console.error('Error adding card:', error);
      }
    }
  };

  const deleteCard = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:3000/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Card deleted:', cardId);
      setCards(cards.filter(card => card.id !== cardId));
      setFilteredCards(filteredCards.filter(card => card.id !== cardId));
      setSuccessMessage('Карта успешно удалена!');
    } catch (error) {
      setError('Ошибка при удалении карты. Пожалуйста, попробуйте еще раз.');
      console.error('Error deleting card:', error);
    }
  };

  const replenishCard = async (cardId, amount) => {
    try {
      const cardToReplenish = cards.find(card => card.id === cardId);
      const updatedCard = { ...cardToReplenish, balance: (cardToReplenish.balance || 0) + parseFloat(amount) };

      const response = await fetch(`http://localhost:3000/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCard),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Card replenished:', data);
      setCards(cards.map(card => (card.id === cardId ? data : card)));
      setFilteredCards(filteredCards.map(card => (card.id === cardId ? data : card)));
      setSuccessMessage('Баланс успешно пополнен!');
    } catch (error) {
      setError('Ошибка при пополнении карты. Пожалуйста, попробуйте еще раз.');
      console.error('Error replenishing card:', error);
    }
  };

  const handleReplenishSubmit = (e) => {
    e.preventDefault();
    if (selectedCardId && replenishAmount) {
      replenishCard(selectedCardId, replenishAmount);
      setShowReplenishForm(false);
      setSelectedCardId('');
      setReplenishAmount('');
    }
  };

  const buyCard = async (cardId, transactionId) => {
    try {
      const cardToBuy = cards.find(card => card.id === cardId);
      const transactionToBuy = transactions.find(transaction => transaction.id === transactionId);

      if (!transactionToBuy || cardToBuy.balance < transactionToBuy.amount) {
        setError('Недостаточно средств на карте для покупки.');
        return;
      }

      const updatedCard = { ...cardToBuy, balance: (cardToBuy.balance || 0) - transactionToBuy.amount };

      const response = await fetch(`http://localhost:3000/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCard),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Card bought with:', data);
      setCards(cards.map(card => (card.id === cardId ? data : card)));
      setFilteredCards(filteredCards.map(card => (card.id === cardId ? data : card)));

      await fetch(`http://localhost:3000/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'buyed',
        }),
      });

      setTransactions(transactions.map(transaction => 
        transaction.id === transactionId ? { ...transaction, status: 'buyed' } : transaction
      ));

      setSuccessMessage('Покупка успешно завершена!');
    } catch (error) {
      setError('Ошибка при покупке. Пожалуйста, попробуйте еще раз.');
      console.error('Error buying with card:', error);
    }
  };

  const handleBuySubmit = (e) => {
    e.preventDefault();
    if (selectedBuyCardId && selectedTransactionId) {
      buyCard(selectedBuyCardId, selectedTransactionId);
      setShowBuyForm(false);
      setSelectedBuyCardId('');
      setSelectedTransactionId('');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Main>
      <Header onSearch={handleSearch} />
      <Box maxW="100%" p={4} borderRadius="xl">
        <Flex direction={{ base: 'column', md: 'row' }} spacing={4} gap={4}>
          <Box flex="1" maxW={{ base: '100%', md: '400px' }} p={4} borderRadius="md" shadow="md" bg={bg}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Add New Credit Card
            </Text>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert status="success" mb={4}>
                <AlertIcon />
                {successMessage}
              </Alert>
            )}
            <CardForm addCard={addCard} cardCount={cards.length} />
          </Box>
          <Box flex="2" p={4} borderRadius="md" shadow="md" bg={bg}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Manage Credit Cards
            </Text>
            <Flex direction="column" mb={4} gap={"10px"} >
              <Button onClick={() => setShowReplenishForm(!showReplenishForm)} colorScheme={showReplenishForm ? 'red' : 'blue'}>
                {showReplenishForm ? 'Cancel Replenish' : 'Replenish'}
              </Button>
              {showReplenishForm && (
                <form onSubmit={handleReplenishSubmit}>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="card">Select Card</FormLabel>
                    <Select
                      id="card"
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(e.target.value)}
                    >
                      <option value="">Select a card</option>
                      {filteredCards.map(card => (
                        <option key={card.id} value={card.id}>
                          {card.cardNumber} - Balance: {card.balance}$
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="amount">Amount</FormLabel>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={replenishAmount}
                      onChange={(e) => setReplenishAmount(e.target.value)}
                    />
                  </FormControl>
                  <Button type="submit" colorScheme="blue">
                    Replenish
                  </Button>
                </form>
              )}
              <Button onClick={() => setShowBuyForm(!showBuyForm)} colorScheme={showBuyForm ? 'red' : 'blue'}>
                {showBuyForm ? 'Cancel Purchase' : 'Buy'}
              </Button>
              {showBuyForm && (
                <form onSubmit={handleBuySubmit}>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="buy-card">Select Card</FormLabel>
                    <Select
                      id="buy-card"
                      value={selectedBuyCardId}
                      onChange={(e) => setSelectedBuyCardId(e.target.value)}
                    >
                      <option value="">Select a card</option>
                      {filteredCards.map(card => (
                        <option key={card.id} value={card.id}>
                          {card.cardNumber} - Balance: {card.balance}$
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="transaction">Select Transaction</FormLabel>
                    <Select
                      id="transaction"
                      value={selectedTransactionId}
                      onChange={(e) => setSelectedTransactionId(e.target.value)}
                    >
                      <option value="">Select a transaction</option>
                      {transactions.filter(transaction => transaction.status !== 'buyed').map(transaction => (
                        <option key={transaction.id} value={transaction.id}>
                          {transaction.name} - Amount: {transaction.amount}$
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <Button type="submit" colorScheme="blue">
                    Buy
                  </Button>
                </form>
              )}
            </Flex>
            <CardList
              cards={filteredCards}
              deleteCard={deleteCard}
            />
          </Box>
        </Flex>
      </Box>
    </Main>
  );
};

export default Credit;
