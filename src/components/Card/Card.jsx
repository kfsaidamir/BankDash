import React from 'react';
import { RiVisaLine, RiMastercardLine, RiDeleteBinLine } from 'react-icons/ri';
import './Card.css';

const Card = ({ card, onDelete }) => {
  const { name, cardNumber, expiryDate, cvv, color, type, balance } = card;

  return (
    <div className="card" style={{ backgroundColor: color }}>
      <div className="card-chip" />
      <div className="card-number">{cardNumber}</div>
      <div className="card-expiry">{expiryDate}</div>
      <div className="card-cvv">CVV: {cvv}</div>
      <div className="card-balance">Balance: ${balance.toFixed(2)}</div>
      <div className="card-brand">
        {type === 'visa' ? (
          <RiVisaLine />
        ) : (
          <RiMastercardLine />
        )}
        <span>{type === 'visa' ? 'VISA' : 'MASTERCARD'}</span>
      </div>
      <button className="card-delete" onClick={() => onDelete(card.id)}>
        <RiDeleteBinLine />
      </button>
    </div>
  );
};

export default Card;
