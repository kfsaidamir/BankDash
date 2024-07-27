// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret'; // Замените на ваш секретный ключ

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
