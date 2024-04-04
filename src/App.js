import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import { getMonth } from "./util";
import CalendarHeader from "./components/CalendarHeader";
import Sidebar from "./components/Sidebar";
import Month from "./components/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal";

import { getUserId } from "./utils/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Modernize/src/views/dashboard/Dashboard";
import { Daymode } from "./components/Daymode";
import SurveyModal from "./components/SurveyModal";
import CreateEventButton from "./components/CreateEventButton";

function Calendar() {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const {
    monthIndex,
    showEventModal,
    showDashBoard,
    setUserId,
    isDayMode,
    showSurveyModal,
    setShowSurveyModal,
  } = useContext(GlobalContext);
  // const [id, setId] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  //gets user id
  useEffect(() => {
    async function init() {
      const tempId = await getUserId();
      setUserId(tempId);

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          setLoggedIn(true);
          // navigate("/signin");
          setIsAdmin(uid === "EBvvGwb1JvaCnzxMZzAnysYXSc42");
        } else {
          setLoggedIn(false);
          // setIsAdmin(false);
        }
      });
    }
    init();
  }, []);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}
      {showSurveyModal && <SurveyModal />}
      {!showDashBoard && <CreateEventButton></CreateEventButton>}
      {/* bg-grey-400 */}
      <div className="h-screen flex flex-col">
        <CalendarHeader isAdmin={isAdmin} isLoggedIn={isLoggedIn} />
        {showDashBoard ? (
          <Dashboard />
        ) : (
          <div
            className="flex flex-1 bg-gray-200 pb-5"
            style={{ backgroundColor: "#f6f7fb" }}
          >
            <div className="" style={{ minWidth: "20vw" }}>
              <Sidebar />
            </div>
            {isDayMode ? <Daymode></Daymode> : <Month month={currenMonth} />}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          {/* sets the default route */}
          <Route path="/" element={<Calendar />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
