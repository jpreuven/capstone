import React, { useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { setTenant } from "../../app/features/tenant/tenantSlice";
import { convertPhoneNumber, convertDate } from "../../util/helper";

ChartJS.register(ArcElement, Tooltip, Legend);

export const TenantDetail = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const chartRef = useRef();
  const user = useSelector((state) => state.user.value);
  console.log(user);

  useEffect(() => {
    fetch(`/tenants/${id}`).then((r) =>
      r.json().then((data) =>
        //   console.log(data)
        //   dispatch(set)
        dispatch(setTenant(data))
      )
    );
  }, []);

  const tenant_info = user[0].ordered_bills.map((bill) => {
    const current_payment =
      bill.payments.length > 0 ? bill.payments[0]?.amount : 0;
    return current_payment;
  });
  const totalPayments = tenant_info.reduce((accumulator, currentPayment) => {
    return accumulator + currentPayment;
  }, 0);

  const tenant = useSelector((state) => state.tenant.value);

  let sum = 0;
  if (tenant) {
    const tenantPayments = tenant.leases[0].bills.map((bill) => {
      //   return bill.payments[0].amount;
      let payment_amount;

      payment_amount = bill.payments.length > 0 ? bill.payments[0]?.amount : 0;
      return payment_amount;
    });

    tenantPayments.forEach((num) => {
      sum += num;
    });
  }

  let tenantTables;

  if (tenant) {
    const tenant_info = tenant.leases[0].bills.map((bill) => {
      const current_payment =
        bill.payments.length > 0 ? bill.payments[0]?.amount : "-";
      const current_date =
        bill.payments.length > 0
          ? convertDate(bill.payments[0]?.date_paid)
          : "-";
      const current_charge =
        bill.charges.length > 0 ? bill.charges[0]?.amount : "-";
      return {
        charges: `${current_charge}`,
        payments: `${current_payment}`,
        property: `${tenant.leases[0].property?.address}`,
        tenant: `${tenant.first_name} ${tenant.last_name}`,
        date: `${current_date}`,
        id: `${bill.id}`,
      };
    });
    tenantTables = tenant_info.reverse().map((bill) => {
      return (
        <Tr key={bill.id}>
          <Td>${bill.charges}</Td>
          <Td>${bill.payments}</Td>
          <Td>{bill.tenant}</Td>
          <Td>{bill.date}</Td>
          <Td>{bill.property}</Td>
        </Tr>
      );
    });
  }
  const data = {
    labels: [`Other Tenants`, `${tenant.first_name} ${tenant.last_name}`],
    datasets: [
      {
        label: "Total $",
        data: [sum, totalPayments - sum],

        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(20, 152, 55, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(20, 152, 55, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (!tenant) {
    return <Text ml={100}>Loading...</Text>;
  }
  return (
    <Center py={6}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems={{ base: "flex-start", md: "center" }}
      >
        <Box
          width="60%"
          height={500}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Pie
            ref={chartRef}
            data={data}
            options={{ maintainAspectRatio: false }}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems={{ base: "flex-start", md: "center" }}
          mt="5%"
        >
          <Box
            maxW={{ base: "100%", md: "100%" }}
            flex={{ base: "none", md: 1 }} //
            w={"full"}
            boxShadow={"2xl"}
            rounded={"lg"}
            p={6}
            textAlign={"center"}
            mb={{ base: "2rem", md: 0 }} //
          >
            <Heading fontSize={"2xl"} fontFamily={"body"}>
              {tenant.first_name} {tenant.last_name}
            </Heading>
            <Text fontWeight={600} color={"gray.500"}>
              {convertPhoneNumber(tenant.phone_number)}
            </Text>
            <Text fontWeight={600} color={"gray.500"} mb={4}>
              {tenant.email}
            </Text>
            <Text textAlign={"center"} px={3}>
              {tenant.leases[0].property.address}
            </Text>
            {/* 
          <Stack
            align={"center"}
            justify={"center"}
            direction={"row"}
            mt={6}
          ></Stack> */}

            <Stack mt={8} direction={"row"} spacing={4}>
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                _focus={{
                  bg: "gray.200",
                }}
              >
                Message
              </Button>
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                boxShadow={
                  "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                }
                _hover={{
                  bg: "blue.500",
                }}
                _focus={{
                  bg: "blue.500",
                }}
              >
                Follow
              </Button>
            </Stack>
          </Box>
          <br />
          <Box w="100%" flex={3} maxHeight="80%">
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              <Table>
                <Thead>
                  <Tr>
                    <Th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                      }}
                    >
                      Charges:
                    </Th>
                    <Th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                      }}
                    >
                      Payments:
                    </Th>
                    <Th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                      }}
                    >
                      Tenant:
                    </Th>
                    <Th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                      }}
                    >
                      Date Paid:
                    </Th>
                    <Th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                      }}
                    >
                      Property:
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>{tenantTables}</Tbody>
              </Table>
            </div>
          </Box>
        </Box>
      </Box>
    </Center>
  );
};

export default TenantDetail;
