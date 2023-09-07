import React, { useRef, Fragment, useState } from "react";
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
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { setTenant } from "../../app/features/tenant/tenantSlice";
import { convertPhoneNumber, convertDate } from "../../util/helper";
import ChargeForm from "./ChargeForm";
import PaymentForm from "./PaymentForm";
import BillForm from "./BillForm";

ChartJS.register(ArcElement, Tooltip, Legend);

export const TenantDetail = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const chartRef = useRef();
  const user = useSelector((state) => state.user.value);
  const [toggleChargeForm, setToggleChargeForm] = useState(false);
  const [togglePaymentForm, setTogglePaymentForm] = useState(false);
  const [toggleBillForm, setToggleBillForm] = useState(false);

  useEffect(() => {
    fetch(`/tenants/${id}`).then((r) =>
      r.json().then((data) =>
        //   console.log(data)
        //   dispatch(set)
        dispatch(setTenant(data))
      )
    );
  }, []);

  function handleToggleChargeForm() {
    setTogglePaymentForm(false);
    setToggleBillForm(false);
    setToggleChargeForm(!toggleChargeForm);
  }

  function handleTogglePaymentForm() {
    setToggleChargeForm(false);
    setToggleBillForm(false);
    setTogglePaymentForm(!togglePaymentForm);
  }

  function handleToggleBillForm() {
    setToggleChargeForm(false);
    setTogglePaymentForm(false);
    setToggleBillForm(!toggleBillForm);
  }

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
  let tenantTables;
  let data;
  let tenant_info_obj;

  if (tenant) {
    const tenantPayments = tenant.leases[0].bills.map((bill) => {
      const payment_amount =
        bill.payments.length > 0 ? bill.payments[0]?.amount : 0;
      return payment_amount;
    });

    tenantPayments.forEach((num) => {
      sum += num;
    });

    tenant_info_obj = tenant.leases[0].bills.map((bill) => {
      const bill_payment = bill.payments.length > 0 ? bill.payments[0] : "-";
      const payment_date =
        bill.payments.length > 0
          ? convertDate(bill.payments[0]?.date_paid)
          : "-";
      const charge_date =
        bill.charges.length > 0 ? convertDate(bill?.date) : "-";
      //   const charge_date =
      //     bill.charges.length > 0 ? convertDate(bill.charges[0]?.date) : "-";
      const bill_charge = bill.charges.length > 0 ? bill.charges[0] : "-";
      return {
        charges: `${bill_charge.amount}`,
        payments: `${bill_payment.amount}`,
        property: `${tenant.leases[0].property?.address}`,
        tenant: `${tenant.first_name} ${tenant.last_name}`,
        payment_date: `${payment_date}`,
        charge_date: `${charge_date}`,
        id: `${bill.id}`,
        charge_id: `${bill_charge.id}`,
        payment_id: `${bill_payment.id}`,
        paid_for: `${bill_payment.paid_for}`,
        charged_for: `${bill_charge.type_of_charge}`,
      };
    });
    // console.log(tenant_info_obj);
    tenantTables = tenant_info_obj.reverse().map((bill) => {
      return (
        <Fragment key={bill.id}>
          {bill.payments !== "undefined" ? (
            <Tr key={bill.payment_id + "payment"}>
              <Td>-</Td>
              <Td>${bill.payments}</Td>
              <Td>{bill.paid_for}</Td>
              <Td>{bill.payment_date}</Td>

              <Td>{bill.property}</Td>
            </Tr>
          ) : null}
          {bill.charges !== "undefined" ? (
            <Tr key={bill.charge_id + "charge"}>
              <Td>${bill.charges}</Td>
              <Td>-</Td>
              <Td>{bill.charged_for}</Td>
              <Td>{bill.charge_date}</Td>
              <Td>{bill.property}</Td>
            </Tr>
          ) : null}
        </Fragment>
      );
    });
    data = {
      labels: [`${tenant.first_name} ${tenant.last_name}`, `Other Tenants`],
      datasets: [
        {
          label: "Total $",
          data: [sum, totalPayments - sum],

          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(140, 140, 140, 0.2)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(0, 0, 0, 1)"],
          borderWidth: 1,
        },
      ],
    };
  }

  if (!tenant) {
    return <Text ml={100}>Loading...</Text>;
  }
  return (
    <Center py={8}>
      <Flex
        justifyContent={{ base: "center", md: "space-between" }} // Center content horizontally on small screens, create space between on medium screens
        alignItems={{ base: "flex-start", md: "center" }} // Align items to the start on small screens, center on medium screens
        flexDirection={{ base: "column", md: "row" }} // Stack content in a column on small screens, arrange in a row on medium screens
        width="100%"
        // ml="15%"
        ml={{ base: 0, md: "15%" }} // Remove left margin on small screens
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems={{ base: "flex-start", md: "center" }}
        >
          <Box
            // width="60%"
            width={{ base: "100%", md: "60%" }} // Full width on small screens, 60% width on medium screens
            height={500}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Pie
              ref={chartRef}
              data={data}
              options={{
                maintainAspectRatio: false,
              }}
            />
            <span>{tenant.first_name}'s % of total payments</span>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            // alignItems={{ base: "flex-start", md: "center" }}
            // mt="5%"
            alignItems={{ base: "flex-start", md: "center" }} // Align items to the start on small screens, center on medium screens
            mt={{ base: "5%", md: 0 }} // Add top margin on small screens, no margin on medium screens
            width={{ base: "100%", md: "40%" }} // Full width on small screens, 40% width on medium screens
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

              <Stack mt={8} direction={"row"} spacing={4}>
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  _focus={{
                    bg: "gray.200",
                  }}
                  onClick={handleToggleBillForm}
                >
                  Add New Bill
                </Button>
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  _focus={{
                    bg: "gray.200",
                  }}
                  onClick={handleToggleChargeForm}
                >
                  Add Charge
                </Button>
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  _focus={{
                    bg: "gray.200",
                  }}
                  onClick={handleTogglePaymentForm}
                >
                  Add Payment
                </Button>
              </Stack>
            </Box>
            <br />
            {togglePaymentForm ? (
              <Box
                maxW={{ base: "100%", md: "100%" }}
                flex={{ base: "none", md: 1 }} //
                w={"full"}
                boxShadow={"2xl"}
                rounded={"lg"}
                p={6}
                textAlign={"center"}
                mb={5}
              >
                <PaymentForm />
              </Box>
            ) : null}
            {toggleChargeForm ? (
              <Box
                maxW={{ base: "100%", md: "100%" }}
                flex={{ base: "none", md: 1 }} //
                w={"full"}
                boxShadow={"2xl"}
                rounded={"lg"}
                p={6}
                textAlign={"center"}
                mb={5}
              >
                <ChargeForm />
              </Box>
            ) : null}
            {toggleBillForm ? (
              <Box
                maxW={{ base: "100%", md: "100%" }}
                flex={{ base: "none", md: 1 }} //
                w={"full"}
                boxShadow={"2xl"}
                rounded={"lg"}
                p={6}
                textAlign={"center"}
                mb={5}
              >
                <BillForm />
              </Box>
            ) : null}

            <Box w="100%" flex={3} maxHeight="80%">
              <div
                style={{
                  maxHeight: "700px",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
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
                        For:
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
      </Flex>
    </Center>
  );
};

export default TenantDetail;
