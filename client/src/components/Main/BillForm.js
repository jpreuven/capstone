import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import React, { useState } from "react";
import { useSelector } from "react-redux";

export const BillForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const formSchema = yup.object().shape({
    date: yup.date().required("Date is required"),
  });
  const tenant = useSelector((state) => state.tenant.value);

  function handleSubmitBill(value) {
    const new_bill = {
      date: value.date,
      lease_id: tenant.leases[0].id,
    };
    fetch("/bills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_bill),
    }).then((res) => {
      if (res.ok) {
        res.json().then((bill) => {
          console.log(bill);
          //   const updatedCollections = [...collections, collection];
          //   setCollections(updatedCollections);
          //   history.push("/collections");
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
      initialValues={{ date: `${new Date().toLocaleDateString("en-CA")}` }}
      validationSchema={formSchema}
      onSubmit={handleSubmitBill}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <FormControl isInvalid={!!props.errors.name && props.touched.name}>
            <FormLabel htmlFor="name">Bill Form:</FormLabel>
            <DatePicker
              selected={startDate}
              minDate={new Date()}
              onChange={(date) => {
                setStartDate(date);
                const formattedDate = date.toLocaleDateString("en-CA");
                props.setFieldValue("date", formattedDate);
              }}
              dateFormat="MM/dd/yyyy"
              //   renderDayContents={renderDayContents}
            />

            <FormErrorMessage>{props.errors.name}</FormErrorMessage>
            <Button type="submit">Submit</Button>
          </FormControl>
        </form>
      )}
    </Formik>
  );
};

export default BillForm;
