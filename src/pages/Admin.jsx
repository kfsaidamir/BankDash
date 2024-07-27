import React, { useState } from "react";
import { Box, Button, Heading, Input, useColorMode, useColorModeValue, Fade, ScaleFade, SlideFade } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Admin = ({ setIsLoggedIn }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const bd = useColorModeValue("black", "white");

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (login === "admin" && password === "admin") {
      navigate("/panel");
      alert("Вход выполнен успешно!");
      setIsLoggedIn(true);
      setLogin("");
      setPassword("");
    } else {
      alert("Неправильный логин или пароль!");
    }
  };

  return (
    <SlideFade in={true} offsetY="20px">
      <Box
        mt={"12%"}
        textAlign={"center"}
        w={{ md: "30%", base: "70%" }}
        border={`1px solid ${bd}`}
        margin="12% auto"
        padding={{ md: "60px 10px", base: "30px 20px" }}
        borderRadius={"30px"}
        boxShadow={"0 4px 6px rgba(0, 0, 0, 0.1)"}
        bg={useColorModeValue("white", "gray.800")}
        transition={"all 0.3s ease"}
        _hover={{
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
          transform: "scale(1.02)",
        }}
      >
        <Fade in={true}>
          <Heading mb={6} fontSize={{ md: "2xl", base: "xl" }} color={useColorModeValue("black", "white")}>
            Custom Admin Panel
          </Heading>
        </Fade>
        <Box my={"8"}>
          <Input
            placeholder="Login"
            value={login}
            onChange={handleLoginChange}
            w={{ md: "60%", base: "100%" }}
            variant={"outline"}
            borderColor={"gray.300"}
            p={"12px 10px"}
            borderRadius={"10px"}
            _placeholder={{ color: "gray.500" }}
            _focus={{ borderColor: "#34eb52", boxShadow: "0 0 0 1px #34eb52" }}
            transition={".3s ease"}
          />
        </Box>
        <Box my={"8"}>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            w={{ md: "60%", base: "100%" }}
            variant={"outline"}
            borderColor={"gray.300"}
            p={"12px 10px"}
            borderRadius={"10px"}
            _placeholder={{ color: "gray.500" }}
            _focus={{ borderColor: "#34eb52", boxShadow: "0 0 0 1px #34eb52" }}
            transition={".3s ease"}
          />
        </Box>
        <Button
          onClick={handleSubmit}
          w={{ md: "60%", base: "100%" }}
          bgColor={"#34eb52"}
          color={"white"}
          _hover={{
            bgColor: "#22c73d",
            transform: "scale(1.05)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          _active={{
            bgColor: "#1d8a3e",
            transform: "scale(1.03)",
          }}
          transition={"all 0.3s ease"}
          borderRadius={"10px"}
        >
          Enter
        </Button>
      </Box>
    </SlideFade>
  );
};

export default Admin;
