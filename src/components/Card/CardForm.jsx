import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendarAlt,
  faLock,
} from '@fortawesome/free-solid-svg-icons';

const CardForm = ({ addCard, cardCount }) => {
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [type, setType] = useState('visa');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cardData = {
      name,
      cardNumber,
      expiryDate: expiry,
      cvv,
      type,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
    addCard(cardData);
    setName('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setType('visa');
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1-');
    if (value.endsWith('-')) {
      value = value.slice(0, -1);
    }
    setCardNumber(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value;
    if (value.length === 2 && expiry.length === 1) {
      value += '/';
    }
    setExpiry(value);
  };

  return (
    <Box width="100%" maxWidth="400px">
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4}>
          <FormLabel fontSize="15px">
            <FontAwesomeIcon icon={faUser} /> Name:
          </FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="card-type" mb={4}>
          <FormLabel fontSize="15px">Card Type:</FormLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Select card type"
            required
          >
            <option value="visa">Visa</option>
            <option value="mastercard">MasterCard</option>
          </Select>
        </FormControl>
        <FormControl id="card-number" mb={4}>
          <FormLabel fontSize="15px">Card Number:</FormLabel>
          <Input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength="19"
            placeholder="0000-0000-0000-0000"
            pattern="(?:\d{4}-){3}\d{4}"
            required
          />
        </FormControl>
        <FormControl id="expiry" mb={4}>
          <FormLabel fontSize="15px">
            <FontAwesomeIcon icon={faCalendarAlt} /> Expiry:
          </FormLabel>
          <Input
            type="text"
            value={expiry}
            onChange={handleExpiryChange}
            maxLength="5"
            placeholder="MM/YY"
            required
          />
        </FormControl>
        <FormControl id="cvv" mb={4}>
          <FormLabel fontSize="15px">
            <FontAwesomeIcon icon={faLock} /> CVV:
          </FormLabel>
          <Input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            maxLength="3"
            pattern="\d*"
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">
          Add Card
        </Button>
      </form>
    </Box>
  );
};

export default CardForm;
