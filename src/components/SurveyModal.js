import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

export default function SurveyModal() {
  const {
    setShowSurveyModal,
    setDoNotShowPreSurveyDate,
    setDoNotShowPostSurveyDate,
  } = useContext(GlobalContext);
  const [isBeforeSurvey, setIsBeforeSurvey] = useState(false);
  const [surveyIndicator, setSurveyIndicator] = useState("");
  const [now, setNow] = useState(new Date().toDateString());

  function isCurrentTimeBeforeSurvey() {
    const dateNow = new Date();
    const startTime = new Date(dateNow);
    startTime.setHours(22, 0, 0, 0);
    if (startTime > dateNow) {
      setIsBeforeSurvey(true);
      setSurveyIndicator("pre");
    } else {
      setIsBeforeSurvey(false);
      setSurveyIndicator("post");
    }
  }

  useEffect(() => {
    isCurrentTimeBeforeSurvey();
  }, []);

  // useEffect(() => {
  //   isCurrentTimeBeforeSurvey();
  //   const now = new Date().toDateString();
  //   isBeforeSurvey
  //     ? localStorage.setItem("pre", now)
  //     : localStorage.setItem("post", now);
  // }, [setShowSurveyModal]);

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
            <button
              onClick={() => {
                setShowSurveyModal(false);
                localStorage.setItem(surveyIndicator, now);
              }}
            >
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3 flex">
          <div className="flex-1 grid grid-cols-1/4 items-end gap-y-7 mr-10 ml-10 mb-5 mt-3">
            <div className="text-center">
              {isBeforeSurvey ? (
                <p className="mb-2 ">Activity starts after 5 minutes!</p>
              ) : (
                <p className="mb-2 ">
                  Activity have ended. Please complete the survey!
                </p>
              )}

              <p className="mb-10">Please fill out the survey.</p>
              <a
                onClick={() => {
                  setShowSurveyModal(false);
                  localStorage.setItem(surveyIndicator, now);
                }}
                href={
                  isBeforeSurvey
                    ? "https://docs.google.com/forms/d/e/1FAIpQLSe7XloCD6gm4N1EeIColoyNwOXzxS1rQ22M1CX1OpX8u8Ql9Q/viewform"
                    : "https://docs.google.com/forms/d/e/1FAIpQLScOxbF_Nps-GR6oQDdIJ71YYl10uB8Qh8kxVeSiZe1EqQzixg/viewform"
                }
                target="_blank"
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 mt-5 rounded text-white"
              >
                Take Survey
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
