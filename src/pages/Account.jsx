import React, { useState } from "react";
import { Box, Button, Text, Input } from "@chakra-ui/react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase.js";
import { useNavigate } from "react-router-dom";

const defaultAvatarUrl = "/images/defaultAvatar.png";

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Создание документа пользователя в Firestore с UID в качестве идентификатора
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        email: email,
        avatar: defaultAvatarUrl, // Ссылка на аватарку по умолчанию
      });
      setEmail("");
      setPassword("");
      setError("");
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Ошибка создания аккаунта:", error);
      setError(`Извините, не удалось создать ваш аккаунт: ${error.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setError("");
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Ошибка входа в аккаунт:", error);
      setError(`Извините, не удалось войти в ваш аккаунт: ${error.message}`);
    }
  };

  return (
    <Box
      w="100%"
      h="100vh"
      backgroundImage="radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%)" // Фоновый градиент
      p={{ base: 4, md: 0 }} // Изменение отступов для адаптации
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
        <Text fontSize="xl" color="white" mb={4}>
          Регистрация
        </Text>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          bg="gray.800"
          color="white"
          rounded="md"
          mb={4}
          _placeholder={{ color: "white" }}
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          bg="gray.800"
          color="white"
          rounded="md"
          mb={4}
          _placeholder={{ color: "white" }}
        />
        <Button
          onClick={handleCreateAccount}
          colorScheme="blue"
          variant="solid"
          width="full"
          mb={2}
        >
          Создать аккаунт
        </Button>
        <Button
          onClick={handleSignIn}
          colorScheme="green"
          variant="solid"
          width="full"
          mb={4}
        >
          Войти
        </Button>
        {error && (
          <Text color="red" mt={4}>
            {error}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default Account;
  