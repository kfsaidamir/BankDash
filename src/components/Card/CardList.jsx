import React from 'react';
import Card from './Card';
import DeleteCardModal from './DeleteCardModal';

const CardList = ({ cards, deleteCard, replenishCard }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);

  const openModal = (card) => {
    setSelectedCard(card);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <DeleteCardModal
        isOpen={isOpen}
        onClose={closeModal}
        cards={cards} 
        onDeleteCard={deleteCard}
      />
      {cards.length > 0 ? (   
        cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onDelete={() => openModal(card)}
            onReplenish={replenishCard}
          />
        ))
      ) : (
        <p>No cards available</p>
      )}
    </>
  );
};

export default CardList;
