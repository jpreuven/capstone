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
// import chargeFormSlice, {
//   setChargeForm,
// } from "../../app/features/chargeForm/chargeFormSlice";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { setProperty } from "../../app/features/properties/propertySlice";
import { convertPhoneNumber, convertDate } from "../../util/helper";
import ChargeForm from "./ChargeForm";
import EditChargeForm from "./EditChargeForm";
import PaymentForm from "./PaymentForm";
import BillForm from "./BillForm";
import DeleteBillForm from "./DeleteBillForm";
import { number } from "yup";
import { MdOutlineModeEdit } from "react-icons/md";
import { BsFillCaretLeftSquareFill } from "react-icons/bs";
import AddLeaseForm from "./AddLeaseForm";
import { getRandomInt } from "../../util/helper";

ChartJS.register(ArcElement, Tooltip, Legend);

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

export const PropertyDetail = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const chartRef = useRef();
  const user = useSelector((state) => state.user.value);
  const [toggleChargeForm, setToggleChargeForm] = useState(false);
  // const [toggleEditChargeForm, setToggleEditChargeForm] = useState(false);
  const [togglePaymentForm, setTogglePaymentForm] = useState(false);
  const [toggleBillForm, setToggleBillForm] = useState(false);
  const [toggleDeleteBillForm, setToggleDeleteBillForm] = useState(false);
  const [toggleAddLeaseForm, setToggleAddLeaseForm] = useState(false);
  const [charges, setCharges] = useState({});

  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    fetch(`/properties/${id}`).then((r) =>
      r.json().then((data) => dispatch(setProperty(data)))
    );
  }, []);

  function handleToggleChargeForm() {
    // dispatch(setChargeForm(null)); //

    setTogglePaymentForm(false);
    setToggleBillForm(false);
    setToggleDeleteBillForm(false);
    setToggleAddLeaseForm(false);
    // setToggleEditChargeForm(false);

    setToggleChargeForm(!toggleChargeForm);
  }

  function handleTogglePaymentForm() {
    // dispatch(setChargeForm(null)); //

    setToggleChargeForm(false);
    setToggleBillForm(false);
    setToggleDeleteBillForm(false);
    setToggleAddLeaseForm(false);
    // setToggleEditChargeForm(false);

    setTogglePaymentForm(!togglePaymentForm);
  }

  function handleToggleBillForm() {
    // dispatch(setChargeForm(null)); //
    setToggleChargeForm(false);
    setTogglePaymentForm(false);
    setToggleDeleteBillForm(false);
    setToggleAddLeaseForm(false);
    // setToggleEditChargeForm(false);

    setToggleBillForm(!toggleBillForm);
  }

  function handleToggleDeleteBillForm() {
    // dispatch(setChargeForm(null)); //

    setToggleChargeForm(false);
    setTogglePaymentForm(false);
    setToggleBillForm(false);
    setToggleAddLeaseForm(false);
    // setToggleEditChargeForm(false);

    setToggleDeleteBillForm(!toggleDeleteBillForm);
  }

  function handleToggleLeaseForm() {
    setToggleChargeForm(false);
    setTogglePaymentForm(false);
    setToggleBillForm(false);
    setToggleDeleteBillForm(false);
    setToggleAddLeaseForm(!toggleAddLeaseForm);
    // setToggleEditChargeForm(false);
  }

  /////////// TODO: have put condition if (bill.payments.length > 1)
  // const totalBillList = user[0].ordered_bills.map((bill) => {
  //   let current_payment;
  //   if (bill.payments.length === 1) {
  //     current_payment = bill.payments[0].amount;
  //   } else if (bill.payments.length === 0) {
  //     current_payment = 0;
  //   }

  //   return current_payment;
  // });

  const totalPaymentList = user[0].ordered_bills.flatMap((bill) => {
    return bill.payments;
  });
  // console.log(totalPaymentList);

  let totalPayments = 0;
  totalPaymentList.forEach((payment) => {
    totalPayments += payment.amount;
  });

  const property = useSelector((state) => state.property.value);

  const filteredOrderedBills = user[0].ordered_bills.filter((bill) => {
    return bill.lease.property_id == id;
  });
  const propertyDetails = user[0].properties.filter((property) => {
    return property.id == id;
  })[0];
  // console.log(propertyDetails);

  let billArr;
  let propertyTables;
  let data;
  let propertyPayments = 0;
  let currentPropertyPayments = 0;

  function handleEditPayments(e) {
    // let editableContent = e.target.innerHTML;
    // handleTogglePaymentForm();
    console.log(e);
  }

  function handleEditChargeInput(e, bill) {
    const inputText = e.target.value; // Use e.target.value to get the input value

    // Check if the input is a valid number
    if (!isNaN(inputText)) {
      // Update the charges state with the new value
      setCharges((prevCharges) => ({
        ...prevCharges,
        [bill.id]: inputText,
      }));
    }
  }

  function handleChargeInputBlur(e, bill, charge) {
    const inputText = e.target.value;

    if (!isNaN(inputText)) {
      // Update the charges state with the new value
      setCharges((prevCharges) => ({
        ...prevCharges,
        [bill.id]: inputText,
      }));

      // Log the new value
      console.log(
        "New value for bill " +
          bill.id +
          ": " +
          inputText +
          "and charge id:" +
          charge
      );
    }
  }

  if (filteredOrderedBills) {
    billArr = filteredOrderedBills.flatMap((bill) => {
      let blank_bill;
      if (bill.charges.length === 0 && bill.payments.length === 0) {
        blank_bill = {
          bill_id: bill.id,
          date: bill.date,
          lease: bill.lease,
          tenant:
            bill.lease.tenant.first_name + " " + bill.lease.tenant.last_name,
        };
      }
      const bill_charges = bill.charges.flatMap((charge) => {
        return {
          charge: charge,
          bill_id: bill.id,
          charge_id: charge.id,
          lease: bill.lease,
          date: bill.date,
          tenant:
            bill.lease.tenant.first_name + " " + bill.lease.tenant.last_name,
          typeOfCharge: charge.type_of_charge,
        };
      });
      const bill_payments = bill.payments.flatMap((payment) => {
        return {
          payment: payment,
          bill_id: bill.id,
          payment_id: payment.id,
          lease: bill.lease,
          date: payment.date_paid,
          tenant:
            bill.lease.tenant.first_name + " " + bill.lease.tenant.last_name,
          paid_for: payment.paid_for,
        };
      });
      if (blank_bill) {
        return [blank_bill, bill_charges, bill_payments];
      } else {
        return [bill_charges, bill_payments];
      }
    });

    // if (property) {
    // console.log(property[0].ordered_bills.filter((bill) => bill.id === 36));
    // billArr = property[0].ordered_bills.flatMap((bill) => {
    //   let blank_bill;
    //   if (bill.charges.length === 0 && bill.payments.length === 0) {
    //     blank_bill = {
    //       bill_id: bill.id,
    //       date: bill.date,
    //       lease: bill.lease,
    //       tenant:
    //         bill.lease.tenant.first_name + " " + bill.lease.tenant.last_name,
    //     };
    //   }
    //   const bill_charges = bill.charges.flatMap((charge) => {
    //     return {
    //       charge: charge,
    //       bill_id: bill.id,
    //       charge_id: charge.id,
    //       lease: bill.lease,
    //       date: bill.date,
    //       tenant:
    //         bill.lease.tenant.first_name + " " + bill.lease.tenant.last_name,
    //       typeOfCharge: charge.type_of_charge,
    //     };
    //   });
    //   const bill_payments = bill.payments.flatMap((payment) => {
    //     return {
    //       payment: payment,
    //       bill_id: bill.id,
    //       payment_id: payment.id,
    //       lease: bill.lease,
    //       date: payment.date_paid,
    //       tenant:
    //         bill.lease.tenant.first_name + " " + bill.lease.tenant.last_name,
    //       paid_for: payment.paid_for,
    //     };
    //   });
    //   if (blank_bill) {
    //     return [blank_bill, bill_charges, bill_payments];
    //   } else {
    //     return [bill_charges, bill_payments];
    //   }
    // });
    const newBillArr = billArr.flatMap((bill) => bill);
    const newPropertyBillList = newBillArr.filter((bill) => {
      return bill.payment;
    });
    newPropertyBillList.forEach((bill) => {
      currentPropertyPayments += bill.payment.amount;
    });

    const dataWithParsedDates = newBillArr.map((item) => ({
      ...item,
      parsedDate: new Date(item.date),
    }));
    dataWithParsedDates.sort((a, b) => b.parsedDate - a.parsedDate);

    propertyTables = dataWithParsedDates.map((bill) => {
      return (
        <Fragment key={getRandomInt(999999999999999999) + "bill"}>
          {!bill.charge && !bill.payment ? (
            <Tr key={bill.bill_id}>
              <Td>-</Td>
              <Td>-</Td>
              <Td>{bill.tenant}</Td>
              <Td>-</Td>
              <Td>{convertDate(bill.date)}</Td>
            </Tr>
          ) : null}
          {bill.payment ? (
            <Tr key={bill.payment_id + "payment"}>
              <Td>-</Td>
              <Td>${bill.payment.amount}</Td>
              <Td>{bill.tenant}</Td>
              <Td>{bill.paid_for}</Td>
              <Td>{convertDate(bill.date)}</Td>
            </Tr>
          ) : null}
          {bill.charge ? (
            <Tr key={bill.charge_id + "charge"}>
              <Td>${bill.charge.amount}</Td>
              <Td>-</Td>
              <Td>{bill.tenant}</Td>
              <Td>{bill.typeOfCharge}</Td>
              <Td>{convertDate(bill.date)}</Td>
            </Tr>
          ) : null}
        </Fragment>
      );
    });

    data = {
      labels: [`${propertyDetails.address}`, `Other Properties`],
      // labels: [`holdup`, `Other Properties`],

      datasets: [
        {
          label: "Total $",
          data: [
            currentPropertyPayments,
            totalPayments - currentPropertyPayments,
          ],

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

  if (!filteredOrderedBills) {
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
            <span>{propertyDetails.address} % of total payments</span>
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
                {propertyDetails.address}
              </Heading>
              <Text fontWeight={600} color={"gray.500"}>
                Purchase Date: {convertDate(propertyDetails.purchase_date)}
              </Text>
              <Text fontWeight={600} color={"gray.500"} mb={4}>
                Current Tenant: TBD
              </Text>
              <Text textAlign={"center"} px={3}></Text>

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
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  _focus={{
                    bg: "gray.200",
                  }}
                  onClick={handleToggleLeaseForm}
                >
                  Create New Lease
                </Button>
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  _focus={{
                    bg: "gray.200",
                  }}
                  onClick={handleToggleDeleteBillForm}
                >
                  Delete a Bill
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
                <ChargeForm
                  toggleChargeForm={toggleChargeForm}
                  setToggleChargeForm={setToggleChargeForm}
                />
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
                <BillForm tenant_id={tenantId} />
              </Box>
            ) : null}
            {toggleDeleteBillForm ? (
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
                <DeleteBillForm />
              </Box>
            ) : null}

            {toggleAddLeaseForm ? (
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
                {/* <DeleteBillForm /> */}
                <AddLeaseForm />
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
                        Tenant:
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
                    </Tr>
                  </Thead>
                  <Tbody>{propertyTables}</Tbody>
                </Table>
              </div>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Center>
  );
};

export default PropertyDetail;
