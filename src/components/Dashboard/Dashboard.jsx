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
} from "@chakra-ui/react";
import axios from "axios";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart, Pie } from "recharts";

const Dashboard = () => {
  const data = [
    { name: "Page A", uv: 590, pv: 800, amt: 1400 },
    { name: "Page B", uv: 868, pv: 967, amt: 1506 },
    { name: "Page C", uv: 1397, pv: 1098, amt: 989 },
    { name: "Page D", uv: 1480, pv: 1200, amt: 1228 },
    { name: "Page E", uv: 1520, pv: 1108, amt: 1100 },
    { name: "Page F", uv: 1400, pv: 680, amt: 1700 },
  ];

  const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const data02 = [
    { name: "A1", value: 100 },
    { name: "A2", value: 300 },
    { name: "B1", value: 100 },
    { name: "B2", value: 80 },
    { name: "B3", value: 40 },
    { name: "B4", value: 30 },
    { name: "B5", value: 50 },
    { name: "C1", value: 100 },
    { name: "C2", value: 200 },
    { name: "D1", value: 150 },
    { name: "D2", value: 50 },
  ];

  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const URL = `https://v6.exchangerate-api.com/v6/f8ea96a54e26d416e80885db/latest/USD`;

  const fetchRates = async () => {
    try {
      const response = await axios.get(URL);
      setRates(response.data.conversion_rates);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <Box
      padding={"20px"}
      position={"relative"}
      top={"10%"}
      w={{md:"88%", base:"100%" }}
      h={"100%"}
      overflowY="auto"
      margin="0 auto"
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
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Box>
          <Box
            display={{ md: "flex", base: "wrap" }}
            alignItems={"top"}
            justifyContent={"center"}
            padding={"10px"}
          >
            <Box width={{ md: "50%", base: "100%" }}>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="name" scale="band" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="amt"
                    fill="#8884d8"
                    stroke="#8884d8"
                  />
                  <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                  <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>

            <PieChart width={400} height={400}>
              <Pie
                data={data01}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
              />
              <Pie
                data={data02}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                fill="#82ca9d"
                label
              />
            </PieChart>
          </Box>

          <Table variant="striped" colorScheme="teal" w={"100%"}>
            <Thead>
              <Tr>
                <Th>Currency</Th>
                <Th>Rate</Th>
              </Tr>
            </Thead>
            <Tbody>
              {showAll
                ? Object.entries(rates).map(([currency, rate]) => (
                    <Tr key={currency}>
                      <Td>{currency}</Td>
                      <Td>{rate}</Td>
                    </Tr>
                  ))
                : Object.entries(rates)
                    .slice(0, 7)
                    .map(([currency, rate]) => (
                      <Tr key={currency}>
                        <Td>{currency}</Td>
                        <Td>{rate}</Td>
                      </Tr>
                    ))}
            </Tbody>
          </Table>

          {!showAll ? (
            <Button onClick={() => setShowAll(true)} mt={4}>
              See All
            </Button>
          ) : (
            <Button onClick={() => setShowAll(false)} mt={4}>
              Hide
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
