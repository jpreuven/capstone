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
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import {
  FiHome,
  //   FiTrendingUp,
  //   FiCompass,
  //   FiStar,
  //   FiSettings,
  FiMenu,
} from "react-icons/fi";
import { BsPeopleFill } from "react-icons/bs";
import { MdOutlineApartment } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";
import { IconType } from "react-icons";
import { ReactText } from "react";

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
  // { name: "Logout", icon: GiExitDoor },
];

// Export a function named SimpleSidebar
export default function SimpleSidebar() {
  // Destructure values from useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const dispatch = useDispatch();
  // Create SidebarContent as a function

  function handleRedirect(e) {
    console.log(e);
    history.push(e);
  }
  function handleLogout() {
    fetch("/logout", {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        // console.log("logged out");
        dispatch(setUser(null));
        history.push("/");
      }
    });
  }

  const SidebarContent = ({ onClose, ...rest }) => {
    return (
      // Return JSX
      <Box
        bg={useColorModeValue("black", "gray.900")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        // w={{ base: "full", md: 60 }}
        w="15%"
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          {/* <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold"> */}
          {/* <img src="././client/public/ProperlyManagementSolutionsLogo.jpg" /> */}
          <Image
            mt={12}
            src="/ProperlyManagementSolutionsLogo.jpg"
            onClick={() => handleRedirect("/")}
          />
          {/* </Text> */}
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
  // Create NavItem as a function
  const NavItem = ({ icon, children, ...rest }) => {
    return (
      // Return JSX
      <Box
        as="a"
        // href="#"
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
    // Return JSX
    // <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
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
      {/* mobilenav */}
      {/* <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} /> */}
    </div>
    //   <Box ml={{ base: 0, md: 60 }} p="4">
    //     {/* Content */}
    //     {/* content?? */}
    //   </Box>
    // </Box>
  );
}

// // Define SidebarProps as an object
// const SidebarProps = {
//   onClose: () => {},
// };

// // Define NavItemProps as an object
// const NavItemProps = {
//   icon: null,
//   children: "",
// };

// // Define MobileProps as an object
// const MobileProps = {
//   onOpen: () => {},
// };

// // Create MobileNav as a function
// const MobileNav = ({ onOpen, ...rest }) => {
//   return (
//     // Return JSX
//     <Flex
//       ml={{ base: 0, md: 60 }}
//       px={{ base: 4, md: 24 }}
//       height="20"
//       alignItems="center"
//       bg={useColorModeValue("white", "gray.900")}
//       borderBottomWidth="1px"
//       borderBottomColor={useColorModeValue("gray.200", "gray.700")}
//       justifyContent="flex-start"
//       {...rest}
//     >
//       <IconButton
//         variant="outline"
//         onClick={onOpen}
//         aria-label="open menu"
//         icon={<FiMenu />}
//       />

//       <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
//         Logo
//       </Text>
//     </Flex>
//   );
// };
