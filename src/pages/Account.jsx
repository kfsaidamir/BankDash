import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Input,
  Center,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
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

    if (!email.endsWith("@gmail.com")) {
      setError("Email должен быть с доменом @gmail.com");
      return;
    }

    try {
      if (isNewAccount) {
        const userExists = await checkIfUserExists(email);
        if (userExists) {
          setError("Пользователь с таким email уже существует");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Аккаунт успешно создан", user);

        await saveUserToServer({ email, name: "" });

        navigate("/", { replace: true });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Успешный вход в аккаунт");

        await saveUserToServerIfNotExists({ email, name: "" });

        navigate("/", { replace: true }); 
      }
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      console.error("Ошибка при выполнении действия с аккаунтом:", error);
      setError(`Извините, произошла ошибка: ${error.message}`);
    }
  };

  const checkIfUserExists = async (email) => {
    try {
      const users = await fetch(`http://localhost:3000/users?email=${email}`);
      const data = await users.json();
      return data.length > 0;
    } catch (error) {
      console.error("Ошибка при проверке существования пользователя:", error);
      return false;
    }
  };

  const saveUserToServer = async (userData) => {
    try {
      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log("Данные успешно сохранены на сервере");
    } catch (error) {
      console.error("Ошибка при сохранении данных на сервере:", error);
    }
  };

  const saveUserToServerIfNotExists = async (userData) => {
    try {
      const userExists = await checkIfUserExists(userData.email);
      if (!userExists) {
        await saveUserToServer(userData);
      }
    } catch (error) {
      console.error("Ошибка при сохранении данных на сервере:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleAction();
  };

  return (
    <Box
      w="100%"
      h="100vh"
      backgroundImage="radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%)"
      p={{ base: 4, md: 6 }}
      overflow="auto"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        border="1px solid white"
        padding={{ base: 6, md: 10 }}
        borderRadius="15px"
        w={{ md: "30%", base: "90%" }}
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
      >
        <Center w="100%" padding="15px">
          <Box maxW="100%" w="100%">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel htmlFor="email" color="white">Email</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Введите ваш email"
                    bg="gray.700"
                    color="white"
                    rounded="md"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="password" color="white">Пароль</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
                      bg="gray.700"
                      color="white"
                      rounded="md"
                      _placeholder={{ color: "gray.400" }}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="link"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        color="white"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                >
                  {isNewAccount ? "Создать аккаунт" : "Войти"}
                </Button>

                <Button
                  mt={4}
                  variant="link"
                  color="teal.200"
                  onClick={() => setIsNewAccount(!isNewAccount)}
                >
                  {isNewAccount ? "Уже есть аккаунт? Войти" : "Создать новый аккаунт"}
                </Button>
                {error && <Text color="red.300">{error}</Text>}
              </VStack>
            </form>
          </Box>
        </Center>
      </Box>
    </Box>
  );
};

export default Account;
