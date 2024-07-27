import React from 'react';
import { Box, Text, List, ListItem, useColorModeValue } from '@chakra-ui/react';

const TransactionList = ({ transactions }) => {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box bg={bg} p={4} borderRadius="md" shadow="md">
      <List spacing={3}>
        {transactions.map(transaction => (
          <ListItem key={transaction.id} p={3} borderRadius="md" bg={useColorModeValue("gray.100", "gray.700")}>
            <Text fontWeight="bold">{transaction.name}</Text>
            <Text>Amount: ${transaction.amount}</Text>
            <Text>Status: {transaction.status}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TransactionList;
