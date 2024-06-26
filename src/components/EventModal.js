import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import MuiSelect from "./Select";
import {
  getSexAndGrade,
  incrementNumberofEvents,
  incrementCounters,
} from "../utils/firebase";

const labelsClasses = ["indigo", "grey", "green", "blue", "red", "purple"];

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    selectedEvent,
    timeSelectedFormatted,
    setRefresh,
    refresh,
    userId,
    setShowSurveyModal,
    setDayModeEvents,
    dayModeEvents,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl === selectedEvent.label)
      : labelsClasses[0]
  );
  const [id, setId] = useState(selectedEvent ? selectedEvent.id : "");
  const [startTime, setStartTime] = useState(timeSelectedFormatted);
  const [endTime, setEndTime] = useState();

  async function setTime() {
    const docRef = doc(db, "events", userId);
    const docSnap = await getDoc(docRef);
    let data = docSnap.data()[id];
    setStartTime(data.startTime);
    setEndTime(data.endTime);
  }

  useEffect(() => {
    console.log(selectedEvent);
    if (selectedEvent) {
      // setTime();
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!startTime) {
      alert("Please enter start time.");
    } else if (!endTime) {
      alert("Please enter end time.");
    } else if (!title) {
      alert("Please enter title.");
    } else if (!description) {
      alert("Please enter description.");
    } else {
      const dateString = daySelected.format("ddd MMM YYYY");

      const calendarEvent = {
        title,
        description,
        label: selectedLabel,
        day: daySelected.valueOf(),
        // id: selectedEvent ? selectedEvent.id : Date.now(),
        id: new Date().getTime(),
      };
      const now = new Date();
      const docRef = doc(db, "events", dateString);
      let timeIndex = 0;
      console.log(startTime);
      if (startTime.slice(-2) === "pm") {
        timeIndex = timeIndex + 12;
      }
      let hour = parseInt(startTime.slice(0, 2));
      if (hour != "12") {
        timeIndex = timeIndex + hour;
      }
      if (startTime.split(":")[1].slice(0, 1) == "3") {
        timeIndex = timeIndex + 0.5;
      }
      setShowEventModal(false);
      // if user is updating an existing event -> updateDoc

      if (selectedEvent) {
        const docRef = doc(db, "events", userId);
        const docSnap = await getDoc(docRef);
        let data = docSnap.data()[id];
        data.title = calendarEvent.title;
        data.description = calendarEvent.description;
        data.label = selectedLabel == "gray" ? "grey" : selectedLabel;
        data.startTime = startTime;
        data.endTime = endTime;
        await updateDoc(docRef, {
          [id]: data,
        });
      }
      // user adding a new event
      else {
        let eventData = {
          title: calendarEvent.title,
          description: calendarEvent.description,
          label: selectedLabel == "gray" ? "grey" : selectedLabel,
          startTime: startTime,
          endTime: endTime,
          hour: startTime,
          month: daySelected.month() + 1,
          year: daySelected.year(),
          day: daySelected.date(),
          date: daySelected.format("DD MMM YYYY"),
          id: now.getTime(),
          timeIndex: timeIndex,
        };
        await updateDoc(doc(db, "events", userId), {
          [now.getTime()]: eventData,
        });
        console.log("New daymode events", [...dayModeEvents, eventData]);
        setDayModeEvents([...dayModeEvents, eventData]);
        console.log("incrementing counters");
        let data = await getSexAndGrade(userId);
        let sex, grade;
        sex = data.sex;
        grade = data.grade;

        await incrementCounters(grade, sex, "Other", 1);
        console.log("incrementing number of events");
        await incrementNumberofEvents(
          "Other",
          daySelected.format("DD MMM YYYY"),
          1
        );
      }

      // Update Labels
      const labelRef = doc(db, "label", userId);
      await updateDoc(labelRef, {
        [selectedLabel == "gray" ? "grey" : selectedLabel]: increment(1),
      });
      setRefresh(!refresh);
    }
  }

  async function handleDelete() {
    const docRef = doc(db, "events", userId);
    await updateDoc(docRef, {
      [id]: deleteField(),
    });
    // Remove Labels
    const labelRef = doc(db, "label", userId);
    console.log(selectedLabel);
    await updateDoc(labelRef, {
      [selectedLabel == "gray" ? "grey" : selectedLabel]: increment(-1),
    });
    setShowEventModal(false);
    setRefresh(!refresh);
  }
  const handleStartChange = (newTime) => {
    setStartTime(newTime);
  };
  const handleEndChange = (newTime) => {
    setEndTime(newTime);
  };
  return (
    <div
      className="h-screen w-full fixed left-0 top-0 flex justify-center items-center"
      style={{
        zIndex: 1000,
      }}
    >
      {/* <form className="bg-white rounded-lg shadow-2xl w-1/2"> */}
      <form className="bg-white rounded-lg shadow-2xl ">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <span
                // onClick={() => {
                //   dispatchCalEvent({
                //     type: "delete",
                //     payload: selectedEvent,
                //   });
                //   setShowEventModal(false);
                // }}
                onClick={() => handleDelete()}
                className="material-icons-outlined text-gray-400 cursor-pointer"
              >
                delete
              </span>
            )}
            <button onClick={() => setShowEventModal(false)}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3 flex">
          <div className="flex-1 grid grid-cols-1/4 items-end gap-y-7">
            <div className="flex gap-x-2 items-center ">
              <div className="w-12"></div>

              <input
                type="text"
                name="title"
                placeholder="Add title"
                value={title}
                required
                className="flex-1 pt-3 border-0 text-gray-600 text-lg  pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <span className="flex gap-x-2 items-center ">
              <div className="material-icons-outlined text-gray-400 w-12">
                schedule
              </div>
              <div className="mr-10" style={{ marginRight: "1.5rem" }}>
                {daySelected.format("dddd, MMMM DD")}
              </div>
              <MuiSelect
                label="start"
                start={startTime}
                end={endTime}
                handleStartChange={handleStartChange}
                handleEndChange={handleEndChange}
              ></MuiSelect>
              <MuiSelect
                // start={timeSelected}
                label="end"
                start={startTime}
                end={endTime}
                handleStartChange={handleStartChange}
                handleEndChange={handleEndChange}
              ></MuiSelect>
            </span>
            {/* <div>asd</div> */}
            <div className="flex gap-x-2 items-center">
              <div className="material-icons-outlined text-gray-400 w-12">
                segment
              </div>
              <textarea
                placeholder="Add a description"
                id="description"
                name="description"
                value={description}
                required
                rows="1"
                cols="50"
                className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500 "
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {/* <input
                type="text"
                name="description"
                placeholder="Add a description"
                value={description}
                required
                className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500 h-10"
                onChange={(e) => setDescription(e.target.value)}
              /> */}
              {/* <TextField
                className="w-full"
                id="outlined-multiline-static"
                placeholder="Add description"
                multiline
                rows={4}
              /> */}
            </div>
            <div className="flex gap-x-2 items-center">
              <span className="material-icons-outlined text-gray-400 w-12">
                bookmark_border
              </span>
              <div className="flex gap-x-2">
                {labelsClasses.map((lblClass, i) => (
                  <span
                    style={{
                      backgroundColor: lblClass,
                      opacity: "0.6",
                    }}
                    key={i}
                    onClick={() => setSelectedLabel(lblClass)}
                    className={`bg-${
                      lblClass == "grey" ? "gray" : lblClass
                    }-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                  >
                    {selectedLabel === lblClass && (
                      <span className="material-icons-outlined text-white text-sm">
                        check
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <footer className="flex border-t p-3 mt-5">
          {/* <a
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 mr-2 rounded text-white "
            href="https://docs.google.com/forms/d/e/1FAIpQLSe7XloCD6gm4N1EeIColoyNwOXzxS1rQ22M1CX1OpX8u8Ql9Q/formResponse?pli=1"
            target="_blank"
          >
            Pre Survey
          </a>

          <a
            href="https://docs.google.com/forms/u/0/d/e/1FAIpQLScOxbF_Nps-GR6oQDdIJ71YYl10uB8Qh8kxVeSiZe1EqQzixg/formResponse"
            target="_blank"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 mr-2 rounded text-white "
          >
            Post Survey
          </a> */}
          {/* {console.log(selectedEvent)} */}
          {selectedEvent && selectedEvent.recommended && (
            <button
              onClick={() => {
                setShowEventModal(false);
                setShowSurveyModal(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
            >
              Survey
            </button>
          )}
          {/* <button
            onClick={() => {
              setShowEventModal(false);
              setShowSurveyModal(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
          >
            알림
          </button> */}
          <div className="flex-1"></div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
