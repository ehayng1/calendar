import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import More from "./More";
import { getUserId } from "../utils/firebase";
import { Daymode } from "./Daymode";
import QuizIcon from "@mui/icons-material/Quiz";

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
    userId,
    setIsDayMode,
    isDayMode,
    setDayModeEvents,
    closetEvent,
    setClosetEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) => dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  //getEvents
  useEffect(() => {
    // console.log("getting events...");
    const getEvents = async () => {
      // const docRef = doc(db, "events", "EyepSY8B48R8cqeWozZs(USER1)");
      const tempId = await getUserId();
      const docRef = doc(db, "events", tempId);
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

        const sorted = filtered.sort((a, b) => a.timeIndex - b.timeIndex);

        // function that gets the closet date for event
        let date = new Date();
        let currentTimeIndex = date.getHours() + date.getMinutes() / 60;
        let closest = { day: 31, timeIndex: 24 };
        for (const el of sorted) {
          if (
            el.month == date.getMonth() + 1 &&
            el.day >= date.getDate() &&
            el.timeIndex > currentTimeIndex &&
            el.day <= closest.day &&
            el.timeIndex < closest.timeIndex
          ) {
            closest = el;
            console.log("Closest: ", el);
          }
        }

        // updates the closest event
        if (
          closest.day <= closetEvent.day &&
          closest.timeIndex < closetEvent.timeIndex
        ) {
          console.log("Updating closest Event");
          setClosetEvent(closest);
        }

        const arr = filtered.filter((el) => {
          return (
            labelList[el.label] && Object.keys(labelList).includes(el.label)
          );
        });
        setActiveEvents(arr.length);

        // Array of events
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
        <header className="flex flex-col items-center ">
          {rowIdx === 0 && (
            <p className="text-sm mt-1 font-semibold">
              {day.format("ddd").toUpperCase()}
            </p>
          )}
          <div className="flex items-center">
            <p
              className={`text-sm p-1 mt-1 my text-center cursor-pointer  ${getCurrentDayClass()}`}
              onClick={(e) => {
                e.stopPropagation();
                setDayModeEvents(events);
                setDaySelected(day);
                setIsDayMode(true);
              }}
            >
              {day.format("DD")}
            </p>
            {day.format("DD") == "14" && (
              <a
                onClick={(e) => e.stopPropagation()}
                href="https://docs.google.com/forms/u/0/d/e/1FAIpQLScOxbF_Nps-GR6oQDdIJ71YYl10uB8Qh8kxVeSiZe1EqQzixg/formResponse"
                target="_blank"
              >
                <QuizIcon
                  // onClick={handleProfileMenuOpen}
                  sx={{ color: "#FF3333" }}
                ></QuizIcon>
              </a>
            )}
          </div>
        </header>
        <div className="flex-1 cursor-pointer">
          <div
            onClick={() => {
              console.log(day);
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
                    className={`bg-${
                      evt.label == "grey" ? "gray" : evt.label
                    }-400  w-3 h-3 mr-1 ml-1 rounded-full  cursor-pointer`}
                    style={
                      {
                        // backgroundColor: evt.label,
                        // opacity: "0.6",
                      }
                    }
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
                labelList[el.label] && Object.keys(labelList).includes(el.label)
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
