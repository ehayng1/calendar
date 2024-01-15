import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "../../../components/shared/DashboardCard";
import Chart from "react-apexcharts";
import { db } from "../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";

const SalesOverview = () => {
  // select
  const [month, setMonth] = React.useState("1");
  const [otherActivities, setOtherActivities] = useState([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [recActivities, setRecActivities] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [dates, setDates] = useState([
    "01/01",
    "01/01",
    "01/01",
    "01/01",
    "01/01",
    "01/01",
    "01/01",
  ]);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },

    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
    },
    xaxis: {
      categories: dates,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };

  function sortByKey(obj) {
    const sortedKeys = Object.keys(obj).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    const sortedObject = {};
    sortedKeys.forEach((key) => {
      sortedObject[key] = obj[key];
    });

    return sortedObject;
  }

  function generateDatesReverseOrder() {
    const currentDate = new Date();
    const datesArray = [];

    for (let i = 7; i >= 0; i--) {
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - i);

      const day = String(previousDate.getDate()).padStart(2, "0");
      const month = String(previousDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based

      datesArray.push(`${day}/${month}`);
    }

    setDates(datesArray);
  }

  function generatePast7DaysArray(data) {
    // Get the current date
    const currentDate = new Date();

    // Initialize an array to store values for the past 7 days
    const past7DaysArray = [];

    // Loop through the past 7 days
    for (let i = 7; i >= 0; i--) {
      // Calculate the date for the current iteration
      const currentDateCopy = new Date(currentDate);

      // Format the date to match the format in your data object
      currentDateCopy.setDate(currentDate.getDate() - i);
      const formattedDate = dayjs(currentDateCopy).format("DD MMM YYYY");

      // Check if the formatted date exists in the data object
      if (Object.hasOwn(data, formattedDate)) {
        // If the date exists, push the corresponding value to the array
        past7DaysArray.push(data[formattedDate]);
      } else {
        // If the date doesn't exist, push 0 to the array
        past7DaysArray.push(0);
      }
    }
    return past7DaysArray;
  }

  // get numberofEventbyDate data
  useEffect(() => {
    async function getOtherActivities() {
      const docRef = doc(db, "numberofEventbyDate", "Other");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let data = docSnap.data();
        data = generatePast7DaysArray(data);
        console.log("Other data: ", data);
        setOtherActivities(data);
      } else {
        console.log("No such document!");
      }
    }
    async function getRecActivities() {
      const docRef = doc(db, "numberofEventbyDate", "Recommended");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let data = docSnap.data();
        data = generatePast7DaysArray(data);
        console.log("Rec data: ", data);
        setRecActivities(data);
        console.log("Document data:", data);
      } else {
        console.log("No such document!");
      }
    }
    getOtherActivities();
    getRecActivities();
    generateDatesReverseOrder();
  }, []);

  // change this part for chart data
  const seriescolumnchart = [
    {
      name: "Recommended Activities",
      // data: [355, 390, 300, 350, 390, 180, 355],
      data: recActivities,
    },
    {
      name: "Other Activities",
      // data: [280, 250, 325, 215, 250, 310, 280],
      data: otherActivities,
    },
  ];

  return (
    <DashboardCard title="Activities Overview">
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="bar"
        height="370px"
      />
    </DashboardCard>
  );
};

export default SalesOverview;
