import {
  Button,
  FormControl,
  FormLabel,
  GridItem,
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
  const [date, setDate] = useState(new Date());
  const history = useHistory();

  const dispatch = useDispatch();
  const formSchema = yup.object().shape({
    address: yup.string().required("Please provide a address"),
    date: yup.date().required("Please enter start date"),
  });
  function handleSubmitProperty(value) {
    console.log(value);
    fetch("/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    }).then((res) => {
      if (res.ok) {
        res.json().then((property) => {
          fetch(`/users/${user.id}`).then((r) => {
            if (r.ok) {
              r.json().then((new_user) => {
                dispatch(setUser(new_user));
                fetch(`/properties/${property.id}`).then((r) =>
                  r.json().then((data) => {
                    dispatch(setProperty(data));
                    history.push(`/properties/${property.id}`);
                  })
                );
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
        address: "",
        date: `${new Date().toLocaleDateString("en-CA")}`,
      }}
      validationSchema={formSchema}
      onSubmit={handleSubmitProperty}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <FormControl
            isInvalid={!!props.errors.address && props.touched.address}
          >
            <FormLabel
              htmlFor="address"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              address:
            </FormLabel>
            <Field
              as={Input}
              type="address"
              id="address"
              name="address"
              onChange={props.handleChange}
            />
          </FormControl>

          <FormControl isInvalid={!!props.errors.date && props.touched.date}>
            <FormLabel htmlFor="date">Start Date:</FormLabel>
            <DatePicker
              id="date"
              name="date"
              selected={date}
              onChange={(date) => {
                setDate(date);
                const formatteddate = date.toLocaleDateString("en-CA");
                props.setFieldValue("date", formatteddate);
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
