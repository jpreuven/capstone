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

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertDate } from "../../util/helper";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { setProperty } from "../../app/features/properties/propertySlice";
import { setTenant } from "../../app/features/tenant/tenantSlice";
import { setUser } from "../../app/features/users/userSlice";
import { setChargeForm } from "../../app/features/chargeForm/chargeFormSlice";

export const ChargeForm = () => {
  // export const ChargeForm = ({ toggleChargeForm, setToggleChargeForm }) => {

  const { id } = useParams();
  const dispatch = useDispatch();

  const userID = useSelector((state) => state.user.value)[0].id;
  // const chargeInfo = useSelector((state) => state.chargeForm.value);
  // let chargeInfoAmount = "";
  // let chargeInfoChargedFor = "";
  // let chargeInfoBillID = "";
  // let chargeInfoTenantID = "";
  // let chargeInfoTenant = "";
  // let chargeInfoDate = "";
  // let chargeInfolease_id = "";
  // let chargeInfoCharge_id = "";

  // console.log(chargeInfo);

  // if (chargeInfo) {
  //   chargeInfoAmount = chargeInfo.amount;
  //   chargeInfoChargedFor = chargeInfo.chargedFor;
  //   chargeInfoBillID = chargeInfo.bill_id;
  //   chargeInfoTenantID = chargeInfo.tenant_id;
  //   chargeInfoTenant = chargeInfo.tenant;
  //   chargeInfoDate = chargeInfo.date;
  //   chargeInfolease_id = chargeInfo.lease_id;
  //   chargeInfoCharge_id = chargeInfo.charge_id;
  // }
  // console.log(chargeInfo);
  // setChargeForm(chargeInfo);

  const formSchema = yup.object().shape({
    type_of_charge: yup.string().required("Please enter a type of charge"),
    amount: yup.number().required("Please enter charge amount"),
    bill_id: yup.string().required("Please choose a bill"),
  });

  const property = useSelector((state) => state.property.value)[0];
  let propertyListJSX;
  if (property) {
    propertyListJSX = property.ordered_bills.map((bill) => {
      const optionValue = JSON.stringify({
        bill_id: bill.id,
        tenant_id: bill.lease.tenant.id,
      });
      return (
        <option key={bill.id} value={optionValue}>
          Bill date: {convertDate(bill.date)} | Lease ID: {bill.lease.id} |
          Tenant: {bill.lease.tenant.first_name} {bill.lease.tenant.last_name}
        </option>
      );
    });
  }

  // function handleSubmitEditCharge(value) {
  //   console.log(value);
  // }

  function handleSubmitCharge(value) {
    const parsedValue = JSON.parse(value.bill_id);
    const newCharge = {
      amount: value.amount,
      type_of_charge: value.type_of_charge,
      bill_id: parsedValue.bill_id,
    };
    console.log(newCharge);
    fetch("/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCharge),
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
          fetch(`/tenants/${parsedValue.tenant_id}`).then((r) => {
            if (r.ok) {
              r.json().then((new_tenant) => dispatch(setTenant(new_tenant)));
            }
          });
        });
        // dispatch(setChargeForm(null));
        // setToggleChargeForm(false);
        // chargeInfoAmount = "";
        // chargeInfoChargedFor = "";
        // chargeInfoBillID = "";
      }
    });
  }

  // chargeInfoAmount, chargeInfoChargedFor, chargeInfoBillID;
  // console.log(chargeInfoChargedFor);

  return (
    <Formik
      initialValues={{ type_of_charge: "", amount: "", bill_id: "" }}
      // initialValues={{
      //   type_of_charge: chargeInfoChargedFor,
      //   amount: chargeInfoAmount,
      //   bill_id: chargeInfoBillID,
      // }}
      validationSchema={formSchema}
      onSubmit={(value) => handleSubmitCharge(value)} // Wrap the console.log in a function
      // onSubmit={chargeInfo ? handleSubmitEditCharge : handleSubmitCharge}
      // {chargeInfo ? onSubmit={handleSubmitCharge} : onSubmit = {handleSubmitEditCharge}}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Stack spacing={2}>
            <FormControl isInvalid={!!props.errors.name && props.touched.name}>
              <FormLabel htmlFor="type_of_charge">Type of Charge:</FormLabel>
              <Field
                as={Input}
                type="text"
                // placeholder={chargeInfoChargedFor}
                // placeholder=""
                id="type_of_charge"
                name="type_of_charge"
                onChange={props.handleChange}
              />
            </FormControl>
            <FormControl
              isInvalid={!!props.errors.amount && props.touched.amount}
            >
              <FormLabel htmlFor="amount">Amount:</FormLabel>
              <Field
                type="number"
                // placeholder={chargeInfoAmount}
                as={Input}
                id="amount"
                name="amount"
                onChange={props.handleChange}
              />
            </FormControl>
            <FormControl
              isInvalid={!!props.errors.bill_id && props.touched.bill_id}
            >
              <FormLabel htmlFor="bill_id">Please Choose a Bill:</FormLabel>
              <Select
                id="bill_id"
                name="bill_id"
                // autoComplete="lease"
                // placeholder={
                //   chargeInfo
                //     ? `Bill date: ${convertDate(
                //         chargeInfoDate
                //       )} | Lease ID: ${chargeInfolease_id} | Tenant: ${chargeInfoTenant}`
                //     : "Select option"
                // }
                placeholder="Select option"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                value={props.values.bill_id} // Set the value of the Select input
                onChange={props.handleChange}
              >
                {propertyListJSX}
              </Select>
            </FormControl>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      )}
    </Formik>
  );
};

export default ChargeForm;
