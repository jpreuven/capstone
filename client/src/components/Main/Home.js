import { Box, Center } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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

ChartJS.register(ArcElement, Tooltip, Legend);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default function Home() {
  const chartRef = useRef();

  const user = useSelector((state) => state.user.value);
  // console.log(user);
  const tenant_info = user[0].ordered_bills.map((bill) => {
    const current_payment =
      bill.payments.length > 0 ? bill.payments[0]?.amount : "-";
    const current_date =
      bill.payments.length > 0 ? convertDate(bill.payments[0]?.date_paid) : "-";
    const current_charge =
      bill.charges.length > 0 ? bill.charges[0]?.amount : "-";
    return {
      // charges: `${bill.charges[0].amount}`,
      charges: `${current_charge}`,
      payments: `${current_payment}`,
      property: `${bill.lease.property.address}`,
      tenant: `${bill.lease.tenant.first_name} ${bill.lease.tenant.last_name}`,
      date: `${current_date}`,
    };
  });
  // console.log(tenant_info);
  const tenantInfoJSX = tenant_info.map((bill) => {
    return (
      <Tr key={getRandomInt(9999999999)}>
        <Td>${bill.charges}</Td>
        <Td>${bill.payments}</Td>
        <Td>{bill.tenant}</Td>
        <Td>{bill.date}</Td>
        <Td>{bill.property}</Td>
      </Tr>
    );
  });
  // const payment_to_display = tenant_info.map((tenant) => {});
  const bills_to_display = user[0].properties.flatMap((property) => {
    const data = property.leases.map((lease) => {
      const bill = lease.bills.map((bill) => {
        if (bill.payments.length > 0) {
          return bill.payments[0]?.amount;
        } else {
          return 0;
        }
      });
      let sum = bill.reduce(function (x, y) {
        return parseInt(x) + parseInt(y);
      }, 0);
      const tenant = lease.tenant.first_name + " " + lease.tenant.last_name;
      return [tenant, sum];
    });
    return data;
  });
  // console.log(bills_to_display);

  const data = {
    labels: bills_to_display.map((bill) => bill[0]),
    datasets: [
      {
        label: "Total $",
        data: bills_to_display.map((bill) => bill[1]),

        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(20, 152, 55, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(20, 152, 55, 1)",
          "rgba(255, 159, 64, 1)",
        ],
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
        <Box
          width="80%"
          height={1500}
          style={{ overflowX: "scroll", overflowX: "hidden" }}
        >
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
                  Date:
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
