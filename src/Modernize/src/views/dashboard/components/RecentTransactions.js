import React from "react";
import DashboardCard from "../../../components/shared/DashboardCard";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Link, Typography } from "@mui/material";

const TopActivities = () => {
  return (
    <DashboardCard title="Top Activities">
      <>
        <Typography
          sx={{ mb: 0, textAlign: "center" }}
          variant="h6"
          fontWeight="600"
        >
          840 Minutes
        </Typography>
        <Typography
          sx={{ mb: 2, textAlign: "center" }}
          color={"grey"}
          fontWeight="400"
        >
          Total Activity Time
        </Typography>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{
            p: 0,
            mb: "-40px",
            "& .MuiTimelineConnector-root": {
              width: "1px",
              backgroundColor: "#efefef",
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.5,
              paddingLeft: 0,
            },
          }}
        >
          <TimelineItem>
            <TimelineOppositeContent>5 Hours</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Swimming</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>3.5 Hours</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Meditation</Typography>{" "}
              {/* <Link href="/" underline="none">
                #ML-3467
              </Link> */}
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>3 Hours</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="success" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Music</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>2 Hours</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="warning" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Running</Typography>{" "}
              {/* <Link href="/" underline="none">
                #ML-3467
              </Link> */}
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>0.5 Hour</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Movie</Typography>
            </TimelineContent>
          </TimelineItem>
          {/* <TimelineItem>
            <TimelineOppositeContent>12:00 am</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="success" variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>Payment Received</TimelineContent>
          </TimelineItem> */}
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default TopActivities;
