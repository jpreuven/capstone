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
import { convertDate } from "../../util/helper";

export default function PropertyCard({ id, address, purchase_date, leases }) {
  const history = useHistory();
  function handlePropertyPage() {
    history.push(`/properties/${id}`);
  }
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
        }}
        onClick={handlePropertyPage}
      >
        <Box p={6}>
          <Stack spacing={0} align={"center"} mb={5}>
            <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
              {address}
            </Heading>
            <Text color={"gray.500"}>{convertDate(purchase_date)}</Text>
          </Stack>
        </Box>
      </Button>
    </Center>
  );
}
