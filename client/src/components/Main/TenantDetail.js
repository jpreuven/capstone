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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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
      r.json().then((data) => dispatch(setTenant(data)))
    );
  }, []);

  const totalPaymentList = user[0].ordered_bills.flatMap((bill) => {
    return bill.payments;
  });

  let totalPayments = 0;
  totalPaymentList.forEach((payment) => {
    totalPayments += payment.amount;
  });

  const tenant = useSelector((state) => state.tenant.value);

  let sum = 0;
  let tenantTables;
  let data;
  let tenant_info_obj;
  let tenantBillArr;

  function activateButton(e) {
    fetch(`/tenants/${tenant.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: !tenant.active }),
    }).then((r) => {
      if (r.ok) {
        r.json().then((tenant) => {
          dispatch(setTenant(tenant));
        });
      }
    });
  }

  if (tenant) {
    console.log(tenant.leases[0].property.address);
    tenantBillArr = tenant.leases[0].bills.flatMap((bill) => {
      let blank_bill;
      if (bill.charges.length === 0 && bill.payments.length === 0) {
        blank_bill = {
          bill_id: bill.id,
          date: bill.date,
          lease: tenant.leases[0],
          property: tenant.leases[0].property.address,
        };
      }
      const bill_charges = bill.charges.flatMap((charge) => {
        return {
          charge: charge,
          bill_id: bill.id,
          charge_id: charge.id,
          lease: tenant.leases[0],

          date: bill.date,
          property: tenant.leases[0].property.address,

          typeOfCharge: charge.type_of_charge,
        };
      });
      const bill_payments = bill.payments.flatMap((payment) => {
        return {
          payment: payment,
          bill_id: bill.id,
          payment_id: payment.id,
          lease: tenant.leases[0],
          date: payment.date_paid,
          property: tenant.leases[0].property.address,

          paid_for: payment.paid_for,
        };
      });
      if (blank_bill) {
        return [blank_bill, bill_charges, bill_payments];
      } else {
        return [bill_charges, bill_payments];
      }
    });
    const flattenedTenantBillArr = tenantBillArr.flatMap((bill) => bill);

    const tenantBillList = flattenedTenantBillArr.filter((bill) => {
      return bill.payment;
    });
    tenantBillList.forEach((bill) => {
      sum += bill.payment.amount;
    });

    const dataWithParsedDates = flattenedTenantBillArr.map((item) => ({
      ...item,
      parsedDate: new Date(item.date),
    }));
    dataWithParsedDates.sort((a, b) => b.parsedDate - a.parsedDate);
    tenantTables = dataWithParsedDates.map((bill) => {
      return (
        <Fragment key={getRandomInt(999999999999999999) + "bill"}>
          {!bill.charge && !bill.payment ? (
            <Tr key={bill.bill_id}>
              <Td>-</Td>
              <Td>-</Td>
              <Td>-</Td>
              <Td>{convertDate(bill.date)}</Td>
              <Td>{bill.property}</Td>
            </Tr>
          ) : null}
          {bill.payment ? (
            <Tr key={bill.payment_id + "payment"}>
              <Td>-</Td>
              <Td>${bill.payment.amount}</Td>
              <Td>{bill.paid_for}</Td>
              <Td>{convertDate(bill.date)}</Td>
              <Td>{bill.property}</Td>
            </Tr>
          ) : null}
          {bill.charge ? (
            <Tr key={bill.charge_id + "charge"}>
              <Td>${bill.charge.amount}</Td>
              <Td>-</Td>
              <Td>{bill.typeOfCharge}</Td>
              <Td>{convertDate(bill.date)}</Td>
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
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems={{ base: "flex-start", md: "center" }}
        flexDirection={{ base: "column", md: "row" }}
        width="100%"
        ml={{ base: 0, md: "15%" }}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems={{ base: "flex-start", md: "center" }}
        >
          <Box
            width={{ base: "100%", md: "60%" }}
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
            alignItems={{ base: "flex-start", md: "center" }}
            mt={{ base: "5%", md: 0 }}
            width={{ base: "100%", md: "40%" }}
          >
            <Box
              maxW={{ base: "100%", md: "100%" }}
              flex={{ base: "none", md: 1 }}
              w={"full"}
              boxShadow={"2xl"}
              rounded={"lg"}
              p={6}
              textAlign={"center"}
              mb={{ base: "2rem", md: 0 }}
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
                  onClick={activateButton}
                >
                  {tenant.active ? "Deactivate Tenant" : "Activate Tenant"}
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
