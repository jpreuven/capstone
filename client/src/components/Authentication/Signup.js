import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Text,
  Container,
  Input as ChakraInput,
  Button,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../app/features/users/userSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const handleSetUser = (user) => dispatch(setUser(user));

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
        r.json().then((user) => {
          handleSetUser(user);
          history.push("/");
        });
      }
    });
  }

  return (
    <Box
      position={"relative"}
      bg={useColorModeValue("gray.50", "gray.800")}
      minH={"100vh"}
      align={"center"}
      justify={"center"}
    >
      <Container as={SimpleGrid} py={{ base: 10, sm: 20, lg: 32 }}>
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
    </Box>
  );
}
