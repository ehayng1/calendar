import GlobalContext from "../context/GlobalContext";
import React, { useState, useContext, useEffect } from "react";
export function Modees() {
  const { isDayMode, setIsDayMode, dayModeEvents } = useContext(GlobalContext);

  function getDaymodeClass() {
    let dayModeClass =
      "px-4 py-2 text-sm font-medium  bg-white rounded-s-lg flex-1 rounded-full";
    if (isDayMode) {
      return dayModeClass + " " + "bg-blue-600" + " " + "text-white";
    } else {
      return dayModeClass;
    }
  }
  function getMonthModeClass() {
    let dayModeClass =
      "px-4 py-2 text-sm font-medium  bg-white rounded-s-lg  flex-1 rounded-full ";
    if (!isDayMode) {
      return dayModeClass + " " + "bg-blue-600" + " " + "text-white";
    } else {
      return dayModeClass;
    }
  }
  return (
    <div
      class="flex rounded-md shadow-sm mt-5 bg-white rounded-full"
      role="group"
    >
      <button
        onClick={() => {
          setIsDayMode(true);
        }}
        type="button"
        // class="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-s-lg hover:bg-gray-100 hover:text-blue-700 flex-1 rounded-full"
        className={` ${getDaymodeClass()}`}
      >
        Day
      </button>
      <button
        onClick={() => {
          setIsDayMode(false);
        }}
        type="button"
        // class="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-600 focus:text-white focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white flex-1 rounded-full"
        className={` ${getMonthModeClass()}`}
      >
        Month
      </button>
    </div>
  );
}
