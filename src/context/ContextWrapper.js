import React, { useState, useEffect, useReducer, useMemo } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt) => (evt.id === payload.id ? payload : evt));
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}
function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [refresh, setRefresh] = useState(true);
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [closetEvent, setClosetEvent] = useState({ day: 31, timeIndex: 24 });

  const [doNotShowPreSurveyDate, setDoNotShowPreSurveyDate] = useState("");
  const [doNotShowPostSurveyDate, setDoNotShowPostSurveyDate] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [isDayMode, setIsDayMode] = useState(false);
  const [showDashBoard, setShowDashBoard] = useState(false);
  const [userId, setUserId] = useState("");
  const [dayModeEvents, setDayModeEvents] = useState([
    {
      month: 1,
      hour: "9:00 PM",
      description: "Recommended Event for today!",
      endTime: "10:00 PM",
      date: "18 Jan 2024",
      id: 1705628356523,
      title: "Meditation",
      day: 18,
      year: 2024,
      startTime: "9:00 PM",
      label: "indigo",
      timeIndex: 10,
    },
  ]);
  const [labelList, setLabelList] = useState({
    indigo: true,
    red: true,
    purple: true,
    green: true,
    grey: true,
    blue: true,
  });
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  function updateLabel(label) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        showDashBoard,
        setShowDashBoard,
        isDayMode,
        setIsDayMode,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
        refresh,
        setRefresh,
        showMore,
        setShowMore,
        labelList,
        setLabelList,
        userId,
        setUserId,
        dayModeEvents,
        setDayModeEvents,
        closetEvent,
        setClosetEvent,
        showSurveyModal,
        setShowSurveyModal,
        doNotShowPreSurveyDate,
        setDoNotShowPreSurveyDate,
        doNotShowPostSurveyDate,
        setDoNotShowPostSurveyDate,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
