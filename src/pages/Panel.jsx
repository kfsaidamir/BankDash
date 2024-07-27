import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  VStack,
  Heading,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const Panel = ({ transactions = [], setTransactions }) => {
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    amount: '',
    type: '',
  });

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cardsResponse = await fetch('http://localhost:3000/cards');
        const cardsData = await cardsResponse.json();
        setCards(cardsData);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  // Функция для добавления транзакции
  const handleAddTransaction = async () => {
    if (!newTransaction.name || !newTransaction.amount || !newTransaction.type) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTransaction,
          amount: parseFloat(newTransaction.amount),
          status: 'pending', // Установка статуса как "pending" при добавлении
          date: new Date().toISOString(), // Добавление текущей даты
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const transaction = await response.json();
      setTransactions([...transactions, transaction]);
      setNewTransaction({ name: '', amount: '', type: '' });
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Transaction added succsefully');
    }
  };

  // Функция для покупки транзакции
  const handleBuyTransaction = async () => {
    if (!selectedCardId || !buyAmount || !selectedTransactionId) {
      setErrorMessage('Please select a card, enter an amount, and select a transaction.');
      return;
    }

    try {
      const transactionResponse = await fetch(`http://localhost:3000/transactions/${selectedTransactionId}`);
      const transactionData = await transactionResponse.json();

      if (transactionData.status === 'buyed') {
        setErrorMessage('Transaction already bought.');
        return;
      }

      await fetch(`http://localhost:3000/transactions/${selectedTransactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: -buyAmount, status: 'buyed' }), // Устанавливаем статус как "buyed"
      });

      const cardResponse = await fetch(`http://localhost:3000/cards/${selectedCardId}`);
      const cardData = await cardResponse.json();
      await fetch(`http://localhost:3000/cards/${selectedCardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balance: cardData.balance + parseFloat(buyAmount) }),
      });

      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === selectedTransactionId ? { ...transaction, amount: -buyAmount, status: 'buyed' } : transaction
        )
      );

      const updatedCardsResponse = await fetch('http://localhost:3000/cards');
      const updatedCardsData = await updatedCardsResponse.json();
      setCards(updatedCardsData);
      setBuyAmount('');
      setSelectedCardId('');
      setSelectedTransactionId('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to buy transaction');
    }
  };

  return (
    <VStack spacing={6} align="start" padding="10px 40px">
      <Box w={{md:"25%", base:"90%" }}>
        <Heading as="h2" size="lg" mb={4}>
          Add Transaction
        </Heading>
        <FormControl id="transaction-name">
          <Input
            placeholder="Transaction Name"
            value={newTransaction.name}
            onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
          />
        </FormControl>
        <FormControl id="transaction-amount" mt={4}>
          <NumberInput value={newTransaction.amount} onChange={(value) => setNewTransaction({ ...newTransaction, amount: value })}>
            <NumberInputField placeholder="Amount" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl id="transaction-type" mt={4}>
          <Select placeholder="Select type" value={newTransaction.type} onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}>
            <option value="Transfer">Transfer</option>
            <option value="Withdraw">Withdraw</option>
          </Select>
        </FormControl>
        <Button mt={4} colorScheme="teal" onClick={handleAddTransaction}>
          Add Transaction
        </Button>
        {errorMessage && <Text color="green.500" mt={2}>{errorMessage}</Text>}
      </Box>

      {/* <Box w={{md:"25%", base:"90%" }}>
        <Heading as="h2" size="lg" mb={4}>
          Buy Transaction
        </Heading>
        <FormControl id="card-select">
          <Select placeholder="Select card" value={selectedCardId} onChange={(e) => setSelectedCardId(e.target.value)}>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name} (Balance: ${card.balance})
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="transaction-select" mt={4}>
          <Select placeholder="Select transaction" value={selectedTransactionId} onChange={(e) => setSelectedTransactionId(e.target.value)}>
            {transactions
              .filter((transaction) => transaction.status !== 'buyed')
              .map((transaction) => (
                <option key={transaction.id} value={transaction.id}>
                  {transaction.name} (${transaction.amount})
                </option>
              ))}
          </Select>
        </FormControl>
        <FormControl id="buy-amount" mt={4}>
          <NumberInput value={buyAmount} onChange={(value) => setBuyAmount(value)}>
            <NumberInputField placeholder="Amount" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button mt={4} colorScheme="teal" onClick={handleBuyTransaction}>
          Buy Transaction
        </Button>
        {errorMessage && <Text color="green.500" mt={2}>{errorMessage}</Text>}
      </Box> */}
    </VStack>
  );
};

export default Panel;
