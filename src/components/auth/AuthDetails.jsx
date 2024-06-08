import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../Firebase";
import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
        setTimeout(() => {
          navigate("/registration");
        }, 5000);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Успешный выход"))
      .catch((error) => console.error("Ошибка выхода:", error));
  };

  const handleSignIn = () => {
    navigate("/sign");
  };

  return (
    <Box>
      {authUser ? (
        <Box>
          <Text>{`Вы вошли как: ${authUser.email}`}</Text>
          <Button onClick={handleSignOut}>Выйти</Button>
        </Box>
      ) : (
        <Box>
          <Text>Вы успешно вышли</Text>
          <Button onClick={handleSignIn}>Войти</Button>
        </Box>
      )}
    </Box>
  );
};

export default AuthDetails;
