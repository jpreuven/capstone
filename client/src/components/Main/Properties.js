import {
  Box,
  SimpleGrid,
  Center,
  Button,
  useColorModeValue,
  Stack,
  Text,
  Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropertyCard from "./PropertyCard";
import AddPropertyForm from "./AddPropertyForm";

export const Properties = (props) => {
  const user = useSelector((state) => state.user.value);
  const [toggleAddProperty, setToggleAddProperty] = useState(false);

  // console.log(user);
  function handleAddNewProperty(e) {
    setToggleAddProperty(!toggleAddProperty);
  }

  const propertiesJSX = user[0].properties.map((property) => {
    return (
      <PropertyCard
        key={property.id}
        id={property.id}
        address={property.address}
        purchase_date={property.purchase_date}
        leases={property.leases}
      />
    );
  });
  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      ml="20%"
      mr="10%"
    >
      {propertiesJSX}
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
          onClick={handleAddNewProperty}
        >
          <Box p={6}>
            <Stack spacing={0} align={"center"} mb={5}>
              <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                Add Property
              </Heading>
              {/* <Text color={"gray.500"}>
                +
              </Text> */}
            </Stack>

            <Stack direction={"row"} justify={"center"} spacing={6}>
              <Stack spacing={0} align={"center"}>
                <Text fontSize={"sm"} color={"black.500"}></Text>
              </Stack>
            </Stack>
          </Box>
        </Button>
      </Center>
      <Center py={6}>{toggleAddProperty ? <AddPropertyForm /> : null}</Center>
    </SimpleGrid>
  );
};

export default Properties;
