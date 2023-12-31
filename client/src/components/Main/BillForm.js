import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  Select,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertDate } from "../../util/helper";
import { setUser } from "../../app/features/users/userSlice";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { setProperty } from "../../app/features/properties/propertySlice";
import { setTenant } from "../../app/features/tenant/tenantSlice";

export const BillForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { id } = useParams();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value)[0];

  const formSchema = yup.object().shape({
    date: yup.date().required("Date is required"),
    lease_id: yup.string().required("Please choose a lease"),
  });
  const property = useSelector((state) => state.property.value);

  const filteredLeases = user.ordered_leases.filter(
    (lease) => lease.property_id == id
  );

  // const leaseDropdownJSX = property[0].ordered_leases.map((lease) => {
  const leaseDropdownJSX = filteredLeases.map((lease) => {
    const optionValue = JSON.stringify({
      lease_id: lease.id,
      tenant_id: lease.tenant.id,
    });
    return (
      <option key={lease.id} value={optionValue}>
        {convertDate(lease.start_date)} - {convertDate(lease.end_date)} (
        {lease.tenant.first_name} {lease.tenant.last_name})
      </option>
    );
  });

  function handleSubmitBill(value) {
    const parsedValue = JSON.parse(value.lease_id);
    const newBill = {
      date: value.date,
      lease_id: parsedValue.lease_id,
    };

    fetch("/bills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBill),
    }).then((res) => {
      if (res.ok) {
        res.json().then((bill) => {
          console.log(bill);
          fetch(`/users/${user.id}`).then((r) => {
            if (r.ok) {
              r.json().then((new_user) => {
                dispatch(setUser(new_user));
                console.log(new_user);
              });
            }
          });
          // console.log(user);

          // fetch(`/properties/${id}`).then((r) => {
          //   if (r.ok) {
          //     r.json().then((new_property) =>
          //       dispatch(setProperty(new_property))
          //     );
          //   }
          // });

          // fetch(`/tenants/${parsedValue.tenant_id}`).then((r) => {
          //   if (r.ok) {
          //     r.json().then((new_tenant) => dispatch(setTenant(new_tenant)));
          //   }
          // });
        });
      } else {
        res.json().then((error) => {
          console.log(error);
        });
      }
    });
  }

  return (
    <Formik
      initialValues={{
        date: `${new Date().toLocaleDateString("en-CA")}`,
        lease_id: "",
      }}
      validationSchema={formSchema}
      onSubmit={handleSubmitBill}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <FormControl
            isInvalid={!!props.errors.lease_id && props.touched.lease_id}
          >
            <FormLabel htmlFor="name">Bill Form:</FormLabel>
            <DatePicker
              selected={startDate}
              // minDate={new Date()}
              onChange={(date) => {
                setStartDate(date);
                const formattedDate = date.toLocaleDateString("en-CA");
                props.setFieldValue("date", formattedDate);
              }}
              dateFormat="MM/dd/yyyy"
            />
            <FormLabel
              htmlFor="lease_id"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Please Choose a Lease:
            </FormLabel>
            <Select
              id="lease_id"
              name="lease_id"
              placeholder="Select option"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              value={props.values.lease_id}
              onChange={props.handleChange}
            >
              {leaseDropdownJSX}
            </Select>

            <FormErrorMessage>{props.errors.name}</FormErrorMessage>
            <Button type="submit">Submit</Button>
          </FormControl>
        </form>
      )}
    </Formik>
  );
};

export default BillForm;
