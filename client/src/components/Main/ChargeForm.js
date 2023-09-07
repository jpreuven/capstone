import {
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as yup from "yup";

import React from "react";

export const ChargeForm = () => {
  const formSchema = yup.object().shape({
    type_of_charge: yup.string().required("Please enter a type of charge"),
    amount: yup.number().required("Please enter charge amount"),
  });

  return (
    <Formik
      initialValues={{ type_of_charge: "", amount: "" }}
      validationSchema={formSchema}
      onSubmit={(value) => console.log(value)} // Wrap the console.log in a function
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Stack spacing={2}>
            <FormControl isInvalid={!!props.errors.name && props.touched.name}>
              <FormLabel htmlFor="type_of_charge">Type of Charge:</FormLabel>
              <Field
                as={Input}
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
                as={Input}
                id="amount"
                name="amount"
                onChange={props.handleChange}
              />
            </FormControl>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      )}
    </Formik>
  );
};

export default ChargeForm;
