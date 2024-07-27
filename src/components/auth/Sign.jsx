import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase";
import { Input, Button, Text, FormControl, FormLabel, VStack, Center, SlideFade } from "@chakra-ui/react";

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(true);

  const handleAction = () => {
    if (isNewAccount) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          setEmail("");
          setPassword("");
          setError("");
        })
        .catch((error) => {
          console.log(error);
          setError("Извините, не удалось создать ваш аккаунт");
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          setEmail("");
          setPassword("");
          setError("");
        })
        .catch((error) => {
          console.log(error);
          setError("Извините, не удалось найти ваш аккаунт");
        });
    }
  };

  return (
    <div className="background"> {/* Добавляем задний фон */}
      <Center mt={8}>
        <SlideFade in={true} offsetY="20px">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Электронная почта</FormLabel>
              <Input  
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Введите вашу электронную почту"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Пароль</FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Введите ваш пароль"
              />
            </FormControl>
            <MotionBox whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={handleAction}
                colorScheme="blue"
                border="2px solid transparent"
                transition="border-color 0.3s"
                _hover={{ borderColor: "blue.500" }}
                _focus={{ borderColor: "blue.500" }}
                _active={{ borderColor: "blue.500" }}
              >
                {isNewAccount ? "Создать аккаунт" : "Войти"}
              </Button>
            </MotionBox>
            {error && <Text color="red">{error}</Text>}
            <Text cursor="pointer" onClick={() => setIsNewAccount(!isNewAccount)}>
              {isNewAccount ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Создать"}
            </Text>
          </VStack>
        </SlideFade>
      </Center>
    </div>
  );
};

export default Account;
