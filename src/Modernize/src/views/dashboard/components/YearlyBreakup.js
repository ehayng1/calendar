import React, { useContext, useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft } from "@tabler/icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";

import DashboardCard from "../../../components/shared/DashboardCard";
import { async } from "@firebase/util";
import { func } from "prop-types";

export const PieChartCard = ({ title, data, label, colors }) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;
  const [breakDownData, setBreakDownData] = useState(data);

  // console.log(label);

  // chart
  const optionscolumnchart = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 155,
    },
    // colors: [primary, primarylight, "#F9F9FD"],
    colors: colors,

    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
      // custom({ seriesIndex, w }) {
      //   const bubbleColor =
      //     colors && colors[seriesIndex] ? colors[seriesIndex] : "#000"; // Default to black if colors are not provided
      //   const tooltipStyle = `style="color: ${bubbleColor}; font-weight: bold;"`;

      //   return `<div ${tooltipStyle}>${label[seriesIndex]}: <span>${data[seriesIndex]}</span></div>`;
      // },
      custom({ seriesIndex, w }) {
        const bubbleColor =
          colors && colors[seriesIndex] ? colors[seriesIndex] : "#000"; // Default to black if colors are not provided
        const tooltipStyle = `style="color: ${bubbleColor}; font-weight: bold; padding: 8px;"`; // Adjust the padding value as needed

        return `<div ${tooltipStyle}>${label[seriesIndex]}: <span>${data[seriesIndex]}</span></div>`;
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart = breakDownData;

  return (
    <DashboardCard title={title}>
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height="150px"
          />
        </Grid>
        {/* column */}
        <Grid item xs={12} sm={6}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "2.5rem",
            }}
          >
            {label.map((el, idx) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Avatar
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: colors[idx],
                    svg: { display: "none" },
                  }}
                ></Avatar>
                <Typography variant="subtitle2" color="textSecondary">
                  {el}
                </Typography>
              </div>
            ))}
          </div>
        </Grid>

        {/* column */}
      </Grid>
    </DashboardCard>
  );
};

const YearlyBreakup = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;

  // chart
  const optionscolumnchart = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, "#F9F9FD"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart = [38, 40, 25];

  return (
    <DashboardCard title="Yearly Breakup">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h6" fontWeight="400">
            $36,358
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              +9%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              last year
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primary,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                2022
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primarylight,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                2023
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height="150px"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
