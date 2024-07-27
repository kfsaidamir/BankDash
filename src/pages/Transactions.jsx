import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  useColorModeValue,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tr,
  Tbody,
  Th,
  Td,
} from '@chakra-ui/react';
import Main from '../Main/Main';
import { auth } from '../Firebase';
import Header from '../components/Header/Header';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const bg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const boughtBg = useColorModeValue('#e0ffe0', '#444');
  const availableBg = useColorModeValue('#f9f9f9', '#555');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3000/transactions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setError('Ошибка при загрузке транзакций. Пожалуйста, попробуйте еще раз.');
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Main>
      <Header />
      <Box
        maxW="100%"
        p={4}
        bg={bg}
        border="1px"
        borderColor={borderColor}
      >
        <Flex direction="column" gap={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Transactions
          </Text>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          <Box overflowX="auto">
            <Table variant="striped" colorScheme="teal" width="100%">
              <Thead bg={headerBg}>
                <Tr>
                  <Th color={textColor} borderColor={borderColor}>Name</Th>
                  <Th color={textColor} borderColor={borderColor}>Amount</Th>
                  <Th color={textColor} borderColor={borderColor}>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.length === 0 ? (
                  <Tr>
                    <Td colSpan="3" textAlign="center">
                      У вас нет доступных транзакций.
                    </Td>
                  </Tr>
                ) : (
                  transactions.map(transaction => (
                    <Tr
                      key={transaction.id}
                      bg={transaction.status === 'buyed' ? boughtBg : availableBg
                    }
                    >
                      <Td borderColor={borderColor}>{transaction.name}</Td>
                      <Td borderColor={borderColor}>${transaction.amount}</Td>
                      <Td borderColor={borderColor}>
                        {transaction.status === 'buyed' ? 'Bought' : 'Available'}
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Box>
    </Main>
  );
};

export default Transactions;
