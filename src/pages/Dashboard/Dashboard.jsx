import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  useColorModeValue
} from "@chakra-ui/react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const [rates, setRates] = useState({ all: [], relevant: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const URL = `https://v6.exchangerate-api.com/v6/a16c3c95386da56d9205a294/latest/USD`;

  const fetchRates = async (retryCount = 3) => {
    try {
      const response = await axios.get(URL);
      const allRates = response.data.conversion_rates;
      const relevantRates = {
        USD: allRates.USD,
        EUR: allRates.EUR,
        RUB: allRates.RUB,
        UZS: allRates.UZS,
      };
      const allRatesArray = Object.entries(allRates).map(
        ([currency, rate]) => ({ currency, rate })
      );
      const relevantRatesArray = Object.entries(relevantRates).map(
        ([currency, rate]) => ({ currency, rate })
      );
      setRates({ all: allRatesArray, relevant: relevantRatesArray });
    } catch (err) {
      if (err.response && err.response.status === 429 && retryCount > 0) {
        setTimeout(() => fetchRates(retryCount - 1), 1000);
      } else {
        setError(err.message);
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      padding="20px"
      position="relative"
      top="10%"
      w={{ md: "88%", base: "100%" }}
      h="100%"
      overflowY="auto"
      margin="0 auto"
      bg={bg}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Spinner size="xl" />
        </Box>
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Box>
          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            alignItems="top"
            justifyContent="center"
            padding="10px"
          >
            <Box width={{ md: "60%", base: "100%" }} height={400} mb={4}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={rates.relevant}
                  margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                >
                  <CartesianGrid stroke={borderColor} />
                  <XAxis dataKey="currency" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#8884d8"
                    dot={{ stroke: "#8884d8", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Table variant="striped" colorScheme="teal" width="100%">
            <Thead>
              <Tr>
                <Th>Currency</Th>
                <Th>Rate</Th>
              </Tr>
            </Thead>
            <Tbody>
              {(showAll ? rates.all : rates.relevant).map(
                ({ currency, rate }) => (
                  <Tr key={currency}>
                    <Td>{currency}</Td>
                    <Td>{rate}</Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>

          <Button
            onClick={() => setShowAll(!showAll)}
            mt={4}
            colorScheme="teal"
          >
            {showAll ? 'Hide' : 'See All'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
