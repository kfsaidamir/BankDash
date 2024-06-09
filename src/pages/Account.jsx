import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Input,
  Center,
} from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase.js";

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAction = async () => {
    if (email === "" || password === "") {
      setError("Email и пароль не должны быть пустыми");
      return;
    }
  
    try {
      if (isNewAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Аккаунт успешно создан");
  
        navigate("/home", { replace: true });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Успешный вход в аккаунт");
  
        navigate("/home", { replace: true });
      }
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      console.error("Ошибка при выполнении действия с аккаунтом:", error);
      setError(`Извините, произошла ошибка: ${error.message}`);
    }
  };

  return (
    <Box
      w="100%"
      h="100vh"
      backgroundImage="radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%)"
      p={{ base: 4, md: 0 }}
      overflow="auto"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        border="1px solid white"
        padding={{ base: 4, md: 8 }} 
        borderRadius="10px"
        w={{ md: "30%", base: "90%" }}
      >
        <Center w="100%" padding="15px">
          <Box maxW="400px" w="100%" borderRadius="md" p={4}> 
            <Text fontSize="xl" color="white">
              Email
            </Text>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              bg="gray.800"
              color="white"
              rounded="md"
              marginBottom={{md:"30px", base:"20px" }}
              mt={4}
              _placeholder={{ color: "white" }}
            />
            <Text fontSize="xl" color="white">
              Пароль
            </Text>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              bg="gray.800"
              marginBottom={{md:"20px", base:"15px" }}
              color="white"
              rounded="md"
              mt={4}
              _placeholder={{ color: "white" }}
            />
            <Button
              onClick={handleAction}
              colorScheme="blue"
              variant="solid"
              width="full"
              mt={4}
            >
              {isNewAccount ? "Создать аккаунт" : "Войти"}
            </Button>
            {error && (
              <Text color="red" mt={4}>
                {error}
              </Text>
            )}
            <Text
              color="white"
              textAlign="center"
              mt={4}
              cursor="pointer"
              _hover={{ color: "blue.400" }}
              onClick={() => setIsNewAccount(!isNewAccount)}
            >
              {isNewAccount
                ? "Уже есть аккаунт? Войти"
                : "Нет аккаунта? Создать"}
            </Text>
          </Box>
        </Center>
      </Box>
    </Box>
  );
};

export default Account;
