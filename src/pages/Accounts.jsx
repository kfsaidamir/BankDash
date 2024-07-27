import React, { useEffect, useState } from "react";
import Main from "../Main/Main";
import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  Flex,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { auth } from "../Firebase.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Импорт стилей для календаря
import './Calendar/calendarStyles.css'


const Accounts = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [lastVisited, setLastVisited] = useState(""); // Состояние для даты последнего посещения
  const [calendarDate, setCalendarDate] = useState(new Date()); // Состояние для выбранной даты в календаре
  const toast = useToast();
const bgK = useColorModeValue("white", "gray.800" )
const colorK = useColorModeValue("gray.800", "white" )

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        if (auth.currentUser) {
          const email = auth.currentUser.email;
          setUserEmail(email);

          const token = await auth.currentUser.getIdToken();

          // Получение данных пользователя
          const userResponse = await fetch(
            `http://localhost:3000/users?email=${email}`
          );
          if (!userResponse.ok) throw new Error("Failed to fetch user data");

          const userData = await userResponse.json();
          if (userData.length > 0) {
            const user = userData[0];
            setUserName(user.name || "");
            setUserId(user.id);

            // Установка даты последнего посещения
            setLastVisited(
              user.lastVisited
                ? new Date(user.lastVisited).toLocaleString()
                : "This is your first visit."
            );

            // Обновление даты последнего посещения
            await fetch(`http://localhost:3000/users/${user.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ lastVisited: new Date().toISOString() }),
            });
          } else {
            const createResponse = await fetch("http://localhost:3000/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                name: "",
                token,
                lastVisited: new Date().toISOString(),
              }),
            });
            if (!createResponse.ok)
              throw new Error("Failed to create new user");

            const newUser = await createResponse.json();
            setUserName("");
            setUserId(newUser.id);
            setLastVisited("This is your first visit."); // Установить сообщение о первом посещении
          }
        } else {
          setUserEmail("");
          setUserName("");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      setLoading(false);
    };

    fetchUserData();
  }, [toast]);

  const handleNameChange = (e) => {
    setNewUserName(e.target.value);
  };

  const handleNameSubmit = async () => {
    if (auth.currentUser && userId) {
      try {
        if (newUserName.trim() === "") {
          toast({
            title: "Invalid Name",
            description: "Name cannot be empty",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        await fetch(`http://localhost:3000/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newUserName }),
        });
        setUserName(newUserName);
        setNewUserName("");
        toast({
          title: "Success",
          description: "Name updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error updating user name:", error);
        toast({
          title: "Error",
          description: "Failed to update name",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleCalendarChange = (date) => {
    setCalendarDate(date);
  };

  if (loading) {
    return (
      <Main>
        <Box
          top={{ md: "12%", base: "15%" }}
          padding={"10px 40px"}
          position={"fixed"}
        >
          <Text fontSize="2xl" fontWeight="bold">
            Loading...
          </Text>
        </Box>
      </Main>
    );
  }

  const bg = useColorModeValue("gray.50", "gray.700");
  const inputBg = useColorModeValue("white", "gray.800");

  return (
    <Main>
      <Box
        w="100%"
        p={{ base: "20px", md: "40px" }}
        bg={inputBg}
        minH="100vh"
        boxShadow="md"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 6, md: 12 }}
          align="start"
          justify="center"
        >
          <Box
            p={{ md: "24px 36px", base: "16px 24px" }}
            bg={bg}
            borderRadius="md"
            boxShadow="lg"
            maxW={{ md: "600px", base: "100%" }}
            flex="1"
          >
            <VStack spacing={6} align="start">
              <Text fontSize="3xl" fontWeight="600">
                Account Details
              </Text>
              <Flex
                w="100%"
                flexDirection={{ base: "column", md: "row" }}
                align="center"
                gap={4}
              >
                <Box>
                  <Text fontSize="md" color="gray.600">
                    Last visited: {lastVisited}
                  </Text>
                </Box>
                <Box flex="1" textAlign="center">
                  {userEmail ? (
                    <Text fontSize="lg">Logged in as: {userEmail}</Text>
                  ) : (
                    <Text fontSize="lg">No user logged in</Text>
                  )}
                </Box>
              </Flex>
              {userName ? (
                <Text fontSize="lg">Hello, {userName}!</Text>
              ) : (
                <Text fontSize="lg">
                  Please enter your name in the registration page.
                </Text>
              )}
              <Flex direction={{ base: "column", md: "row" }} gap={4} align="start">
                <Box flex="1" textAlign="center">
                  <Flex
                    alignItems={"center"}
                    w="100%"
                    border={"1px solid #2176c4"}
                    borderRadius={"14px"}
                    bg={inputBg}
                    shadow="md"
                  >
                    <Input
                      placeholder="Enter your name"
                      value={newUserName}
                      onChange={handleNameChange}
                      variant="unstyled"
                      _placeholder={{ color: "gray.500" }}
                      transition="all 0.3s ease"
                      size="lg"
                      fontSize={"15px"}
                      ml={4}
                    />
                    <Button
                      onClick={handleNameSubmit}
                      fontSize={"15px"}
                      fontWeight={"400"}
                      variant={"unstyled"}
                      borderRadius={"10px"}
                      size="lg"
                      mr={10}
                      transition="all 0.3s ease"
                    >
                      Update Name
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </VStack>
          </Box>
          <Box
            p={{ md: "24px", base: "16px" }}
            bg={bg}
            borderRadius="md"
            boxShadow="lg"
            maxW={{ md: "400px", base: "100%" }}
            flex="1"
          >
            <VStack spacing={6} align="start"   >
              <Text fontSize="lg" fontWeight="600"  >
                Choose a date:
              </Text>
              <Calendar
              className={"color"}
                onChange={handleCalendarChange}
                value={calendarDate}
              />
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Main>
  );
};

export default Accounts;
