import GlobalContext from "../context/GlobalContext";
import React, { useContext, useState, useEffect } from "react";
export function Daymode() {
  const { setIsDayMode, dayModeEvents, daySelected } =
    useContext(GlobalContext);

  function exitDayMode() {
    setIsDayMode(false);
  }

  function isEventInRange(start, end, hour) {
    // Convert start and end times to 24-hour format
    const startTime = parseTimeTo24HourFormat(start);
    const endTime = parseTimeTo24HourFormat(end);
    console.log("Start: ", startTime);
    console.log("End: ", endTime);
    console.log("Hour: ", hour);

    // Check if the hour is within or equal to the range
    return hour >= startTime && hour <= endTime;
  }

  // Helper function to convert time to 24-hour format
  function parseTimeTo24HourFormat(time) {
    const [hours, minutes] = time.split(":").map(Number);

    if (hours == 12 && time.toLowerCase().includes("am")) {
      return hours - 12;
    }
    if (time.toLowerCase().includes("pm") && hours !== 12) {
      return hours + 12;
    }

    return hours;
  }

  const generateHourBlocks = () => {
    const hours = Array.from({ length: 24 }, (_, index) => index);

    return hours.map((hour) => (
      <div
        key={hour}
        style={{ marginTop: "-1rem" }}
        class="grid grid-cols-[minmax(auto,1fr)] gap-0"
      >
        <div class="time-column m-0">
          <div class="flex items-center ">
            <div class="w-1/12 text-right pr-2 text-gray-400 text-sm text-center">
              {hour === 0 ? "12" : hour > 12 ? hour - 12 : hour}:00{" "}
              {hour < 12 ? "AM" : "PM"}
            </div>
            <div class="w-11/12 border-t border-gray-300"></div>
          </div>
        </div>

        <div
          style={{ marginTop: "-1rem" }}
          class="grid grid-cols-[minmax(auto,1fr)] "
        >
          <div class="flex items-center p-2 m-0">
            <div class="w-1/12 text-right pr-2"></div>
            <div style={{ minHeight: "3rem" }} class="w-11/12 text-sm ">
              {dayModeEvents.map(
                (el, i) =>
                  isEventInRange(el.hour, el.endTime, hour) && (
                    <div
                      className="bg-blue-400 text-white rounded px-2 py-1 pb-2 mb-1"
                      key={i}
                    >
                      <p>{el.title}</p>
                      <p>
                        {el.hour} ~ {el.endTime}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  console.log(dayModeEvents);
  return (
    <>
      <div className="block border-t-2 border-gray-200 w-full ">
        <div className="flex flex-col flex-nowrap items-start justify-center ml-32 mb-3 mt-3">
          <div className="flex flex-col items-center">
            <p className="text-blue-600 text-sm">
              {daySelected.format("ddd").toUpperCase()}
            </p>
            <p className="text-xl mt-1 font-semibold bg-blue-500 rounded-full text-white px-4 py-3">
              {daySelected.format("DD")}
            </p>
          </div>
        </div>

        <div class="container mx-auto p-4">
          <div class="grid grid-cols-[minmax(auto,1fr)] gap-0">
            {generateHourBlocks()}
          </div>
        </div>

        {/* <div className="grid grid-cols-12 items-center ">
          <div className="border-r border-gray-300  col-span-1 text-gray-400 text-sm text-center">
            1 AM
          </div>
          <div className="flex-grow border-b border-gray-300 col-span-11 "></div>

          <div className="border-r border-gray-300 col-span-1 ">&nbsp;</div>
          <div className="col-span-11  ">
            {dayModeEvents.map((el, i) => (
              //   <div className={`${el.label}`}>
              <div className="bg-blue-600 text-white rounded px-2">
                <p>{el.title}</p>
                <p>
                  {el.hour} ~ {el.endTime}
                </p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
}
