import React from "react";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function TenantCard({
  active,
  email,
  first_name,
  last_name,
  leases,
  phone_number,
  id,
}) {
  const history = useHistory();
  function handleTenantPage() {
    history.push(`/tenants/${id}`);
  }
  //   console.log(active);
  //   console.log(leases[0]);
  return (
    <Center py={6}>
      <Button
        maxW={"270px"}
        w={"full"}
        h="100%"
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg",
          bg: "black",
          color: "white",
          //   fontcolor: "white",
          //   {useColorModeValue("black","black.800")}
        }}
        onClick={handleTenantPage}
      >
        <Box p={6}>
          <Stack spacing={0} align={"center"} mb={5}>
            <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
              {first_name} {last_name}
            </Heading>
            <Text color={"gray.500"}>{leases[0].property.address}</Text>
          </Stack>

          <Stack direction={"row"} justify={"center"} spacing={6}>
            <Stack spacing={0} align={"center"}>
              {active ? (
                <Text fontSize={"sm"} color={"black.500"}>
                  Active
                </Text>
              ) : (
                <Text fontSize={"sm"} color={"black.500"}>
                  Not Active
                </Text>
              )}
            </Stack>
          </Stack>

          {/* <Button
            w={"full"}
            mt={8}
            bg={useColorModeValue("#151f21", "gray.900")}
            color={"white"}
            rounded={"md"}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
          >
            Follow
          </Button> */}
        </Box>
      </Button>
    </Center>
  );
}
