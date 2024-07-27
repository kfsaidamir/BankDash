import React, { useEffect } from "react";
import Main from "../Main/Main";
import axios from "axios";
import Dashboard from './Dashboard/Dashboard'
const Home = () => {
  const myFun = async () => {
    try {
      const response = await axios.get("http://localhost:3000/media");
      console.log(response.data); 
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    myFun();
  }, []);

  return (
    <>
      <Main>
        <Dashboard/>
      </Main>
    </>
  );
};

export default Home;
