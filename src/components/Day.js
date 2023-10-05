import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import More from "./More";

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeEvents, setActiveEvents] = useState();

  const {
    daySelected,
    setDaySelected,
    setShowEventModal,
    showMore,
    setShowMore,
    filteredEvents,
    setSelectedEvent,
    refresh,
    labelList,
    monthIndex,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) =>
        dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  //getEvents
  useEffect(() => {
    const getEvents = async () => {
      const docRef = doc(db, "events", "EyepSY8B48R8cqeWozZs(USER1)");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = Object.values(docSnap.data());
        // data.startTime = data.startTime.split(":")[1];

        const filtered = [...data].filter(
          // (el) => el.date === day.format("DD MMM YYYY")
          (el) => {
            return el.date === day.format("DD MMM YYYY");
          }
        );

        const sorted = filtered.sort(
          (a, b) => a.timeIndex - b.timeIndex
        );

        const arr = filtered.filter((el) => {
          return (
            labelList[el.label] &&
            Object.keys(labelList).includes(el.label)
          );
        });
        setActiveEvents(arr.length);

        setEvents(sorted);
      } else {
        console.log("No such document!");
      }
    };
    getEvents();
  }, [refresh, day]); // update the events whenver "day" changes

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }
  return (
    <>
      {showMore &&
        daySelected.format("DD-MM-YY") === day.format("DD-MM-YY") && (
          <More data={events} day={day}></More>
        )}
      <div
        className="border border-gray-200 flex flex-col"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        <header className="flex flex-col items-center cursor-pointer">
          {rowIdx === 0 && (
            <p className="text-sm mt-1 font-semibold">
              {day.format("ddd").toUpperCase()}
            </p>
          )}
          <p
            className={`text-sm p-1 mt-1 my text-center  ${getCurrentDayClass()}`}
          >
            {day.format("DD")}
          </p>
        </header>
        <div className="flex-1 cursor-pointer">
          <div
            onClick={() => {
              setDaySelected(day);
              setShowEventModal(true);
            }}
          >
            {events
              .filter((el) => {
                return (
                  labelList[el.label] &&
                  Object.keys(labelList).includes(el.label)
                );
              })
              .sort((a, b) => a.timeIndex - b.timeIndex)
              .slice(0, 3)
              .map((evt, idx) => (
                <div className="flex items-center">
                  <div
                    className={`bg-${evt.label}-500  w-3 h-3 mr-1 ml-1 rounded-full  cursor-pointer`}
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
                      overflow: "hidden",
                      textOverflow: "ellipsis",
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
          <div
            className="text-sm ml-1 font-semibold "
            onClick={(e) => {
              e.stopPropagation();
              setDaySelected(day);
              setShowMore(true);
            }}
          >
            {events.filter((el) => {
              return (
                labelList[el.label] &&
                Object.keys(labelList).includes(el.label)
              );
            }).length > 3 &&
              events.filter((el) => {
                return (
                  labelList[el.label] &&
                  Object.keys(labelList).includes(el.label)
                );
              }).length -
                3 +
                " more"}
          </div>
        </div>
      </div>
    </>
  );
}
