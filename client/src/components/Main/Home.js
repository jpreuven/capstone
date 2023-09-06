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
  // Center,
} from "@chakra-ui/react";
// import { Center, Square, Circle } from '@chakra-ui/react'

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const chartRef = useRef();

  const user = useSelector((state) => state.user.value);
  console.log(user);

  const bills_to_display = user.properties.flatMap((property) => {
    const data = property.leases.map((lease) => {
      const bill = lease.bills.map((bill) => {
        return bill.payments[0].amount;
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

  const leases = user.properties.flatMap((property) => {
    const data = property.leases.map((lease) => {
      const bills = lease.bills.map((bill) => {
        return (
          <Tr key={bill.id}>
            <Td>${bill.charges[0].amount}</Td>
            <Td>${bill.payments[0].amount}</Td>
            <Td>
              {lease.tenant.first_name} {lease.tenant.last_name}
            </Td>
            <Td>{convertDate(bill.date)}</Td>
            <Td>{property.address}</Td>
          </Tr>
        );
      });
      return bills;
    });
    return data;
  });

  const data = {
    // labels: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"],
    labels: bills_to_display.map((bill) => bill[0]),
    datasets: [
      {
        label: "$",
        // data: [12, 19, 3, 5, 2, 3],
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

  // const leases = user.properties.flatMap((property) => {
  //   const data = property.leases.flatMap((lease) => {
  //     const bills = lease.bills;
  //     // const sorted_bills = [...bills].sort((a, b) => {
  //     //   // const a_slice = a.date.slice(0, 10);
  //     //   // const a_split = a_slice.split("-");
  //     //   // const a_date = new Date(a_split[0], a_split[1], a_split[2]);
  //     //   const a_slice = a.date.slice(0, 10);
  //     //   const a_split = a_slice.split("-");
  //     //   const a_year = parseInt(a_split[0]);
  //     //   const a_month = parseInt(a_split[1]) - 1; // Subtract 1 for zero-based months
  //     //   const a_day = parseInt(a_split[2]);
  //     //   const a_date = new Date(a_year, a_month, a_day);

  //     //   const b_slice = b.date.slice(0, 10);
  //     //   const b_split = b_slice.split("-");
  //     //   const b_year = parseInt(b_split[0]);
  //     //   const b_month = parseInt(b_split[1]) - 1; // Subtract 1 for zero-based months
  //     //   const b_day = parseInt(b_split[2]);
  //     //   const b_date = new Date(b_year, b_month, b_day);

  //     //   return a_date - b_date;
  //     // });
  //     const new_bills = lease.bills.map((bill) => {
  //       return (
  //         // <div key={bill.id}>
  //         {
  //           Bills: `${bill.charges[0].amount}`,
  //           Payments: `${bill.payments[0].amount}`,
  //           Tenant: `${lease.tenant.first_name} ${lease.tenant.last_name}`,
  //           Date: `${Date.parse(bill.date.replace(" ", "T"))}`,
  //           Property: `${property.address}`,
  //         }
  //         // </div>
  //       );
  //     });
  //     return new_bills.sort((a, b) => {
  //       return parseInt(b.Date) - parseInt(a.Date);
  //     });
  //     // const sorted_bills = [...bills].sort((a, b) => {
  //     //   // Parse date strings in "YYYY-MM-DD HH:mm:ss" format
  //     //   const timestampA = Date.parse(a.date.replace(" ", "T"));
  //     //   const timestampB = Date.parse(b.date.replace(" ", "T"));

  //     //   // Extract year and month from the date strings
  //     //   const yearA = new Date(a.date).getFullYear();
  //     //   const monthA = new Date(a.date).getMonth();
  //     //   const yearB = new Date(b.date).getFullYear();
  //     //   const monthB = new Date(b.date).getMonth();

  //     //   // Compare bills by year and month first, then by timestamp (descending)
  //     //   if (yearA === yearB) {
  //     //     if (monthA === monthB) {
  //     //       return timestampB - timestampA; // Compare timestamps within the same month
  //     //     } else {
  //     //       return monthB - monthA; // Compare months within the same year
  //     //     }
  //     //   } else {
  //     //     return yearB - yearA; // Compare years
  //     //   }
  //     // });
  //     // return sorted_bills;
  //   });
  //   return data;
  // });
  // console.log(leases);

  return (
    <Box ml={250} display="flex" flexDirection="column" alignItems="center">
      <h1>Home page</h1>
      <Box
        width={750}
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
        width={1500}
        // style={{ backgroundColor: "rgba(100, 162, 235, 0.1)" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          width={1300}
          // // style={{ backgroundColor: "rgba(100, 162, 235, 0.1)" }}
          // overflow-x="scroll"
          height={1500}
          style={{ overflowX: "scroll", overflowX: "hidden" }}
        >
          <Table>
            <Thead>
              <Tr>
                <Th>Charges:</Th>
                <Th>Payments:</Th>
                <Th>Tenant:</Th>
                <Th>Date:</Th>
                <Th>Property:</Th>
              </Tr>
            </Thead>
            <Tbody>{leases}</Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
