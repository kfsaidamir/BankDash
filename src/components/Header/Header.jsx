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
} from "@chakra-ui/react";
import { MdOutlineCreditScore } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const defaultAvatar = "/images/avatar.png";
  const [currentAvatar, setCurrentAvatar] = useState(defaultAvatar);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const fetchAvatar = async () => {
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.avatar) {
          setCurrentAvatar(userData.avatar);
          localStorage.setItem("userAvatar", userData.avatar); // Save to LocalStorage
        }
      }
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const newAvatar = reader.result;
        setCurrentAvatar(newAvatar);

        // Save avatar in Firestore and LocalStorage
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, { avatar: newAvatar });
        }
        localStorage.setItem("userAvatar", newAvatar); // Save to LocalStorage

        // Redirect to home after successful upload
        redirectToHome();
      };
      reader.readAsDataURL(file);
    }
  };

  const redirectToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      setCurrentAvatar(savedAvatar);
    } else {
      fetchAvatar();
    }
  }, []); // Load avatar on component's first load

  // Load avatar on each component's reload
  useEffect(() => {
    fetchAvatar();
  }, []);

  return (
    <div className="header">
      <Box w="full">
        <Container
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
          <Heading fontSize="30px" color="#343C6A">
            Overview
          </Heading>
          <Flex
            alignItems="center"
            gap="10px"
            borderBottom={"1px solid gray"}
            padding={"8px"}
          >
            <Button
              variant="unstyled"
              marginBottom={0}
              w={"auto"}
              bgColor={"transparent"}
            >
              <CiSearch />
            </Button>
            <Input
              flex="1"
              placeholder="Find something"
              fontSize="15px"
              focusBorderColor="transparent"
              border="none"
              outline="none"
              borderRadius="30px"
              _placeholder={{ color: "#A0AEC0" }}
            />
          </Flex>
          <Flex alignItems="center" gap="10px">
            <Button borderRadius="10px" onClick={onOpen}>
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
              <DrawerBody >
                <Button
                  bgColor="#343C6A"
                  onClick={() =>
                    document.getElementById("avatar-upload").click()
                  }
                  variant="unstyled"
                  fontSize="12px"
                  borderRadius="12px"
                  padding="5px 15px"
                  color="white"
                >
                  Upload Image
                </Button>
                <Button onClick={redirectToHome}>
                  Logout
                </Button>
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
