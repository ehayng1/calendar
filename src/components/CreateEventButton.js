import React, { useContext } from "react";
import plusImg from "../assets/plus.svg";
import GlobalContext from "../context/GlobalContext";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

import AddCircleIcon from "@mui/icons-material/AddCircle";
export default function CreateEventButton() {
  const { setShowEventModal } = useContext(GlobalContext);
  return (
    // <BsChatLeftTextFill
    //   size={41}
    //   className="fixed bottom-3 right-14 text-blue-500 "
    // />
    <Box
      onClick={() => setShowEventModal(true)}
      sx={{
        "& > :not(style)": { m: 1 },
        position: "fixed",
        bottom: "5vh",
        right: "5vw",
        color: "#2463eb",
      }}
    >
      <Fab aria-label="add" sx={{ backgroundColor: "#2463eb", color: "white" }}>
        <AddIcon />
      </Fab>
    </Box>

    // <button
    //   onClick={() => setShowEventModal(true)}
    //   className="border mr-3 p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
    // >
    //   <img src={plusImg} alt="create_event" className="w-7 h-7" />
    //   <span className="pl-3 pr-7"> Create</span>
    // </button>
  );
}
