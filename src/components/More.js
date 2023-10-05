import React, { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import MuiSelect from "./Select";

const labelsClasses = [
  "indigo",
  "gray",
  "green",
  "blue",
  "red",
  "purple",
];

export default function More({ data, day }) {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
    setDaySelected,
    setSelectedEvent,
    timeSelectedFormatted,
    setRefresh,
    refresh,
    setShowMore,
    showMore,
    labelList,
  } = useContext(GlobalContext);

  function handleDelete() {
    setShowMore(false);
  }
  return (
    <div
      className="h-3/4 w-full fixed left-0 top-0 flex justify-center items-center "
      style={{ maxWidth: "100vw" }}
    >
      <form
        className="bg-white rounded-lg shadow-2xl "
        style={{ position: "absolute", width: "15%" }}
      >
        <header className=" px-1 py-2 pr-2 mb-5  justify-between items-center">
          <div className="flex justify-between flex-1 items-center">
            <div
              className="text-center"
              style={{ marginLeft: "40%" }}
            >
              <div className="text-sm text-gray-400 mb-1">
                {day.format("ddd").toUpperCase()}
              </div>
              <div className="text-2xl">{day.format("DD")}</div>
            </div>
            <div className="">
              <button onClick={() => setShowMore(false)}>
                <span className="material-icons-outlined text-gray-400">
                  close
                </span>
              </button>
            </div>
          </div>
        </header>
        <div className="flex-1 cursor-pointer mb-3">
          <div
            onClick={() => {
              setShowMore(false);
              setDaySelected(day);
              setShowEventModal(true);
            }}
          >
            {data
              .filter((el) => {
                return (
                  labelList[el.label] &&
                  Object.keys(labelList).includes(el.label)
                );
              })
              .sort((a, b) => a.timeIndex - b.timeIndex)
              .map((evt, idx) => (
                <div className="flex items-center">
                  <div
                    className={`bg-${evt.label}-500  w-3 h-3 mr-1 ml-3  rounded-full  cursor-pointer`}
                    style={{
                      backgroundColor: evt.label,
                      // opacity: "0.7",
                    }}
                  ></div>
                  <div
                    key={idx}
                    onClick={() => setSelectedEvent(evt)}
                    className="text-sm overflow-hidden"
                    style={{
                      whiteSpace: "nowrap",
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                      maxWidth: "calc(100% - 1.5rem)", // Adjust the width as needed
                    }}
                  >
                    {evt.startTime.split(":")[1].slice(0, 1) === "3"
                      ? evt.startTime + " " + evt.title
                      : evt.startTime.split(":")[0] +
                        evt.startTime.slice(-2) +
                        " " +
                        evt.title}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </form>
    </div>
  );
}
