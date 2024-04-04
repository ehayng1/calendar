import Day from "./Day";
import GlobalContext from "../context/GlobalContext";
import React, { useState, useContext, useEffect } from "react";
import LittleHeader from "./LittleHeader";
export default function Month({ month }) {
  const {
    setShowSurveyModal,
    doNotShowPostSurveyDate,
    doNotShowPreSurveyDate,
    isDayMode,
    dayModeEvents,
  } = useContext(GlobalContext);

  function preSurveyAlert() {
    const now = new Date();

    const startTime = new Date(now);
    startTime.setHours(20, 55, 0, 0); // 8:55 PM

    const endTime = new Date(now);
    endTime.setHours(21, 5, 0, 0); // 9:05 PM

    const activityTime = new Date(now);
    activityTime.setHours(21, 0, 0, 0); // 9:00 PM

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
    <div className="flex flex-col flex-1">
      <LittleHeader></LittleHeader>
      <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-white rounded-lg">
        {month.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <Day day={day} key={idx} rowIdx={i} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
