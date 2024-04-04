import { Avatar, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../../../components/shared/DashboardCard";

export const PieChartCard = ({
  title,
  data,
  label,
  colors,
  reload,
}) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;
  // const [breakDownData, setBreakDownData] = useState(data);
  const [reRender, setReRender] = useState(reload);

  // console.log(label);
  // console.log(breakDownData);
  console.log(data);
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
          colors && colors[seriesIndex]
            ? colors[seriesIndex]
            : "#000"; // Default to black if colors are not provided
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
  // const seriescolumnchart = breakDownData;
  // let seriescolumnchart = data;
  const [seriescolumnchart, setSeriesColumnChart] = useState([]);
  const [options, setOptions] = useState(optionscolumnchart);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      chart: {
        ...prevOptions.chart,
        height: 154, // Update the height to 154
      },
    }));
    setSeriesColumnChart(data);
  }, [data]);

  return (
    <DashboardCard title={title}>
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            // options={optionscolumnchart}
            options={options}
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
                // key={idx}
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
