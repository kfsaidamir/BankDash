import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import { MdOutlineCreditScore } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useColorModeValue } from "@chakra-ui/react";

const Header = () => {
  const defaultAvatar = "/images/avatar.png";
  const [currentAvatar, setCurrentAvatar] = useState(defaultAvatar);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("white", "gray.800");
  const ho = useColorModeValue("white", "gray.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const fetchAvatar = async () => {
    try {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.avatar) {
            setCurrentAvatar(userData.avatar);
            localStorage.setItem("userAvatar", userData.avatar);
            console.log(
              "Avatar fetched from Firestore and saved to localStorage"
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const newAvatar = reader.result;
        setCurrentAvatar(newAvatar);
        try {
          if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, { avatar: newAvatar });
            console.log("Avatar updated in Firestore");
          }
          localStorage.setItem("userAvatar", newAvatar);
          console.log("Avatar saved to localStorage");
        } catch (error) {
          console.error("Error updating avatar:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const redirectToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      setCurrentAvatar(savedAvatar);
      console.log("Avatar loaded from localStorage");
    } else {
      fetchAvatar();
    }
  }, []);

  return (
    <div className="header">
      <Box w="full">
        <Container
          bg={bg}
          maxW="100vw"
          display="flex"
          alignItems="center"
          padding="10px"
          justifyContent="space-between"
        >
          <Flex alignItems="center" gap={2}>
            <Box display={{ md: "block", base: "none" }}>
              <MdOutlineCreditScore fontSize="30px" color="#343C6A" />
            </Box>
            <Text
              fontSize={{ md: "24px", base: "14px" }}
              color="#343C6A"
              fontWeight="800"
              display={{ md: "block", base: "none" }}
            >
              BankDash.
            </Text>
          </Flex>
          <Heading fontSize="30px" color="#343C6A"
          display={{md:"block", base:"none" }}
          >
            Overview
          </Heading>

          <Box
            w={"max-content"}
            border={"1px solid white"}
            borderRadius={"10px"}
            padding={"5px 10px"}
            display={"flex"}
            gap={"10px"}
            alignItems={"center"}
            boxShadow={"0 2px 4px rgba(0,0,0,0.1)"}
          >
            <Input
              placeholder="Search here"
              fontSize="15px"
              variant={"unstyled"}
              _placeholder={{ color: "#A0AEC0" }}
              flex="1"
            />
            <Button variant={"unstyled"} fontSize={"13px"}>
              Search
            </Button>
          </Box>
          <Flex alignItems="center" gap="10px">
            <Button
              borderRadius="10px"
              onClick={onOpen}
              display={{ md: "block", base: "none" }}
            >
              <IoSettingsOutline />
            </Button>
            <Button borderRadius="10px" display={{ md: "block", base: "none" }}>
              <MdOutlineNotificationsActive />
            </Button>
          </Flex>
          <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Settings</DrawerHeader>
              <DrawerBody>
                <Box>
                  <Button
                    bgColor="#343C6A"
                    onClick={() =>
                      document.getElementById("avatar-upload").click()
                    }
                    variant="unstyled"
                    fontSize="15px"
                    borderRadius="12px"
                    my={"10px"}
                    display={"block"}
                    padding="5px 15px"
                    color={"white"}
                  >
                    Upload Image
                  </Button>
                  <Button
                    my={"10px"}
                    color={"white"}
                    onClick={toggleColorMode}
                    bgColor="#343C6A"
                    display={"block"}
                    borderRadius={"12px"}
                  >
                    {colorMode === "light" ? "Dark" : "Light"}
                  </Button>
                  <Button
                    onClick={redirectToHome}
                    color={"white"}
                    my={"10px"}
                    bgColor="#343C6A"
                    display={"block"}
                    borderRadius={"12px"}
                  >
                    Logout
                  </Button>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <Box>
            <Flex direction="column" align="center" mt={2} gap={1}>
              <Avatar size="lg" src={currentAvatar} />
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                display="none"
                id="avatar-upload"
              />
            </Flex>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default Header;
