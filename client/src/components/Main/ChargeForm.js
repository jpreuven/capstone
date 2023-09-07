import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as yup from "yup";

import React from "react";

export const ChargeForm = () => {
  const formSchema = yup.object().shape({
    name: yup.string(),
  });

  return (
    <div>
      hello?
      <Formik
        initialValues={{ name: "" }}
        validationSchema={formSchema}
        onSubmit={() => console.log("hi")} // Wrap the console.log in a function
      >
        {(props) => (
          <form>
            <FormControl isInvalid={!!props.errors.name && props.touched.name}>
              <FormLabel htmlFor="name">Charge Form:</FormLabel>
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
    </div>
    // <Formik
    //   initialValues={{ name: "", image: "" }}
    //   validationSchema={formSchema}
    //   onSubmit={handlePostCollection}
    // >
    //   {(props) => (
    //     <form onSubmit={props.handleSubmit}>
    //       <FormControl isInvalid={!!props.errors.name && props.touched.name}>
    //         <FormLabel htmlFor="name">Collection Name:</FormLabel>
    //         <Field
    //           as={Input}
    //           id="name"
    //           name="name"
    //           onChange={Formik.handleChange}
    //         />
    //         <FormErrorMessage>{props.errors.name}</FormErrorMessage>
    //       </FormControl>
    //       <FormControl
    //         isInvalid={!!props.errors.avatar && props.touched.avatar}
    //       >
    //         <FormLabel mt="5" htmlFor="avatar">
    //           Choose an Icon:
    //         </FormLabel>
    //         <Field
    //           as={RadioGroup}
    //           id="avatar"
    //           name="avatar"
    //           py={2}
    //           display="flex"
    //           gridColumnGap={2}
    //         >
    //           {AVATARS.map(({ image }) => {
    //             return <ImageRadio key={image} image={image} value={image} />;
    //           })}
    //         </Field>
    //         <FormErrorMessage>{props.errors.avatar}</FormErrorMessage>
    //       </FormControl>
    //       <Button type="submit">Submit</Button>
    //     </form>
    //   )}
    // </Formik>
  );
};

export default ChargeForm;
