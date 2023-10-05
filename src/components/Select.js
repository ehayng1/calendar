import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper"; // Import Paper component
import NativeSelect from "@mui/material/NativeSelect";
import GlobalContext from "../context/GlobalContext";
import { useContext } from "react";

// export default function MuiSelect({
//   start,
//   end,
//   label,
//   handleChange,
// }) {
//   const [time, setTime] = React.useState();
//   const handleSelectChange = (event) => {
//     console.log(event);
//     console.log(event.target);
//     alert(event.target.value);
//     setTime(event.target.value);
//     // if (label === "start") {
//     //   handleChange(event.target.value);
//     // } else {
//     //   handleChange(event.target.value);
//     // }
//   };

//   const times = [];
//   const startDate = new Date();
//   startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00
//   const endDate = new Date();
//   endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999
//   const interval = 30 * 60 * 1000; // 30 minutes in milliseconds

//   for (
//     let currentDate = startDate;
//     currentDate <= endDate;
//     currentDate.setTime(currentDate.getTime() + interval) // let newDate = new Date(currentDate)
//   ) {
//     let newDate = new Date(currentDate);
//     let formatted =
//       newDate.getHours() +
//       ":" +
//       String(newDate.getMinutes()).slice(0, 1) +
//       "0";
//     times.push(formatted);
//   }
//   return (
//     <Box sx={{ minWidth: 80 }}>
//       <FormControl variant="standard" fullWidth>
//         <InputLabel id="demo-simple-select-label">{label}</InputLabel>
//         <Select
//           style={{ height: "25px" }}
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           value={time}
//           label={label}
//           onChange={handleSelectChange}
//         >
//           <Paper sx={{}}>
//             {times.map((el, idx) => (
//               <MenuItem key={idx} value={el}>
//                 {el} {idx < 24 ? "am" : "pm"}
//               </MenuItem>
//             ))}
//           </Paper>
//         </Select>
//       </FormControl>
//     </Box>
//   );
// }

export default function MuiSelect({
  label,
  start,
  end,
  handleStartChange,
  handleEndChange,
}) {
  const [time, setTime] = React.useState("");

  const { timeSelected } = useContext(GlobalContext);

  const handleChange = (event) => {
    let value = event.target.value;
    setTime(value);
    // label === "start"
    //   ? handleStartChange(value)
    //   : handleEndChange(value);
    // const [h, m] = value.split(":");
    // const selectedTime = new Date();
    // selectedTime.setHours(h, m, 0, 0);
    // console.log(selectedTime);
    label === "start"
      ? handleStartChange(value)
      : handleEndChange(value);
  };

  const times = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00

  // if (label === "end") {
  //   startDate.setHours(startDate.getHours(), 30, 0, 0); // Set start time with timeSelected
  // } else {
  //   startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00
  // }
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999
  const interval = 30 * 60 * 1000; // 30 minutes in milliseconds

  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate.setTime(currentDate.getTime() + interval) // let newDate = new Date(currentDate)
  ) {
    let newDate = new Date(currentDate);
    let hour = newDate.getHours();
    let ampm = hour >= 12 ? "pm" : "am";
    if (hour !== 12) {
      hour = hour % 12;
    }
    let formatted =
      hour +
      ":" +
      String(newDate.getMinutes()).slice(0, 1) +
      "0" +
      //   " " +
      ampm;

    times.push(formatted);
  }
  times[0] = "12:00am";
  times[1] = "12:30am";

  return (
    <Box sx={{ minWidth: 80 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          sx={{ minWidth: "8vw" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={label === "start" ? start : end}
          label={label}
          onChange={handleChange}
          MenuProps={{
            style: {
              maxHeight: "40vh",
            },
          }}
        >
          {times.map((el, idx) => (
            <MenuItem sx={{ maxHeight: "10vh" }} key={idx} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
