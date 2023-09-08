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
      r.json().then((data) =>
        //   console.log(data)
        //   dispatch(set)
        dispatch(setTenant(data))
      )
    );
  }, []);

  const totalPaymentList = user[0].ordered_bills.flatMap((bill) => {
    return bill.payments;
  });
  // console.log(totalPaymentList);

  let totalPayments = 0;
  totalPaymentList.forEach((payment) => {
    totalPayments += payment.amount;
  });

  // console.log(tenant_info);
  // const payment_list = user[0].ordered_bills.map((bill) => {
  //   return bill.payments;
  // });
  // console.log(totalPayments);

  const tenant = useSelector((state) => state.tenant.value);

  let sum = 0;
  let tenantTables;
  let data;
  let tenant_info_obj;
  let tenantBillArr;

  if (tenant) {
    console.log(tenant.leases[0].property.address);
    tenantBillArr = tenant.leases[0].bills.flatMap((bill) => {
      let blank_bill;
      if (bill.charges.length === 0 && bill.payments.length === 0) {
        blank_bill = {
          bill_id: bill.id,
          date: bill.date,
          // lease: bill.lease,
          lease: tenant.leases[0],
          // tenant: tenant.first_name + " " + tenant.last_name,
          property: tenant.leases[0].property.address,
        };
      }
      const bill_charges = bill.charges.flatMap((charge) => {
        return {
          charge: charge,
          bill_id: bill.id,
          charge_id: charge.id,
          // lease: bill.lease,
          lease: tenant.leases[0],

          date: bill.date,
          // tenant: tenant.first_name + " " + tenant.last_name,
          property: tenant.leases[0].property.address,

          typeOfCharge: charge.type_of_charge,
        };
      });
      const bill_payments = bill.payments.flatMap((payment) => {
        return {
          payment: payment,
          bill_id: bill.id,
          payment_id: payment.id,
          // lease: bill.lease,
          lease: tenant.leases[0],
          date: payment.date_paid,
          // tenant: tenant.first_name + " " + tenant.last_name,
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
    // console.log(tenantBillArr);
    const flattenedTenantBillArr = tenantBillArr.flatMap((bill) => bill);

    const tenantBillList = flattenedTenantBillArr.filter((bill) => {
      return bill.payment;
    });
    console.log(tenantBillList);
    tenantBillList.forEach((bill) => {
      sum += bill.payment.amount;
    });

    // console.log(flattenedTenantBillArr);
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
              {/* <Td>
                <button
                  onClick={handleEditPayments}
                  style={{ textAlign: "center" }}
                >
                  ✎
                </button>
              </Td> */}
            </Tr>
          ) : null}
          {bill.charge ? (
            <Tr key={bill.charge_id + "charge"}>
              <Td>
                $
                {/* <input type="number" contentEditable value={bill.charges} /> */}
                {bill.charge.amount}
                {/* <input
                  type="number"
                  contentEditable
                  value={charges[bill.id] || bill.charge.amount} // Use charges state value or default value from bill
                  onChange={(e) => handleEditChargeInput(e, bill)} // Handle input change
                  onBlur={(e) => handleChargeInputBlur(e, bill, bill.charge_id)}
                /> */}
              </Td>
              <Td>-</Td>
              <Td>{bill.typeOfCharge}</Td>
              <Td>{convertDate(bill.date)}</Td>
              <Td>{bill.property}</Td>
              {/* <Td>
                <button
                  // onClick={() =>
                  //   handleEditCharge(
                  //     bill.charges,
                  //     bill.charged_for,
                  //     bill.id,
                  //     bill.tenant_id,
                  //     bill.tenant,
                  //     bill.charge_date,
                  //     bill.lease_id,
                  //     bill.charge_id
                  //   )
                  // }
                  style={{ textAlign: "center" }}
                >
                  ✎
                </button>
              </Td> */}
            </Tr>
          ) : null}
        </Fragment>
      );
    });
    /////////////////////////////////////
    // const tenantPayments = tenant.leases[0].bills.map((bill) => {
    //   const payment_amount =
    //     bill.payments.length > 0 ? bill.payments[0]?.amount : 0;
    //   return payment_amount;
    // });

    // tenantPayments.forEach((num) => {
    //   sum += num;
    // });

    // tenant_info_obj = tenant.leases[0].bills.map((bill) => {
    //   const bill_payment = bill.payments.length > 0 ? bill.payments[0] : "-";
    //   const payment_date =
    //     bill.payments.length > 0
    //       ? convertDate(bill.payments[0]?.date_paid)
    //       : "-";
    //   const charge_date = convertDate(bill?.date);

    //   const bill_charge = bill.charges.length > 0 ? bill.charges[0] : "-";
    //   return {
    //     charges: `${bill_charge.amount}`,
    //     payments: `${bill_payment.amount}`,
    //     property: `${tenant.leases[0].property?.address}`,
    //     tenant: `${tenant.first_name} ${tenant.last_name}`,
    //     payment_date: `${payment_date}`,
    //     charge_date: `${charge_date}`,
    //     id: `${bill.id}`,
    //     charge_id: `${bill_charge.id}`,
    //     payment_id: `${bill_payment.id}`,
    //     paid_for: `${bill_payment.paid_for}`,
    //     charged_for: `${bill_charge.type_of_charge}`,
    //   };
    // });
    // tenantTables = tenant_info_obj.reverse().map((bill) => {
    //   return (
    //     <Fragment key={bill.id}>
    //       {bill.payments === "undefined" && bill.charges === "undefined" ? (
    //         <Tr key={bill.payment_id + "payment"}>
    //           <Td>-</Td>
    //           <Td>-</Td>
    //           <Td>-</Td>
    //           <Td>{bill.charge_date}</Td>
    //           <Td>{bill.property}</Td>
    //         </Tr>
    //       ) : null}
    //       {bill.payments !== "undefined" ? (
    //         <Tr key={bill.payment_id + "payment"}>
    //           <Td>-</Td>
    //           <Td>${bill.payments}</Td>
    //           <Td>{bill.paid_for}</Td>
    //           <Td>{bill.payment_date}</Td>

    //           <Td>{bill.property}</Td>
    //         </Tr>
    //       ) : null}
    //       {bill.charges !== "undefined" ? (
    //         <Tr key={bill.charge_id + "charge"}>
    //           <Td>${bill.charges}</Td>
    //           <Td>-</Td>
    //           <Td>{bill.charged_for}</Td>
    //           <Td>{bill.charge_date}</Td>
    //           <Td>{bill.property}</Td>
    //         </Tr>
    //       ) : null}
    //     </Fragment>
    //   );
    // });
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

              {/* <Stack mt={8} direction={"row"} spacing={4}>
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
              </Stack> */}
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
