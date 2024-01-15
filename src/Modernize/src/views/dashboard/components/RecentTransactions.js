import React, { useContext, useState, useEffect } from "react";
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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";

const TopActivities = () => {
  const [activityArr, setActivityArr] = useState([]);
  const [hoursArr, setHoursArr] = useState([]);
  const [hoursData, setHoursData] = useState([[], [], [], [], []]);
  const [totalTime, setTotalTime] = useState(0);

  async function getActivityHours() {
    // const today = dayjs().format("DD MMM YYYY");
    const docRef = doc(db, "stats", "hoursofEachActivity");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      data = Object.entries(data).sort((a, b) => b[1] - a[1]);
      console.log(data);
      setHoursData(data);
      setTotalTime(
        data[0][1] + data[1][1] + data[2][1] + data[3][1] + data[4][1]
      );
      // console.log(data.OtherMale + data.RecMale);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  useEffect(() => {
    getActivityHours();
  }, []);

  return (
    <DashboardCard title="Top Activities">
      <>
        <Typography
          sx={{ mb: 0, textAlign: "center" }}
          variant="h6"
          fontWeight="600"
        >
          {totalTime}
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
            <TimelineOppositeContent>
              {(hoursData[0][1] / 60).toFixed(2)} Hours
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>{hoursData[0][0]} </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              {(hoursData[1][1] / 60).toFixed(2)} Hours
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>{hoursData[1][0]}</Typography>{" "}
              {/* <Link href="/" underline="none">
                #ML-3467
              </Link> */}
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              {(hoursData[2][1] / 60).toFixed(2)} Hours
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="success" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>{hoursData[2][0]}</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              {(hoursData[3][1] / 60).toFixed(2)} Hours
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="warning" variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>{hoursData[3][0]}</Typography>{" "}
              {/* <Link href="/" underline="none">
                #ML-3467
              </Link> */}
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              {(hoursData[4][1] / 60).toFixed(2)} Hours
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>{hoursData[4][0]}</Typography>
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
