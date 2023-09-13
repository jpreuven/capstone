import { Box, Center } from "@chakra-ui/react";
import React, { useState, useEffect, useRef, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { setPayment } from "../../app/features/payments/paymentSlice";
import { setUser } from "../../app/features/users/userSlice";
import { convertDate } from "../../util/helper";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import PieChart from "../../util/Piechart";
import {
  Bar,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from "react-chartjs-2";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { current } from "@reduxjs/toolkit";
import { getRandomInt, randomRGBs } from "../../util/helper";

ChartJS.register(ArcElement, Tooltip, Legend);

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

export default function Home() {
  const chartRef = useRef();
  const dispatch = useDispatch();

  let billArr;

  const user = useSelector((state) => state.user.value);
  billArr = user[0].ordered_bills.flatMap((bill) => {
    let blank_bill;
    if (bill.charges.length === 0 && bill.payments.length === 0) {
      blank_bill = {
        bill_id: bill.id,
        date: bill.date,
        lease: bill.lease,
        tenant:
          bill.lease.tenant.first_name + " " + bill.lease.tenant.last_name,
      };
    }
    const bill_charges = bill.charges.flatMap((charge) => {
      return {
        charge: charge,
        bill_id: bill.id,
        charge_id: charge.id,
        lease: bill.lease,
        date: bill.date,
        tenant:
          bill.lease.tenant.first_name + " " + bill.lease.tenant.last_name,
        typeOfCharge: charge.type_of_charge,
      };
    });
    const bill_payments = bill.payments.flatMap((payment) => {
      return {
        payment: payment,
        bill_id: bill.id,
        payment_id: payment.id,
        lease: bill.lease,
        date: payment.date_paid,
        tenant:
          bill.lease.tenant.first_name + " " + bill.lease.tenant.last_name,
        paid_for: payment.paid_for,
      };
    });
    if (blank_bill) {
      return [blank_bill, bill_charges, bill_payments];
    } else {
      return [bill_charges, bill_payments];
    }
  });
  const flattenedBillArr = billArr.flatMap((bill) => bill);
  const dataWithParsedDates = flattenedBillArr.map((item) => ({
    ...item,
    parsedDate: new Date(item.date),
  }));
  dataWithParsedDates.sort((a, b) => b.parsedDate - a.parsedDate);
  let tenantInfoJSX;
  tenantInfoJSX = dataWithParsedDates.map((bill) => {
    return (
      <Fragment key={getRandomInt(999999999999999999) + "bill"}>
        {!bill.charge && !bill.payment ? (
          <Tr key={bill.bill_id}>
            <Td>-</Td>
            <Td>-</Td>
            <Td>{bill.tenant}</Td>
            <Td>{convertDate(bill.date)}</Td>
            <Td>-</Td>
          </Tr>
        ) : null}
        {bill.payment ? (
          <Tr key={bill.payment_id + "payment"}>
            <Td>-</Td>
            <Td>${bill.payment.amount}</Td>
            <Td>{bill.tenant}</Td>
            <Td>{convertDate(bill.date)}</Td>
            <Td>{bill.lease.property.address}</Td>
          </Tr>
        ) : null}
        {bill.charge ? (
          <Tr key={bill.charge_id + "charge"}>
            <Td>${bill.charge.amount}</Td>
            <Td>-</Td>
            <Td>{bill.tenant}</Td>
            <Td>{convertDate(bill.date)}</Td>
            <Td>{bill.lease.property.address}</Td>
          </Tr>
        ) : null}
      </Fragment>
    );
  });
  const payment_list = flattenedBillArr.filter((bill) => bill.payment);
  const tenant_pay_object = {};

  payment_list.forEach((property) => {
    if (tenant_pay_object[property.tenant]) {
      tenant_pay_object[property.tenant] += property.payment.amount;
    } else {
      tenant_pay_object[property.tenant] = property.payment.amount;
    }
  });

  const tenant_pay_list = [];
  for (const [key, value] of Object.entries(tenant_pay_object)) {
    tenant_pay_list.push([key, value]);
  }

  const backgroundAndBorder = randomRGBs(tenant_pay_list.length);
  const backgroundColorList = backgroundAndBorder[0];
  const borderColorsList = backgroundAndBorder[1];

  const data = {
    labels: tenant_pay_list.map((bill) => bill[0]),
    datasets: [
      {
        label: "Total $",
        data: tenant_pay_list.map((bill) => bill[1]),

        backgroundColor: backgroundColorList,

        borderColor: borderColorsList,

        borderWidth: 1,
      },
    ],
  };

  return (
    <Box ml="10%" display="flex" flexDirection="column" alignItems="center">
      <Box
        width="60%"
        height={750}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Pie
          ref={chartRef}
          data={data}
          options={{ maintainAspectRatio: false }}
        />
      </Box>
      <Box
        width="90%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={16}
        mb={16}
      >
        <Box width="80%" height={1500} style={{ overflowX: "auto" }}>
          <Table>
            <Thead>
              <Tr>
                <Th style={{ position: "sticky", top: 0, background: "white" }}>
                  Charges:
                </Th>
                <Th style={{ position: "sticky", top: 0, background: "white" }}>
                  Payments:
                </Th>
                <Th style={{ position: "sticky", top: 0, background: "white" }}>
                  Tenant:
                </Th>
                <Th style={{ position: "sticky", top: 0, background: "white" }}>
                  Date Paid:
                </Th>
                <Th style={{ position: "sticky", top: 0, background: "white" }}>
                  Property:
                </Th>
              </Tr>
            </Thead>
            <Tbody>{tenantInfoJSX}</Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
