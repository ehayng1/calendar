import React from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";
import { Modees } from "./Modes";

export default function Sidebar() {
  return (
    <aside style={{ minHeight: "100vh" }} className=" px-4 pt-0 pb-0  flex-col">
      <div className="flex ">{/* <CreateEventButton /> */}</div>
      <Modees></Modees>
      <div className="flex-1">
        <Labels />
      </div>
      <SmallCalendar />
    </aside>
  );
}
