import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// FIREBASE IMPORTS
import {
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import {
  doc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import * as React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import { db } from "../firebase";
import { generateRecEvents, getUserId } from "../utils/firebase";

// import { getUserId } from "../utils/Firebase";

const auth = getAuth();

const theme = createTheme();

export function SignUp() {
  const { userId } = useContext(GlobalContext);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    sex: "",
    email: "",
    password: "",
    confirmPassword: "",
    stressedPeriod: "",
  });
  const baseFreeTime = {
    music: false,
    sleep: false,
    talk: false,
    read: false,
    other: "",
  };
  const baseHobby = {
    sports: false,
    sleep: false,
    music: false,
    other: "",
  };
  const [freeTime, setFreeTime] = useState({
    music: false,
    sleep: false,
    talk: false,
    read: false,
    other: "",
  });
  const [hobbies, setHobbies] = useState({
    sports: false,
    sleep: false,
    music: false,
    other: "",
  });
  const [act1, setAct1] = useState("");
  const [act2, setAct2] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [numOfAct, setNumOfAct] = useState(0);
  // const [isOther, setIsOther] = useState(freeTime.other != "");
  const navigate = useNavigate();

  // function generateActivities() {
  //   const now = new Date();
  //   const dayjsDate = dayjs(now);

  //   let timeIndex = 0;
  //   if (startTime.slice(-2) === "pm") {
  //     timeIndex = timeIndex + 12;
  //   }
  //   let hour = parseInt(startTime.slice(0, 2));
  //   if (hour != "12") {
  //     timeIndex = timeIndex + hour;
  //   }
  //   if (startTime.split(":")[1].slice(0, 1) == "3") {
  //     timeIndex = timeIndex + 0.5;
  //   }

  //   let eventData = {
  //     // title: Meditation or music,
  //     // description: Recommend activity: Meditation or music,
  //     label: red,
  //     startTime: "10:00pm",
  //     endTime: "10:30pm",
  //     hour: "10:00pm",
  //     month: dayjsDate.month() + 1,
  //     year: dayjsDate.year(),
  //     day: dayjsDate.date(),
  //     date: dayjsDate.format("DD MMM YYYY"),
  //     id: now.getTime(),
  //     timeIndex: timeIndex,
  //   };
  // }

  async function addRecActivites(data) {
    await updateDoc(doc(db, "events", userId), {
      [new Date().getTime()]: data,
    });
  }

  function filterObject(obj) {
    const filtered = {};
    for (const key in obj) {
      if (obj[key] === true) {
        filtered[key] = obj[key];
      }
    }
    return filtered;
  }

  const signUpUser = () => {
    let isOther = freeTime.other != "";
    let numOther = isOther ? 1 : 0;
    let total = numOfAct + numOther;
    console.log(total);
    if (total != 4) {
      alert("Please select 2.");
      return;
    }
    if (values.stressedPeriod == "") {
      alert("Please answer all the surveys.");
      return;
    }
    if (values.email == "") {
      //  setEmailError("Please enter an email.");
      //  alert(emailError);
      alert("Please enter an email.");
      return;
    } else if (values.name == "") {
      //  setNameError("Please enter your name.");
      //  alert(nameError);
      alert("Please enter your name.");
      return;
    } else if (values.password == "") {
      //  setPasswordError("Please enter a password.");
      //  alert(passwordError);
      alert("Please enter a password.");
      return;
    } else if (values.confirmPassword == "") {
      //  setConfirmPasswordError("Please confirm your password.");
      //  alert(confirmPasswordError);
      alert("Please confirm your password.");
      return;
    } else if (values.password != values.confirmPassword) {
      //  setConfirmPasswordError("Password does not match.");
      //  alert(confirmPasswordError);
      alert("Password does not match.");
      return;
    }

    createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    )
      .then(async (userCredential) => {
        setIsLoading(true);
        console.log("The user account is created.");
        const id = await getUserId();
        const uniqueId = id;
        console.log("ID: ", uniqueId);
        await setDoc(doc(db, "users", uniqueId), {
          email: values.email,
          grade: values.grade,
          sex: values.sex,
          ...freeTime,
          ...hobbies,
        });

        // updates the stressPeriod statistics
        const docRef = doc(db, "stats", "Jf8GaQwvyXMWk0Zn8dcR");
        if (values.stressedPeriod == "Morning") {
          await updateDoc(docRef, {
            morning: increment(1),
          });
        } else {
          await updateDoc(docRef, {
            evening: increment(1),
          });
        }

        await setDoc(doc(db, "events", uniqueId), {});

        let isOther = freeTime.other != "";
        let numOther = isOther ? 1 : 0;
        let total = numOfAct + numOther;
        console.log(total);

        // if 4개 전부 선택
        // 4개만 고르기
        const filteredFreeTime = filterObject(freeTime);
        if (total == 4) {
          await generateRecEvents(freeTime.other, filteredFreeTime);
        }
        // less than 4개 선택
        // 그대로 액티비티 가기
        // console.log(numOfAct);
        else {
          await generateRecEvents(freeTime.other, filteredFreeTime);
        }

        // await generateRecEvents(act1, act2, act3, act4);
        await setDoc(doc(db, "label", uniqueId), {
          blue: 0,
          grey: 0,
          green: 0,
          // 27 bc of the generateRecEvents
          indigo: 27,
          purple: 0,
          red: 0,
        });
        await setDoc(doc(db, "labelNames", uniqueId), {
          // default color names are just the color itself
          blue: "blue",
          grey: "grey",
          green: "green",
          indigo: "indigo",
          purple: "purple",
          red: "red",
        });
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/email-already-in-use") {
          alert("Email is already used.");
        } else if (errorCode == "auth/invalid-email") {
          alert("Email format is not correct.");
        } else if (errorCode == "auth/invalid-email") {
          alert("Email format is not correct.");
        } else if (errorCode == "auth/weak-password") {
          alert("Password is too weak.");
        }
        // setLoading(false);
      });
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });
  // console.log(e.target);
  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      // values.firstName !== "admin" &&
      //   setValues({ ...values, isAdmin: true });
      await signUpUser(values);
      // alert("Registration successful. Please login.");
    } catch (error) {
      setError(error.message);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "0 auto",
      }}
    >
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSignUp}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                value={values.firstName}
                onChange={handleChange}
                required
                fullWidth
                id="firstName"
                label="Full Name"
                name="firstName"
                autoComplete=""
                autoFocus
              />
              <FormControl sx={{ mt: 2 }} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Grade
                </InputLabel>
                <Select
                  sx={{ textAlign: "left" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-label"
                  value={values.grade}
                  label="Grade"
                  name="grade"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Grade 9</MenuItem>
                  <MenuItem value={10}>Grade 10</MenuItem>
                  <MenuItem value={11}>Grade 11</MenuItem>
                  <MenuItem value={12}>Grade 12</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ mt: 2 }} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Gender
                </InputLabel>
                <Select
                  sx={{ textAlign: "left" }}
                  labelId="demo-simple-select-label"
                  id="Sex"
                  value={values.sex}
                  label="Sex"
                  name="sex"
                  onChange={handleChange}
                >
                  <MenuItem value={"M"}>Male</MenuItem>
                  <MenuItem value={"F"}>Female</MenuItem>
                </Select>
              </FormControl>
              {/* <FormControl sx={{ mt: 2 }} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Free Time
                </InputLabel>
                <Select
                  sx={{ textAlign: "left" }}
                  labelId="demo-simple-select-label"
                  id="Sex"
                  value={values.sex}
                  label="Sex"
                  name="sex"
                  onChange={handleChange}
                >
                  <MenuItem value={"M"}>Listening to Music</MenuItem>
                  <MenuItem value={"F"}>Sleep</MenuItem>
                  <MenuItem value={"F"}>Talking with your friends</MenuItem>
                  <MenuItem value={"F"}>Reading a book</MenuItem>
                </Select>
              </FormControl> */}

              {/* <FormControl sx={{ mt: 2 }} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Gender
                </InputLabel>
                <Select
                  sx={{ textAlign: "left" }}
                  labelId="demo-simple-select-label"
                  id="Sex"
                  value={values.sex}
                  label="Sex"
                  name="sex"
                  onChange={handleChange}
                >
                  <MenuItem value={"M"}>Male</MenuItem>
                  <MenuItem value={"F"}>Female</MenuItem>
                </Select>
              </FormControl> */}
              <TextField
                value={values.email}
                onChange={handleChange}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                value={values.password}
                onChange={handleChange}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <TextField
                value={values.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="confirmPassword"
              />
              <Box sx={{ mt: 3 }}>
                <h1>
                  What do you enjoy during your free time? (Please
                  select 2)
                </h1>
              </Box>
              <FormGroup sx={{ mt: 0 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={freeTime.music}
                      onChange={() => {
                        if (!freeTime.music) {
                          setNumOfAct(numOfAct + 1);
                        } else {
                          setNumOfAct(numOfAct - 1);
                        }
                        setAct1("Listening to Music");
                        setFreeTime({
                          ...freeTime,
                          music: !freeTime.music, // update music
                        });
                      }}
                    />
                  }
                  label="Listening to Music"
                />
                <FormControlLabel
                  // required
                  control={
                    <Checkbox
                      checked={freeTime.sleep}
                      onChange={() => {
                        if (!freeTime.sleep) {
                          setNumOfAct(numOfAct + 1);
                        } else {
                          setNumOfAct(numOfAct - 1);
                        }
                        setAct1("Sleep");
                        setFreeTime({
                          ...freeTime,
                          // ...baseFreeTime,
                          sleep: !freeTime.sleep,
                        });
                      }}
                    />
                  }
                  label="Sleep"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={freeTime.talk}
                      onChange={() => {
                        if (!freeTime.talk) {
                          setNumOfAct(numOfAct + 1);
                        } else {
                          setNumOfAct(numOfAct - 1);
                        }
                        setAct1("Talking with your friends");
                        setFreeTime({
                          ...freeTime,
                          // ...baseFreeTime,
                          talk: !freeTime.talk,
                        });
                      }}
                    />
                  }
                  label="Talking with your friends"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={freeTime.read}
                      onChange={() => {
                        if (!freeTime.read) {
                          setNumOfAct(numOfAct + 1);
                        } else {
                          setNumOfAct(numOfAct - 1);
                        }
                        setAct1("Reading a book");
                        setFreeTime({
                          ...freeTime,
                          // ...baseFreeTime,
                          read: !freeTime.read,
                        });
                      }}
                    />
                  }
                  label="Reading a book"
                />
                <Box
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={freeTime.other != ""}
                        onChange={() => {
                          setAct1("Reading a book");
                          setFreeTime({
                            ...freeTime,
                            // ...baseFreeTime,
                            other: "",
                          });
                        }}
                      />
                    }
                    label="Other"
                  />
                  <TextField
                    value={freeTime.other}
                    onChange={(e) => {
                      setAct1(e.target.value);
                      setFreeTime({
                        ...freeTime,
                        // ...baseFreeTime,
                        other: e.target.value,
                      });
                    }}
                    id="standard-basic"
                    label=""
                    variant="standard"
                  />
                </Box>
              </FormGroup>
              {/* 
              <Box sx={{ mt: 3 }}>
                <h1>Hobbies especially for stress relief?</h1>
              </Box>
              <FormGroup sx={{ mt: 0 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hobbies.sports}
                      onChange={() => {
                        setAct2("Sports/Exercise");
                        setHobbies({
                          // ...hobbies,
                          ...baseHobby,
                          sports: !hobbies.sports,
                        });
                      }}
                    />
                  }
                  label="Sports/Exercise"
                />
                <FormControlLabel
                  // required
                  control={
                    <Checkbox
                      checked={hobbies.sleep}
                      onChange={() => {
                        setAct2("Sleep");
                        setHobbies({
                          // ...hobbies,
                          ...baseHobby,
                          sleep: !hobbies.sleep,
                        });
                      }}
                    />
                  }
                  label="Sleep"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hobbies.music}
                      onChange={() => {
                        setAct2("Music");
                        setHobbies({
                          // ...hobbies,
                          ...baseHobby,
                          music: !hobbies.music,
                        });
                      }}
                    />
                  }
                  label="Music"
                />
                <Box
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    // required
                    control={
                      <Checkbox
                      // checked={hobbies.sleep}
                      // onChange={() => {
                      //   setAct2("Sleep");
                      //   setHobbies({
                      //     // ...hobbies,
                      //     ...baseHobby,
                      //     sleep: !hobbies.sleep,
                      //   });
                      // }}
                      />
                    }
                    label="Other"
                  />
                  <TextField
                    value={hobbies.other}
                    onChange={(e) => {
                      setAct2(e.target.value);
                      setHobbies({
                        // ...hobbies,
                        ...baseHobby,
                        other: e.target.value,
                      });
                    }}
                    id="standard-basic"
                    label=""
                    variant="standard"
                  />
                </Box>
              </FormGroup> */}
              {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}

              <FormControl sx={{ mt: 3 }}>
                <FormLabel id="demo-radio-buttons-group-label">
                  Are you stressed towards the morning or the evening?
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="Morning"
                    control={
                      <Radio
                        checked={values.stressedPeriod === "Morning"}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            stressedPeriod: e.target.value,
                          })
                        }
                      />
                    }
                    label="Morning"
                  />
                  <FormControlLabel
                    value="Evening"
                    control={
                      <Radio
                        checked={values.stressedPeriod === "Evening"}
                        // onChange={handleChange}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            stressedPeriod: e.target.value,
                          })
                        }
                      />
                    }
                    label="Evening"
                  />
                </RadioGroup>
              </FormControl>

              <Box
                sx={{
                  mt: 4,
                  mb: 2,
                  display: "flex",
                  flexDirection: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Please take this
                </Typography>
                <Typography variant="title" color="inherit" noWrap>
                  &nbsp;
                </Typography>
                <a
                  target={"_blank"}
                  // href="https://docs.google.com/forms/d/1rtdk-kwJ_lNtxg4W-ocJtjxoncXx3mdZenIEqtwKwWY/edit"
                  href="https://docs.google.com/forms/d/e/1FAIpQLScwPKUOCbS3KBG1W1J4Qys_ZKvlVpusWszPzR_-Cc_WUG84NA/viewform?pli=1"
                  // href="https://docs.google.com/forms/d/e/1FAIpQLSdkiU18wzOpEnToITAw0-PPUaqygYuNT70Gc8Dhykn40KZRjQ/viewform?usp=send_form"
                >
                  <Typography variant="body2">
                    <Link>survey</Link>
                  </Typography>
                </a>
                <Typography variant="title" color="inherit" noWrap>
                  &nbsp;
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  for accurate recommendations.
                </Typography>
              </Box>

              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  // align="center"
                >
                  Please make sure that you sign up with the same
                  email address with that of the survey.
                </Typography>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {/* Sign up */}
                {isLoading ? "Creating your profile..." : "Sign up"}
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    {/* Forgot password? */}
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    //   href="#"
                    variant="body2"
                    onClick={() => {
                      navigate("/signin");
                    }}
                  >
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/ehayng1/">
        Calendar
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
