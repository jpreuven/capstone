import {
  Button,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertDate } from "../../util/helper";
import { setUser } from "../../app/features/users/userSlice";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { setProperty } from "../../app/features/properties/propertySlice";
import { setTenant } from "../../app/features/tenant/tenantSlice";

export default function AddTenantForm() {
  const user = useSelector((state) => state.user.value)[0];
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();

  const propertyList = user
    ? user.properties.map((prop) => (
        <option key={prop.id} value={prop.id}>
          {prop.address}
        </option>
      ))
    : [];
  console.log(propertyList);

  const dispatch = useDispatch();
  const [radioValue, setRadioValue] = useState("True");
  const formSchema = yup.object().shape({
    firstName: yup.string().required("Please provide a first name"),
    lastName: yup.string().required("Please provide a last name"),
    email: yup.string().required("Please provide a email"),
    phoneNumber: yup.number().required("Please provide a phone number"),
    // active: yup.boolean().required("Please note if tenant is active"),
    active: yup.boolean(),
    property: yup.string().required("Please provide a property"),
    rent: yup.number().required("Please enter rent amount"),
    startDate: yup.date().required("Please enter start date"),
    endDate: yup.date().required("Please enter end date"),
  });
  function handleSubmitTenant(value) {
    console.log(value);
    const {
      active,
      email,
      endDate,
      firstName,
      lastName,
      phoneNumber,
      property,
      rent,
      startDate,
    } = value;
    const tenantInfo = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      active: active,
    };

    fetch("/tenants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tenantInfo),
    }).then((res) => {
      if (res.ok) {
        res.json().then((tenant) => {
          const leaseInfo = {
            rent: rent,
            startDate: startDate,
            endDate: endDate,
            propertyID: property,
            tenantID: tenant.id,
          };
          fetch("/leases", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(leaseInfo),
          }).then((r) => {
            if (r.ok) {
              r.json().then((lease) => {
                fetch(`/users/${user.id}`).then((r) => {
                  if (r.ok) {
                    r.json().then((new_user) => {
                      dispatch(setUser(new_user));
                      fetch(`/tenants/${tenant.id}`).then((r) =>
                        r.json().then((data) => {
                          dispatch(setTenant(data));
                          history.push(`/tenants/${tenant.id}`);
                        })
                      );
                    });
                  }
                });
              });
            }
          });
        });
      }
    });
  }
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        active: "",
        property: "",
        rent: "",
        startDate: `${new Date().toLocaleDateString("en-CA")}`,
        endDate: `${new Date().toLocaleDateString("en-CA")}`,
      }}
      validationSchema={formSchema}
      onSubmit={handleSubmitTenant}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <FormControl
            isInvalid={!!props.errors.firstName && props.touched.firstName}
          >
            <Heading>New Tenant Form</Heading>
            <FormLabel
              htmlFor="firstName"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              First Name:
            </FormLabel>
            <Field
              as={Input}
              type="text"
              id="firstName"
              name="firstName"
              onChange={props.handleChange}
            />
          </FormControl>
          <FormControl
            isInvalid={!!props.errors.lastName && props.touched.lastName}
          >
            <FormLabel
              htmlFor="lastName"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Last Name:
            </FormLabel>
            <Field
              as={Input}
              type="text"
              id="lastName"
              name="lastName"
              onChange={props.handleChange}
            />
          </FormControl>
          <FormControl isInvalid={!!props.errors.email && props.touched.email}>
            <FormLabel
              htmlFor="email"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Email:
            </FormLabel>
            <Field
              as={Input}
              type="email"
              id="email"
              name="email"
              onChange={props.handleChange}
            />
          </FormControl>
          <FormControl
            isInvalid={!!props.errors.phoneNumber && props.touched.phoneNumber}
          >
            <FormLabel
              htmlFor="phoneNumber"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Phone Number:
            </FormLabel>
            <Field
              as={Input}
              type="phoneNumber"
              id="phoneNumber"
              name="phoneNumber"
              onChange={props.handleChange}
            />
          </FormControl>
          <FormControl
            isInvalid={!!props.errors.active && props.touched.active}
          >
            <FormLabel
              htmlFor="active"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Active Tenant?
            </FormLabel>
            <RadioGroup
              onChange={(value) => props.setFieldValue("active", value)}
              id="active"
              name="active"
              value={props.values.active}
            >
              <Stack direction="row">
                <Radio value="True">True</Radio>
                <Radio value="False">False</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl
            isInvalid={!!props.errors.property && props.touched.property}
          >
            <FormLabel htmlFor="property">Please Choose a Property:</FormLabel>
            <Select
              id="property"
              name="property"
              placeholder="Select option"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              value={props.values.property}
              onChange={(event) => {
                props.setFieldValue("property", event.target.value);
              }}
            >
              {propertyList}
            </Select>
          </FormControl>
          <FormControl isInvalid={!!props.errors.rent && props.touched.rent}>
            <FormLabel
              htmlFor="rent"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Rent Amount:
            </FormLabel>
            <Field
              as={Input}
              type="rent"
              id="rent"
              name="rent"
              onChange={props.handleChange}
            />
          </FormControl>
          <FormControl
            isInvalid={!!props.errors.startDate && props.touched.startDate}
          >
            <FormLabel htmlFor="startDate">Start Date:</FormLabel>
            <DatePicker
              id="startDate"
              name="startDate"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                const formattedStartDate = date.toLocaleDateString("en-CA");
                props.setFieldValue("startDate", formattedStartDate);
              }}
              dateFormat="MM/dd/yyyy"
            />
          </FormControl>
          <FormControl
            isInvalid={!!props.errors.endDate && props.touched.endDate}
          >
            <FormLabel htmlFor="endDate">End Date:</FormLabel>
            <DatePicker
              id="endDate"
              name="endDate"
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                const formattedEndDate = date.toLocaleDateString("en-CA");
                props.setFieldValue("endDate", formattedEndDate);
              }}
              dateFormat="MM/dd/yyyy"
            />
          </FormControl>

          <Button type="submit">Submit</Button>
        </form>
      )}
    </Formik>
  );
}
