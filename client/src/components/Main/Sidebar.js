import React, { ReactNode } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../app/features/users/userSlice";

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { FiHome, FiMenu } from "react-icons/fi";
import { BsPeopleFill } from "react-icons/bs";
import { MdOutlineApartment } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";
// import { IconType } from "react-icons";
// import { ReactText } from "react";

// Define LinkItemProps as an object
const LinkItemProps = {
  name: "",
  icon: null,
};

// Create an array of LinkItemProps objects
const LinkItems = [
  { name: "Home", icon: FiHome, href: "/" },
  { name: "Tenants", icon: BsPeopleFill, href: "/tenants" },
  { name: "Properties", icon: MdOutlineApartment, href: "/properties" },
];

// Export a function named SimpleSidebar
export default function SimpleSidebar() {
  // Destructure values from useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const dispatch = useDispatch();
  // Create SidebarContent as a function

  function handleRedirect(e) {
    // console.log(e);
    history.push(e);
  }
  function handleLogout() {
    fetch("/logout", {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        dispatch(setUser(null));
        history.push("/");
      }
    });
  }

  const SidebarContent = ({ onClose, ...rest }) => {
    return (
      <Box
        bg={useColorModeValue("black", "gray.900")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        w="15%"
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Image
            mt={12}
            src="/ProperlyManagementSolutionsLogo.jpg"
            onClick={() => handleRedirect("/")}
          />
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        <Box mt={20}>
          {LinkItems.map((link) => (
            <NavItem
              color="white"
              key={link.name}
              icon={link.icon}
              onClick={() => handleRedirect(link.href)}
            >
              {link.name}
            </NavItem>
          ))}
          <NavItem icon={GiExitDoor} onClick={handleLogout} color="white">
            Logout
          </NavItem>
        </Box>
      </Box>
    );
  };
  const NavItem = ({ icon, children, ...rest }) => {
    return (
      <Box
        as="a"
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "cyan.400",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    );
  };

  return (
    <div>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
