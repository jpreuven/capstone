import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Flex,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Text,
  Container,
  Input as ChakraInput,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  IconProps,
  Icon,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Signup({}) {
  //   const [password, setPassword] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [username, setUsername] = useState("");
  //   const [firstName, setFirstName] = useState("");
  //   const [lastName, setLastName] = useState("");

  const formSchema = yup.object().shape({
    username: yup.string().required("Please enter a user name"),
    firstName: yup.string().required("Please add a first name"),
    lastName: yup.string().required("Please enter a last name"),
    email: yup.string().required("Please enter an email address"),
    password: yup.string().required("Please enter a password"),
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (value) => handleSubmit(value),
  });

  const history = useHistory();

  function handleLogin(e) {
    history.push("/login");
  }

  function handleSubmit(e) {
    // e.preventDefault();
    // const new_user = {
    //   firstName: e["firstName"],
    //   lastName: e["lastName"],
    //   username: e["username"],
    //   email: e["email"],
    //   password: e["password"],
    // };
    // console.log(new_user);
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: e["firstName"],
        lastName: e["lastName"],
        username: e["username"],
        email: e["email"],
        password: e["password"],
      }),
    }).then((r) => {
      if (r.ok) {
        r.json().then((user) => console.log(user));
      }
    });
  }

  // const Blur = (props: IconProps) => {
  //   const Blur = (props) => {
  //     return (
  //       <Icon
  //         width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
  //         zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
  //         height="560px"
  //         viewBox="0 0 528 560"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg"
  //         {...props}
  //       >
  //         <circle cx="71" cy="61" r="111" fill="#F56565" />
  //         <circle cx="244" cy="106" r="139" fill="#ED64A6" />
  //         <circle cy="291" r="139" fill="#ED64A6" />
  //         <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
  //         <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
  //         <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
  //         <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
  //       </Icon>
  //     );
  //   };

  return (
    <Box position={"relative"}>
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
          >
            Welcome to{" "}
            <Text
              as={"span"}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
            >
              Noodle-On-It
            </Text>{" "}
          </Heading>
        </Stack>
        <Stack
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: "lg" }}
        >
          <Stack spacing={4}>
            <Heading
              color={"gray.800"}
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            >
              Join the Noodle Community
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
          </Stack>
          <Box as={"form"} onSubmit={formik.handleSubmit} mt={10}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <ChakraInput
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type="text"
                  value={formik.values.firstName}
                  name="firstName"
                  placeholder="First Name"
                  onChange={formik.handleChange}
                  required
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <ChakraInput
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type="text"
                  value={formik.values.lastName}
                  name="lastName"
                  placeholder="Last Name"
                  onChange={formik.handleChange}
                  required
                />
              </FormControl>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <ChakraInput
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  placeholder="Username"
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <ChakraInput
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  placeholder="Password"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <ChakraInput
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type="email"
                  name="email"
                  value={formik.values.email}
                  placeholder="Email"
                  onChange={formik.handleChange}
                  required
                />
              </FormControl>
            </Stack>
            <Button
              fontFamily={"heading"}
              mt={8}
              w={"full"}
              bgGradient="linear(to-r, red.400,pink.400)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, red.400,pink.400)",
                boxShadow: "xl",
              }}
              type="submit"
            >
              Submit
            </Button>
            <Text
              color={"blue.400"}
              _hover={{
                color: "blue.600",
              }}
              onClick={handleLogin}
            >
              Already have an account? Login now!
            </Text>
          </Box>
          form
        </Stack>
      </Container>
      {/* <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      /> */}
    </Box>
  );
}
