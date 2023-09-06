import React from "react";
import TenantCard from "./TenantCard";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

export default function Tenants() {
  const user = useSelector((state) => state.user.value);
  console.log(user);

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
  //   active
  // :
  // false
  // email
  // :
  // "y@y"
  // first_name
  // :
  // "Yoni"
  // id
  // :
  // 1
  // last_name
  // :
  // "Reuven"
  // leases
  // :
  // [{…}]
  // phone_number
  // :
  // 111111111
  // user_id
  // :
  // 1
  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      //   w="10%"
      ml="20%"
      mr="10%"
    >
      {tenantJSX}
    </SimpleGrid>
  );
}
