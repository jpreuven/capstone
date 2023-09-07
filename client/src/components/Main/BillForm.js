import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as yup from "yup";

import React from "react";

export const BillForm = () => {
  const formSchema = yup.object().shape({
    name: yup.string(),
  });

  function handleSubmitBill(value) {
    console.log(value);
  }

  return (
    // <div>
    <Formik
      initialValues={{ data: "" }}
      validationSchema={formSchema}
      onSubmit={handleSubmitBill} // Wrap the console.log in a function
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <FormControl isInvalid={!!props.errors.name && props.touched.name}>
            <FormLabel htmlFor="name">Bill Form:</FormLabel>
            <Field
              as={Input}
              id="name"
              name="name"
              onChange={props.handleChange} // Use props.handleChange to handle the change
            />
            <Button type="submit">Submit</Button>
          </FormControl>
        </form>
      )}
    </Formik>
  );
};

export default BillForm;
