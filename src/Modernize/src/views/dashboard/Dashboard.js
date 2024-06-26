import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import PageContainer from "../../components/container/PageContainer";
import { Daily } from "./components/Daily";
import TopActivities from "./components/RecentTransactions";
// components
import SalesOverview from "./components/SalesOverview";
import { PieChartCard } from "./components/YearlyBreakup";

const Dashboard = () => {
  const theme = useTheme();
  const [breakDownData, setBreakDownData] = useState({
    // Gr9Other: 0,
    // Gr9Rec: 0,
    // Gr10Other: 0,
    // Gr10Rec: 0,
    // Gr11Other: 13,
    // Gr11Rec: 0,
    // Gr12Other: 0,
    // Gr12Rec: 0,
    // Other: 13,
    // OtherFemale: 0,
    // OtherMale: 13,
    // Rec: 0,
    // RecFemale: 0,
    // RecMale: 0,
    // morning: 0,
    // evening: 0,
  });
  const [dailyRec, setDailyRec] = useState(0);
  const [dailyOther, setDailyOther] = useState(0);
  const [reload, setReload] = useState(true);

  async function getActivityBreakDownData() {
    const docRef = doc(db, "stats", "Jf8GaQwvyXMWk0Zn8dcR");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      // continue on this
      console.log("BreakDown data:", data);
      // console.log(data.OtherMale + data.RecMale);
      setBreakDownData(data);
      // setBreakDownData({ ...breakDownData, data });
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  async function getDailyOther() {
    const today = dayjs().format("DD MMM YYYY");
    const docRef = doc(db, "numberofEventbyDate", "Other");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      // continue on this

      if (data[today]) {
        setDailyOther(data[today]);
        console.log("Daily Other: ", data[today]);
      } else {
        setDailyOther(0);
      }
      // console.log(data.OtherMale + data.RecMale);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  async function getDailyRec() {
    const today = dayjs().format("DD MMM YYYY");
    const docRef = doc(db, "numberofEventbyDate", "Recommended");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      // continue on this

      if (data[today]) {
        setDailyRec(data[today]);
        console.log("Daily Rec: ", data[today]);
      } else {
        setDailyRec(0);
      }
      // console.log(data.OtherMale + data.RecMale);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  useEffect(() => {
    getActivityBreakDownData();
    getDailyOther();
    getDailyRec();
    setReload(!reload);
  }, []);

  const [data1, setData1] = useState([]);

  // useEffect hook to update data when breakDownData changes
  useEffect(() => {
    let tempArr = [breakDownData.Rec, breakDownData.Other];
    setData1(tempArr);
  }, [breakDownData]);

  const activityData = [10, 5];
  const gradeData = [10, 5, 1, 2];
  const sexData = [10, 5];
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box sx={{ m: 4 }}>
        <Typography sx={{ mb: 2 }} variant="h4" fontWeight="500">
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Daily
              Recommended={dailyRec}
              Other={dailyOther}
              Total={dailyRec + dailyOther}
            />
          </Grid>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TopActivities />
          </Grid>

          <Grid item xs={12} lg={4}>
            {breakDownData.Rec && (
              <PieChartCard
                title={"Activities Breakdown"}
                reload={breakDownData}
                data={[breakDownData.Rec, breakDownData.Other]}
                label={["Recommended", "Other"]}
                colors={[
                  theme.palette.primary.main,
                  theme.palette.secondary.main,
                ]}
              />
            )}
          </Grid>
          <Grid item xs={12} lg={4}>
            {breakDownData.Gr10Other && (
              <PieChartCard
                title={"Grade Breakdown"}
                // reload={breakDownData}
                data={[
                  breakDownData.Gr9Other + breakDownData.Gr9Rec,
                  breakDownData.Gr10Other + breakDownData.Gr10Rec,
                  breakDownData.Gr11Other + breakDownData.Gr11Rec,
                  breakDownData.Gr12Other + breakDownData.Gr12Rec,
                ]}
                label={["Gr. 9", "Gr. 10", "Gr. 11", "Gr. 12"]}
                colors={["#3498db", "#2ecc71", "#e67e22", "#9b59b6"]}
              />
            )}
          </Grid>
          <Grid item xs={12} lg={4}>
            {breakDownData.OtherMale && (
              <PieChartCard
                title={"Gender Breakdown"}
                // reload={{ ...breakDownData }}
                data={[
                  breakDownData.OtherMale + breakDownData.RecMale,
                  breakDownData.OtherFemale + breakDownData.RecFemale,
                ]}
                label={["Male", "Female"]}
                colors={["#3498db", "#e91e63"]}
              />
            )}
          </Grid>
          <Grid item xs={12} lg={4}>
            {breakDownData.morning && (
              <PieChartCard
                title={"Stress Breakdown"}
                data={[breakDownData.morning, breakDownData.evening]}
                label={["Moring", "Evening"]}
                colors={["#3498db", "#e91e63"]}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
