import dayjs from "dayjs";
import React, { useContext } from "react";
import logo from "../assets/logo.png";
import GlobalContext from "../context/GlobalContext";
import { styled, alpha } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const ProfileMenu = styled(Paper)(() => ({
  square: false,
  width: "10vw",
  borderRadius: "1rem",
}));

export default function LittleHeader({ isAdmin, isLoggedIn }) {
  const {
    monthIndex,
    setMonthIndex,

    setDaySelected,
  } = useContext(GlobalContext);
  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }
  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
    setDaySelected(dayjs());
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <header className="pl-4 py-4 flex items-center border-b border-gray-300 content-center ">
      <button onClick={handlePrevMonth}>
        {/* <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2 p-1 rounded-lg text-5xl"> */}
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2 p-1 px-2 rounded-lg bg-white text-2xl">
          chevron_left
        </span>
      </button>

      <button onClick={handleNextMonth}>
        {/* <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2 p-1 rounded-lg text-5xl"> */}
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2 p-1 px-2 rounded-lg bg-white text-2xl">
          chevron_right
        </span>
      </button>
      <h3 className=" text-xl text-gray-800 font-semibold ml-2">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h3>
      <button
        onClick={handleReset}
        className="border rounded py-2 px-4 mr-5 ml-12 bg-white rounded-lg"
      >
        Today
      </button>
    </header>
  );
}
