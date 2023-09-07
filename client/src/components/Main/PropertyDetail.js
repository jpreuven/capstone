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

ChartJS.register(ArcElement, Tooltip, Legend);

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
    // setToggleEditChargeForm(false);

    setToggleChargeForm(!toggleChargeForm);
  }

  function handleTogglePaymentForm() {
    // dispatch(setChargeForm(null)); //

    setToggleChargeForm(false);
    setToggleBillForm(false);
    setToggleDeleteBillForm(false);
    // setToggleEditChargeForm(false);

    setTogglePaymentForm(!togglePaymentForm);
  }

  function handleToggleBillForm() {
    // dispatch(setChargeForm(null)); //
    setToggleChargeForm(false);
    setTogglePaymentForm(false);
    setToggleDeleteBillForm(false);
    // setToggleEditChargeForm(false);

    setToggleBillForm(!toggleBillForm);
  }

  function handleToggleDeleteBillForm() {
    // dispatch(setChargeForm(null)); //

    setToggleChargeForm(false);
    setTogglePaymentForm(false);
    setToggleBillForm(false);
    // setToggleEditChargeForm(false);

    setToggleDeleteBillForm(!toggleDeleteBillForm);
  }

  const totalBillList = user[0].ordered_bills.map((bill) => {
    const current_payment =
      bill.payments.length > 0 ? bill.payments[0]?.amount : 0;
    return current_payment;
  });

  let totalPayments = 0;
  totalBillList.forEach((payment) => {
    totalPayments += payment;
  });

  const property = useSelector((state) => state.property.value);
  let currentDate;
  let dateInDatebase;
  let billArr;
  let propertyTables;
  let data;
  let propertyPayments = 0;

  function handleEditPayments(e) {
    // let editableContent = e.target.innerHTML;
    // handleTogglePaymentForm();
    console.log(e);
  }
  console.log(property);

  // function handleEditCharge(
  //   amount,
  //   chargedFor,
  //   bill_id,
  //   tenant_id,
  //   tenant,
  //   date,
  //   lease_id,
  //   charge_id
  // ) {
  //   // setToggleChargeForm
  //   const chargeInfo = {
  //     amount: amount,
  //     chargedFor: chargedFor,
  //     bill_id: bill_id,
  //     tenant_id: tenant_id,
  //     tenant: tenant,
  //     date: date,
  //     lease_id: lease_id,
  //     charge_id: charge_id,
  //   };

  //   setTogglePaymentForm(false);
  //   setToggleBillForm(false);
  //   setToggleDeleteBillForm(false);
  //   setToggleEditChargeForm(true);

  //   if (toggleChargeForm) {
  //     dispatch(setChargeForm(chargeInfo));
  //     setToggleChargeForm(false);

  //     setToggleChargeForm(true);

  //     console.log("just switch and edit");
  //     // console.log(amount, chargedFor, bill_id);
  //   }
  //   if (!toggleChargeForm) {
  //     dispatch(setChargeForm(chargeInfo));
  //     setToggleChargeForm(true);
  //     console.log("And only now switch and edit");
  //     // console.log(amount, chargedFor, bill_id);
  //   }
  // }

  if (property) {
    // currentDate = new Date();
    // let oneYearLater = new Date("2024-01-01 00:00:00");
    // let middleDate = new Date("2023-10-01 00:00:00");
    // console.log(currentDate < middleDate && middleDate < oneYearLater);
    // console.log(property);
    const propertyBillList = property[0].ordered_bills.map((bill) => {
      if (bill.payments.length > 0) {
        return bill.payments[0].amount;
      } else {
        return 0;
      }
    });
    propertyBillList.forEach((bill) => {
      propertyPayments += bill;
    });

    billArr = property[0].ordered_bills.map((bill) => {
      const bill_payment = bill.payments.length > 0 ? bill.payments[0] : "-";
      const payment_date =
        bill.payments.length > 0
          ? convertDate(bill.payments[0]?.date_paid)
          : "-";
      const charge_date =
        // bill.charges.length > 0 ? convertDate(bill?.date) : "-";
        convertDate(bill.date);
      const bill_charge = bill.charges.length > 0 ? bill.charges[0] : "-";
      return {
        charges: `${bill_charge.amount}`,
        payments: `${bill_payment.amount}`,
        tenant: `${bill.lease.tenant.first_name} ${bill.lease.tenant.last_name}`,
        tenant_id: `${bill.lease.tenant.id}`,
        payment_date: `${payment_date}`,
        charge_date: `${charge_date}`,
        id: `${bill.id}`,
        charge_id: `${bill_charge.id}`,
        payment_id: `${bill_payment.id}`,
        paid_for: `${bill_payment.paid_for}`,
        charged_for: `${bill_charge.type_of_charge}`,
        lease_id: `${bill.lease.id}`,
      };
    });
    // console.log(billArr);

    propertyTables = billArr.map((bill) => {
      return (
        <Fragment key={bill.id}>
          {bill.payments === "undefined" && bill.charges === "undefined" ? (
            <Tr key={bill.payment_id + "payment"}>
              <Td>-</Td>
              <Td>-</Td>
              <Td>{bill.tenant}</Td>
              <Td>-</Td>
              <Td>{bill.charge_date}</Td>
            </Tr>
          ) : null}
          {bill.payments !== "undefined" ? (
            <Tr key={bill.payment_id + "payment"}>
              <Td>-</Td>
              <Td>${bill.payments}</Td>
              <Td>{bill.tenant}</Td>
              <Td>{bill.paid_for}</Td>
              <Td>{bill.payment_date}</Td>
              <Td>
                <button
                  onClick={handleEditPayments}
                  style={{ textAlign: "center" }}
                >
                  ✎
                </button>
              </Td>
            </Tr>
          ) : null}
          {bill.charges !== "undefined" ? (
            <Tr key={bill.charge_id + "charge"}>
              <Td>
                $
                <div type="number" contentEditable>
                  {bill.charges}
                </div>
              </Td>
              <Td>-</Td>
              <Td>{bill.tenant}</Td>
              <Td>{bill.charged_for}</Td>
              <Td>{bill.charge_date}</Td>
              <Td>
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
              </Td>
            </Tr>
          ) : null}
        </Fragment>
      );
    });
    data = {
      labels: [`${property[0].address}`, `Other Properties`],
      datasets: [
        {
          label: "Total $",
          data: [propertyPayments, totalPayments - propertyPayments],

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

  if (!property) {
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
            <span>{property[0].address} % of total payments</span>
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
                {property[0].address}
              </Heading>
              <Text fontWeight={600} color={"gray.500"}>
                Purchase Date: {convertDate(property[0].purchase_date)}
              </Text>
              <Text fontWeight={600} color={"gray.500"} mb={4}>
                Current Tenant: TBD
              </Text>
              <Text textAlign={"center"} px={3}>
                {/* {tenant.leases[0].property.address} */}
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
            {/* {togglePaymentForm ? (
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
                <EditChargeForm />
              </Box>
            ) : null} */}

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
                      <Th
                        style={{
                          position: "sticky",
                          top: 0,
                          background: "white",
                        }}
                      >
                        Edit:
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
