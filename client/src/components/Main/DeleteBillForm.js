import { Formik } from "formik";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertDate } from "../../util/helper";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import * as yup from "yup";
import { setUser } from "../../app/features/users/userSlice";
import { setProperty } from "../../app/features/properties/propertySlice";
import { setTenant } from "../../app/features/tenant/tenantSlice";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

export const DeleteBillForm = (props) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const property = useSelector((state) => state.property.value)[0];
  const userID = useSelector((state) => state.user.value)[0].id;
  const { id } = useParams();
  const dispatch = useDispatch();

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

  const formSchema = yup.object().shape({
    bill_id: yup.string().required("Bill is required"),
  });

  function handleSubmitButton(value) {
    // console.log(formSchema.fields.bill_id);
    // console.log("handle Submit button");
    // console.log(value);
    // let parsedValue = JSON.parse(billToDelete.bill_id);

    setBillToDelete(JSON.parse(value.bill_id));
    setConfirmDelete(true);
  }
  function handleNoButton(e) {
    setConfirmDelete(false);
  }

  function handleSubmitDeleteBill(value) {
    fetch(`/bills/${billToDelete.bill_id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        console.log(billToDelete);
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
        fetch(`/tenants/${billToDelete.tenant_id}`).then((r) => {
          if (r.ok) {
            r.json().then((new_tenant) => dispatch(setTenant(new_tenant)));
          }
        });
        setConfirmDelete(false);
        setBillToDelete(null);
        console.log(billToDelete);
      }
    });
  }

  return (
    <Formik
      initialValues={{
        bill_id: "",
      }}
      validationSchema={formSchema}
      onSubmit={confirmDelete ? handleNoButton : handleSubmitButton}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <FormControl
            isInvalid={!!props.errors.bill_id && props.touched.bill_id}
          >
            {confirmDelete ? (
              <FormLabel
                htmlFor="bill_id"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: "gray.50",
                }}
              >
                Are you sure you would like to delete this bill?
              </FormLabel>
            ) : (
              <FormLabel
                htmlFor="bill_id"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: "gray.50",
                }}
              >
                Please Choose a Lease:
              </FormLabel>
            )}
            <br />
            {confirmDelete ? (
              <HStack alignContent={"center"} justifyContent={"center"}>
                <Button
                  bg={"red.400"}
                  color={"white"}
                  _hover={{
                    bg: "red.500",
                  }}
                  _focus={{
                    bg: "red.500",
                  }}
                  //   type="submit"
                  onClick={handleSubmitDeleteBill}
                >
                  Yes
                </Button>
                <Button type="submit">No</Button>
              </HStack>
            ) : (
              <Fragment>
                <Select
                  id="bill_id"
                  name="bill_id"
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
                <FormErrorMessage>{props.errors.name}</FormErrorMessage>
                <br />
                <Button
                  bg={"red.400"}
                  color={"white"}
                  _hover={{
                    bg: "red.500",
                  }}
                  _focus={{
                    bg: "red.500",
                  }}
                  type="submit"
                >
                  Delete
                </Button>
              </Fragment>
            )}
          </FormControl>
        </form>
      )}
    </Formik>
  );
};

export default DeleteBillForm;
