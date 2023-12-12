// DashboardComponent.jsx

import React from "react";

export const Daily = () => {
  return (
    <div className="bg-blue-500 p-6 text-white  text-center">
      {/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1> */}

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded">
          <h2 className="text-l font-semibold mb-3">Daily Login</h2>
          <p className="text-3xl ">30</p>
        </div>

        <div className=" p-4 rounded">
          <h2 className="text-l font-semibold mb-3">Recommended Activities</h2>
          <p className="text-3xl ">20</p>
        </div>

        <div className=" p-4 rounded">
          <h2 className="text-l font-semibold mb-3">Other Activities</h2>
          <p className="text-3xl ">4</p>
        </div>
      </div>
    </div>
  );
};
