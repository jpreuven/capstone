import React, { useState } from "react";
import TenantCard from "./TenantCard";
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
import { useSelector, useDispatch } from "react-redux";
import AddTenantForm from "./AddTenantForm";

export default function Tenants() {
  const user = useSelector((state) => state.user.value);
  const [toggleAddTenant, setToggleAddTenant] = useState(false);

  function handleAddNewTenant(e) {
    setToggleAddTenant(!toggleAddTenant);
  }

  const tenantJSX = user[0].tenants.map((tenant) => {
    return (
      <TenantCard
        key={tenant.id}
        id={tenant.id}
        active={tenant.active}
        email={tenant.email}
        first_name={tenant.first_name}
        last_name={tenant.last_name}
        leases={tenant.leases}
        phone_number={tenant.phone_number}
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
      {tenantJSX}
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
          onClick={handleAddNewTenant}
        >
          <Box p={6}>
            <Stack spacing={0} align={"center"} mb={5}>
              <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                Add Tenant
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
      <Center py={6}>{toggleAddTenant ? <AddTenantForm /> : null}</Center>
    </SimpleGrid>
  );
}
