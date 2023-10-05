import React from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";

export default function Sidebar() {
  return (
    <aside className="border p-5 pb-0 w-64">
      <div className="flex">
        <CreateEventButton />
      </div>
      <SmallCalendar />
      <Labels />
    </aside>
  );
}
