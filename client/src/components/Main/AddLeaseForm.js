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

export const AddLeaseForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { id } = useParams();

  //   rent_amount
  //   start_date
  //   end_date
  //   property_id
  //   tenant_id

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value)[0];

  const formSchema = yup.object().shape({
    startDate: yup.date().required("Date is required"),
    endDate: yup.date().required("Date is required"),
    rent: yup.number().required("Rent is required"),
    tenant: yup.number().required("Tenant is required"),
  });
  //   const property = useSelector((state) => state.property.value);

  console.log(user.tenants);

  const tenantListJSX = user.tenants.map((tenant) => {
    return (
      <option key={tenant.id} value={tenant.id}>
        {tenant.first_name} {tenant.last_name}
      </option>
    );
  });

  function handleNewLease(value) {
    const newLease = {
      startDate: value["startDate"],
      endDate: value["endDate"],
      rent: value["rent"],
      endDate: value["endDate"],
      tenantID: value["tenant"],
      propertyID: id,
    };
    fetch("/leases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLease),
    }).then((r) => {
      if (r.ok) {
        r.json().then((lease) => {
          fetch(`/users/${user.id}`).then((r) => {
            if (r.ok) {
              r.json().then((new_user) => {
                dispatch(setUser(new_user));
              });
            }
          });
        });
      }
    });

    // fetch("/leases", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newBill),
    // }).then((res) => {
    //   if (res.ok) {
    //     res.json().then((bill) => {
    //       console.log(bill);
    //       fetch(`/users/${user.id}`).then((r) => {
    //         if (r.ok) {
    //           r.json().then((new_user) => {
    //             dispatch(setUser(new_user));
    //             console.log(new_user);
    //           });
    //         }
    //       });
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
    //     });
    //   } else {
    //     res.json().then((error) => {
    //       console.log(error);
    //     });
    //   }
    // });
  }

  return (
    <Formik
      initialValues={{
        startDate: `${new Date().toLocaleDateString("en-CA")}`,
        endDate: `${new Date().toLocaleDateString("en-CA")}`,
        rent: "",
        tenant: "",
      }}
      validationSchema={formSchema}
      onSubmit={handleNewLease}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <FormControl
            isInvalid={!!props.errors.lease_id && props.touched.lease_id}
          >
            <FormLabel htmlFor="name">Add New Lease:</FormLabel>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                const formattedDate = date.toLocaleDateString("en-CA");
                props.setFieldValue("date", formattedDate);
              }}
              dateFormat="MM/dd/yyyy"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                const formattedDate = date.toLocaleDateString("en-CA");
                props.setFieldValue("date", formattedDate);
              }}
              dateFormat="MM/dd/yyyy"
            />
            <FormControl isInvalid={!!props.errors.rent && props.touched.rent}>
              <FormLabel htmlFor="rent">Rent Amount:</FormLabel>
              <Field
                type="number"
                as={Input}
                id="rent"
                name="rent"
                onChange={props.handleChange}
              />
            </FormControl>
            <FormLabel
              htmlFor="tenant"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Please Choose a Tenant:
            </FormLabel>
            <Select
              id="tenant"
              name="tenant"
              placeholder="Select option"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              value={props.values.tenant}
              onChange={props.handleChange}
            >
              {tenantListJSX}
            </Select>

            <FormErrorMessage>{props.errors.name}</FormErrorMessage>
            <Button type="submit">Submit</Button>
          </FormControl>
        </form>
      )}
    </Formik>
  );
};

export default AddLeaseForm;
