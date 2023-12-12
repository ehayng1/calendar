import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

// components
import SalesOverview from "./components/SalesOverview";
import YearlyBreakup from "./components/YearlyBreakup";
import TopActivities from "./components/RecentTransactions";
import ProductPerformance from "./components/ProductPerformance";
import Blog from "./components/Blog";
import MonthlyEarnings from "./components/MonthlyEarnings";
import { PieChartCard } from "./components/YearlyBreakup";
import { Daily } from "./components/Daily";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box sx={{ m: 4 }}>
        <Typography sx={{ mb: 2 }} variant="h4" fontWeight="500">
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Daily />
          </Grid>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TopActivities />

            {/* <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid> */}
          </Grid>

          <Grid item xs={12} lg={4}>
            <PieChartCard
              title={"Activities Breakup"}
              label={["Recommended", "Other"]}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <PieChartCard
              title={"Grade Breakup"}
              label={["Gr. 9", "Gr. 10", "Gr. 11", "Gr. 12"]}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <PieChartCard title={"Sex Breakup"} label={["Male", "Female"]} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TopActivities />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          {/* <Grid item xs={12}>
            <Blog />
          </Grid> */}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
