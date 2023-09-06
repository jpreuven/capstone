import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Text,
  Flex,
  Input as ChakraInput,
  Button,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../app/features/users/userSlice";
// import { addTen, subtractAmount } from "../features/budget/budgetSlice/";
// import { UserContext } from "../App";

export default function Login() {
  //   const { value } = React.useContext(UserContext);
  //   const { user, setUser } = useContext(UserContext);
  //   const [userData, setUser] = user;
  //   const [propertyData, setProperty] = property;
  //   console.log(user);
  const [successfulLogin, setSuccessfulLogin] = useState(true);
  // const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleSetUser = (user) => dispatch(setUser(user));
  // console.log(user.value);
  // export defualt function Budget() {
  //    const budget = useSelector (state => state.budget.value)
  //    const dispatch = useDisptach ()
  //    const handleAddTen = () => dispatch(addTen())
  //    const handleSubtract = () => dispatch(subtractAmount(5))
  //  retrun (<div>
  // {budget}
  // <button onClick={handleAddTen}></button>
  // <button onClick={handleSubtract}></button>

  // </div>)
  // }

  const formSchema = yup.object().shape({
    username: yup.string().required("Please enter a user name"),
    password: yup.string().required("Please enter a password"),
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (value) => handleSubmit(value),
  });

  const history = useHistory();

  function handleSignup(e) {
    history.push("/signup");
  }

  function handleSubmit(e) {
    // console.log(e);
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: e.username, password: e.password }),
    }).then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          //   setUser(user);
          handleSetUser(user);
          // console.log(user);
          history.push("/");
        });
        // setCollections()
        // fetchUser(user);

        // history.push("/");
      } else {
        console.log("doesn't exist");
        setSuccessfulLogin(false);
        // setTimeout(() => setSuccessfulLogin(true), 3000);
      }
    });
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        {!successfulLogin ? (
          <Text fontSize={"lg"} color={"red.500"} align={"center"}>
            Invalid Username or Password. Please try again
          </Text>
        ) : null}
        <Box as={"form"} onSubmit={formik.handleSubmit} mt={10}>
          <Stack spacing={4}>
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
            Login
          </Button>
          <Text
            color={"blue.400"}
            _hover={{
              color: "blue.600",
            }}
            onClick={handleSignup}
          >
            Don't have an account? Sign up now!
          </Text>
        </Box>
        form
      </Stack>
    </Flex>
  );
}
