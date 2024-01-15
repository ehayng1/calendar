import Day from "./Day";
import GlobalContext from "../context/GlobalContext";
import React, { useState, useContext, useEffect } from "react";
export default function Month({ month }) {
  const {
    setShowSurveyModal,
    doNotShowPostSurveyDate,
    doNotShowPreSurveyDate,
  } = useContext(GlobalContext);

  function preSurveyAlert() {
    const now = new Date();

    const startTime = new Date(now);
    startTime.setHours(21, 55, 0, 0); // 9:55 PM

    const endTime = new Date(now);
    endTime.setHours(22, 5, 0, 0); // 10:05 PM

    const activityTime = new Date(now);
    activityTime.setHours(22, 0, 0, 0); // 10:00 PM

    // Check if the current time is between the specified range
    if (
      now >= startTime &&
      now <= activityTime &&
      (!localStorage.getItem("pre") ||
        localStorage.getItem("pre") != now.toDateString())
    ) {
      console.log(localStorage.getItem("pre"));
      console.log(now.toDateString());
      setShowSurveyModal(true);
    } else if (
      now <= endTime &&
      now >= activityTime &&
      (!localStorage.getItem("post") ||
        localStorage.getItem("post") != now.toDateString())
    ) {
      setShowSurveyModal(true);
    }
  }

  useEffect(() => {
    preSurveyAlert();
  }, []);
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-5">
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <Day day={day} key={idx} rowIdx={i} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
