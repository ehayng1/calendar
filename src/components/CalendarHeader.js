import dayjs from "dayjs";
import React, { useContext } from "react";
import logo from "../assets/logo.png";
import GlobalContext from "../context/GlobalContext";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@emotion/react";
import Divider from "@mui/material/Divider";
import { useNavigate, Outlet } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { generateRecEvents } from "../utils/firebase";

const ProfileMenu = styled(Paper)(() => ({
  square: false,
  width: "10vw",
  borderRadius: "1rem",
}));

export default function CalendarHeader({ isAdmin, isLoggedIn }) {
  const {
    monthIndex,
    setMonthIndex,
    refresh,
    setRefresh,
    setShowDashBoard,
    setShowEventModal,
    isDayMode,

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
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // handleMobileMenuClose();
  };

  const logOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Sign Out successful");
        window.location.reload();
      })
      .catch((error) => {
        console.log("Sign Out failed");
        console.log(error);
      });
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <ProfileMenu elevation={0}>
      <Menu
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            width: "10vw",
            borderRadius: "1rem",
            minWidth: "150px",
          },
        }}
        // anchorOrigin={{
        //   vertical: "top",
        //   horizontal: "right",
        // }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem
          style={{ marginBottom: "0.5rem" }}
          onClick={() => {
            navigate("/");
            setShowDashBoard(false);

            handleMenuClose();
          }}
        >
          Calendar
        </MenuItem>
        {isAdmin && (
          <MenuItem
            style={{ marginBottom: "0.5rem" }}
            onClick={() => {
              // navigate("/dashboard");
              handleMenuClose();
              setShowDashBoard(true);
            }}
          >
            Dashboard
          </MenuItem>
        )}
        <Divider></Divider>
        {isLoggedIn ? (
          <MenuItem
            style={{ marginBottom: "0.5rem" }}
            onClick={() => {
              logOut();
              handleMenuClose();
              navigate("/signin");
            }}
          >
            Log Out
          </MenuItem>
        ) : (
          <MenuItem
            style={{ marginBottom: "0.5rem" }}
            onClick={() => {
              handleMenuClose();
              navigate("/signin");
            }}
          >
            Log In
          </MenuItem>
        )}

        {/* // test tab */}
        {/* <MenuItem
          style={{ marginBottom: "0.5rem" }}
          onClick={() => {
            navigate("/Test");
            handleMenuClose();
          }}
        >
          Test
        </MenuItem> */}
      </Menu>
    </ProfileMenu>
  );
  return (
    <header className="pl-4 py-2 flex items-center border-b border-gray-100 py-1 ">
      <img src={logo} alt="calendar" className="mr-12 w-12 h-12 ml-8" />
      {/* <h1 className="mr-10 text-xl text-gray-500 fond-bold">Calendar</h1> */}
      {/* <button
        onClick={handleReset}
        className="border rounded py-2 px-4 mr-5 ml-12"
      >
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={handleNextMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>

      <h2 className="ml-4 text-xl text-gray-500 font-bold flex-1">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2> */}
      <div className="flex-1"></div>

      <Box sx={{ display: { xs: "none", md: "flex" }, marginRight: "-6rem" }}>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
          sx={{ color: "grey", width: "3rem", height: "3rem" }}
        >
          <AccountCircle fontSize="7rem" />
        </IconButton>
      </Box>
      {renderMenu}
    </header>
  );
}
