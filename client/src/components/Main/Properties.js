import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PropertyCard from "./PropertyCard";

export const Properties = (props) => {
  const user = useSelector((state) => state.user.value);
  console.log(user);

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
      //   w="10%"
      ml="20%"
      mr="10%"
    >
      {propertiesJSX}
    </SimpleGrid>
  );
};

export default Properties;
