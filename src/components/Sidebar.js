import React from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";

export default function Sidebar() {
  return (
    <aside style={{ minHeight: "100vh" }} className=" p-5 pb-0 w-64 flex-col">
      <div className="flex ">
        <CreateEventButton />
      </div>
      <SmallCalendar />
      <div className="flex-1">
        <Labels />
      </div>
    </aside>
  );
}
