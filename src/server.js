const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Пути к файлам данных
const transactionsPath = path.join(__dirname, 'db', 'transactions.json');
const cardsPath = path.join(__dirname, 'db', 'cards.json');

// Загрузка данных из файлов
let transactions = JSON.parse(fs.readFileSync(transactionsPath, 'utf8'));
let cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));

// Получить транзакции пользователя
app.get('/api/transactions', (req, res) => {
  const userId = parseInt(req.query.userId);

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const userTransactions = transactions.filter(transaction =>
    transaction.buyerId === userId || transaction.buyerId === null
  );
  res.json(userTransactions);
});

// Создать новую транзакцию
app.post('/api/transactions', (req, res) => {
  const { name, amount, type, email, userId } = req.body;
  const newTransaction = {
    id: transactions.length + 1,
    name,
    amount,
    type,
    email,
    userId,
    buyerId: null // Транзакция еще не куплена
  };
  transactions.push(newTransaction);
  fs.writeFileSync(transactionsPath, JSON.stringify(transactions, null, 2));
  res.json(newTransaction);
});

// Купить транзакцию
app.post('/api/transactions/:id/buy', (req, res) => {
  const { id } = req.params;
  const { amount, cardId, userId } = req.body;

  const transaction = transactions.find(t => t.id === parseInt(id));
  const card = cards.find(c => c.id === parseInt(cardId));

  if (!transaction || !card) {
    return res.status(404).send('Transaction or card not found');
  }

  if (card.balance < amount) {
    return res.status(400).send('Insufficient balance on the card');
  }

  if (transaction.buyerId && transaction.buyerId !== userId) {
    return res.status(403).send('Transaction already bought by another user');
  }

  transaction.buyerId = userId;
  card.balance -= parseFloat(amount);

  fs.writeFileSync(transactionsPath, JSON.stringify(transactions, null, 2));
  fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2));

  res.json(transaction);
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
