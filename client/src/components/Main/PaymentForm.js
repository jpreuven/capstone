import {
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Flex,
  Select,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertDate } from "../../util/helper";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { setProperty } from "../../app/features/properties/propertySlice";
import { setTenant } from "../../app/features/tenant/tenantSlice";
import { setUser } from "../../app/features/users/userSlice";

export const PaymentForm = (props) => {
  const { id } = useParams();
  const [startDate, setStartDate] = useState(new Date());

  const dispatch = useDispatch();

  const userID = useSelector((state) => state.user.value)[0].id;

  const formSchema = yup.object().shape({
    paidFor: yup
      .string()
      .required("Please enter what the tenant is paying for."),
    typeOfPayment: yup
      .string()
      .required("Please enter how the tenant is paying."),
    amount: yup.number().required("Please enter payment amount"),
    billID: yup.string().required("Please choose a bill"),
    date: yup.date().required("Date is required"),
  });
  const property = useSelector((state) => state.property.value)[0];
  let propertyListJSX;
  if (property) {
    propertyListJSX = property.ordered_bills.map((bill) => {
      const optionValue = JSON.stringify({
        billID: bill.id,
        tenantID: bill.lease.tenant.id,
      });
      return (
        <option key={bill.id} value={optionValue}>
          Bill date: {convertDate(bill.date)} | Lease ID: {bill.lease.id} |
          Tenant: {bill.lease.tenant.first_name} {bill.lease.tenant.last_name}
        </option>
      );
    });
  }

  function handleSubmitPayment(value) {
    const parsedValue = JSON.parse(value.billID);
    const newPayment = {
      amount: value.amount,
      paidFor: value.paidFor,
      typeOfPayment: value.typeOfPayment,
      billID: parsedValue.billID,
      date: value.date,
    };
    fetch("/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPayment),
    }).then((res) => {
      if (res.ok) {
        res.json().then((charge) => {
          console.log(charge);
          fetch(`/users/${userID}`).then((r) => {
            if (r.ok) {
              r.json().then((new_user) => dispatch(setUser(new_user)));
            }
          });
          fetch(`/properties/${id}`).then((r) => {
            if (r.ok) {
              r.json().then((new_property) =>
                dispatch(setProperty(new_property))
              );
            }
          });
          fetch(`/tenants/${parsedValue.tenantID}`).then((r) => {
            if (r.ok) {
              r.json().then((new_tenant) => dispatch(setTenant(new_tenant)));
            }
          });
        });
      }
    });
  }

  return (
    <Formik
      initialValues={{
        date: `${new Date().toLocaleDateString("en-CA")}`,
        paidFor: "",
        typeOfPayment: "",
        amount: "",
        billID: "",
      }}
      validationSchema={formSchema}
      onSubmit={(value) => handleSubmitPayment(value)}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Stack spacing={2}>
            <FormControl
              isInvalid={!!props.errors.paidFor && props.touched.paidFor}
            >
              <FormLabel htmlFor="paidFor">Paying For:</FormLabel>
              <Field
                as={Input}
                type="text"
                id="paidFor"
                name="paidFor"
                onChange={props.handleChange}
              />
            </FormControl>
            <FormControl
              isInvalid={
                !!props.errors.typeOfPayment && props.touched.typeOfPayment
              }
            >
              <FormLabel htmlFor="typeOfPayment">
                How are they paying?
              </FormLabel>
              <Field
                as={Input}
                type="text"
                id="typeOfPayment"
                name="typeOfPayment"
                onChange={props.handleChange}
              />
            </FormControl>
            <FormControl
              isInvalid={!!props.errors.amount && props.touched.amount}
            >
              <FormLabel htmlFor="amount">Amount:</FormLabel>
              <Field
                type="number"
                as={Input}
                id="amount"
                name="amount"
                onChange={props.handleChange}
              />
            </FormControl>
            <FormControl
              isInvalid={!!props.errors.billID && props.touched.billID}
            >
              <FormLabel htmlFor="billID">Please Choose a Bill:</FormLabel>
              <Select
                id="billID"
                name="billID"
                placeholder="Select option"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                value={props.values.billID}
                onChange={props.handleChange}
              >
                {propertyListJSX}
              </Select>
            </FormControl>
            <FormControl isInvalid={!!props.errors.date && props.touched.date}>
              <FormLabel htmlFor="date">Date:</FormLabel>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  const formattedDate = date.toLocaleDateString("en-CA");
                  props.setFieldValue("date", formattedDate);
                }}
                dateFormat="MM/dd/yyyy"
              />
            </FormControl>

            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      )}
    </Formik>
  );
};

export default PaymentForm;
