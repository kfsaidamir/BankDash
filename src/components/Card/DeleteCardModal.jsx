import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  IconButton,
  Text
} from '@chakra-ui/react';
import { RiVisaLine, RiMastercardLine, RiDeleteBin5Line } from 'react-icons/ri';

const DeleteCardModal = ({ isOpen, onClose, cards, onDeleteCard }) => {
  const [selectedCardId, setSelectedCardId] = React.useState(null);

  const handleDelete = () => {
    if (selectedCardId) {
      onDeleteCard(selectedCardId);
      setSelectedCardId(null);
      onClose();
    }
  };

  
  if (!Array.isArray(cards)) {
    return <div>Error: Cards data is not available</div>;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Card to Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {cards.length === 0 ? (
            <Text>No cards available</Text>
          ) : (
            <div className="card-container">
              {cards.map((card) => (
                <Box
                  key={card.id}
                  className={`card-modal ${card.id === selectedCardId ? 'card-modal-selected' : ''}`}
                  onClick={() => setSelectedCardId(card.id)}
                >
                  <div className="card-chip-modal" />
                  <Text className="card-modal-number">
                    {card.cardNumber.split('-').join(' ')}
                  </Text>
                  <Text className="card-modal-expiry">Expiry: {card.expiryDate}</Text>
                  <Text className="card-modal-cvv">CVV: {card.cvv}</Text>
                  <Text className="card-modal-brand">
                    {card.type === 'visa' ? (
                      <RiVisaLine />
                    ) : (
                      <RiMastercardLine />
                    )}
                    <span>{card.type === 'visa' ? 'VISA' : 'MASTERCARD'}</span>
                  </Text>
                  <Text className="card-modal-owner">Owner: {card.owner}</Text>
                  {card.id === selectedCardId && (
                    <IconButton
                      className="card-modal-delete"
                      icon={<RiDeleteBin5Line />}
                      aria-label="Delete card"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                    />
                  )}
                  {card.id === selectedCardId && (
                    <div className="card-modal-star">*</div>
                  )}
                </Box>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleDelete}
            mr={3}
            isDisabled={!selectedCardId}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteCardModal;
