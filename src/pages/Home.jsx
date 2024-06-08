import React from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { Box } from "@chakra-ui/react";
import Loader from "../Loader/Loader";

const Home = ({ children }) => {
  return (
    <>
      <Box>
        <Header />
        <Sidebar />
        <Box mt={"10vh"} ml={"12%"}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Home;
