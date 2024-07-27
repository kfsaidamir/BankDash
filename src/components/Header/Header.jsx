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
  useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlineCreditScore } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosMenu } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { LuLayers } from "react-icons/lu";
import { CiCreditCard2 } from "react-icons/ci";
import { FaHandHoldingUsd } from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import { auth } from "../../Firebase";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";

const Header = ({ onSearch }) => {
  // Принимаем onSearch как пропс
  const defaultAvatar = "/images/avatar.png";
  const [currentAvatar, setCurrentAvatar] = useState(defaultAvatar);
  const [searchQuery, setSearchQuery] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");
  const menuDisclosure = useDisclosure();
  const settingsDisclosure = useDisclosure();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useState(null);
  const color = useColorModeValue("black", "white");
  const color2 = useColorModeValue("white", "black.400");

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const newAvatar = reader.result;
        setCurrentAvatar(newAvatar);

        try {
          localStorage.setItem("userAvatar", newAvatar);
          console.log("Avatar saved to localStorage");

          const savedEmail = localStorage.getItem("savedEmail");
          if (savedEmail) {
            await fetch(`http://localhost:3000/users?email=${savedEmail}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ avatar: newAvatar }),
            });
            console.log("Avatar updated on the server");
          }
        } catch (error) {
          console.error("Error saving avatar:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const redirectToHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    setCurrentAvatar(defaultAvatar);
    localStorage.removeItem("userAvatar");
    localStorage.clear();
    auth.signOut();
    navigate("/register");
  };

  const register = () => {
    navigate("/register");
  };

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      setCurrentAvatar(savedAvatar);
      console.log("Avatar loaded from localStorage");
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsRegistered(user ? true : false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value); // Передаем значение поиска в родительский компонент
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery); // Передаем запрос на поиск в родительский компонент
    }
  };

  return (
    <div className="header">
      <Box
        w="full"
        zIndex={"99"}
        backdropFilter="blur(10px)"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
        bg={bg}
        position={"fixed"}
        top={"0"}
        left={"0"}
        right={"0"}
      >
        <Container
          maxW="100vw"
          display="flex"
          alignItems="center"
          padding="10px"
          justifyContent="space-between"
        >
          <Flex alignItems="center" gap={2}>
            {/* <Box display={{ md: "block", base: "none" }}>
              <MdOutlineCreditScore fontSize="30px" />
            </Box> */}
            <Text
              fontSize={{ md: "24px", base: "14px" }}
              color="#343C6A"
              fontWeight="800"
              display={{ md: "block", base: "none" }}
            >
              BankDash.
            </Text>
          </Flex>
          <Heading
            fontSize="30px"
            color="#343C6A"
            display={{ md: "block", base: "none" }}
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
              placeholder="Search for a card..."
              fontSize="15px"
              variant={"unstyled"}
              _placeholder={{ color: "#A0AEC0" }}
              flex="1"
              value={searchQuery} // Используем состояние для отображения поискового запроса
              onChange={handleSearchChange} // Обновляем состояние при изменении
            />
            <Button
              variant={"unstyled"}
              fontSize={"13px"}
              color="#343C6A"
              onClick={handleSearch} // Обработчик клика для выполнения поиска
            >
              Search
            </Button>
          </Box>
          <Flex alignItems="center" gap="10px">
            <Button
              borderRadius="10px"
              onClick={menuDisclosure.onOpen}
              display={{ md: "none", base: "block" }}
              color="#343C6A"
              _hover={{ bg: "#f0f0f0" }}
            >
              <IoIosMenu />
            </Button>
            <Drawer
              placement="left"
              onClose={menuDisclosure.onClose}
              isOpen={menuDisclosure.isOpen}
            >
              <DrawerOverlay />
              <DrawerContent bg={bg} color="#343C6A">
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>
                <DrawerBody>
                  <Link to="/dashboard" className="sidebar-link">
                    <MdHome />
                    <i className="icon-home"></i> Dashboard
                  </Link>
                  <Link to="/transactions" className="sidebar-link">
                    <BiTransfer />
                    <i className="icon-transactions"></i> Transactions
                  </Link>
                  <Link to="/accounts" className="sidebar-link">
                    <MdOutlineManageAccounts />
                    <i className="icon-accounts"></i> Accounts
                  </Link>
                  <Link to="/investments" className="sidebar-link">
                    <LuLayers />
                    <i className="icon-investments"></i> Investments
                  </Link>
                  <Link to="/cards" className="sidebar-link">
                    <CiCreditCard2 />
                    <i className="icon-credit-cards"></i> Credit Cards
                  </Link>
                  <Link to="/loans" className="sidebar-link">
                    <FaHandHoldingUsd />
                    <i className="icon-loans"></i> Loans
                  </Link>
                  <Link to="/services" className="sidebar-link">
                    <MdDesignServices />
                    <i className="icon-services"></i> Services
                  </Link>
                  <Link to="/privileges" className="sidebar-link">
                    <TbReportMoney />
                    <i className="icon-privileges"></i> My Privileges
                  </Link>
                  <Link to="/settings" className="sidebar-link">
                    <IoMdInformationCircleOutline />
                    <i className="icon-settings"></i> Account
                  </Link>
                  <Link to="/addCard" className="sidebar-link">
                    <IoIosAddCircleOutline />
                    <i className="icon-settings"></i> Add Card
                  </Link>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <Button
              borderRadius="10px"
              onClick={settingsDisclosure.onOpen}
              display={{ md: "block", base: "block" }}
              color={color}
              _hover={{ bg: "#f0f0f0" }}
            >
              <IoSettingsOutline />
            </Button>
            <Drawer
              placement="left"
              onClose={settingsDisclosure.onClose}
              isOpen={settingsDisclosure.isOpen}
            >
              <DrawerOverlay />
              <DrawerContent bg={bg} color="#343C6A">
                <DrawerCloseButton />
                <DrawerHeader>Account Settings</DrawerHeader>
                <DrawerBody>
                  {isRegistered ? (
                    <>
                      <Avatar src={currentAvatar} size="lg" mb={4} />
                      <Button
                        ml={5}
                        as="label"
                        htmlFor="avatar-upload"
                        color={color2}
                        colorScheme="blue"
                        mb={4}
                      >
                        Change Avatar
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleAvatarChange}
                        />
                      </Button>
                      <Button onClick={handleLogout} colorScheme="blue" mb={4}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={register} colorScheme="blue" mb={4}>
                        Register
                      </Button>
                    </>
                  )}
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <Button
              variant="unstyled"
              fontSize="23px"
              color={color}
              display={"block"}
              onClick={toggleColorMode}
            >
              {colorMode === "light" ? <CiDark /> : <CiLight />}
            </Button>
          </Flex>
        </Container>
      </Box>
    </div>
  );
};

export default Header;
