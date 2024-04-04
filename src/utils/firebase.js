import dayjs from "dayjs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const auth = getAuth();

export const getUserId = async function uploadBeforePromise() {
  return new Promise(function (resolve, reject) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid);
      } else {
      }
    });
  });
};

// takes uid and returns sex and grade
export async function getSexAndGrade(id) {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let data = docSnap.data();
    console.log("Document data:", docSnap.data());
    const sex = data.sex;
    const grade = data.grade;
    let sexAndGrade = { sex: sex, grade: grade };
    return sexAndGrade;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

// takes date and type as input (Other or Recommended) then increments the counter
export async function incrementNumberofEvents(type, date, value) {
  const docRef = doc(db, "numberofEventbyDate", type);
  await setDoc(docRef, { [date]: increment(value) }, { merge: true });

  const totalRef = doc(db, "numberofEventbyDate", "Total");
  // await updateDoc(totalRef, {
  //   [date]: increment(1),
  // });
  await setDoc(
    totalRef,
    { [date]: increment(value) },
    { merge: true }
  );
}

// takes grade, sex and type as input  then increments the counter.
// sex takes Female or Male
// grade takes Gr9, Gr10 or Gr11
// type takes Other or Rec
export async function incrementCounters(grade, sex, type, value) {
  const docRef = doc(db, "stats", "Jf8GaQwvyXMWk0Zn8dcR");
  let fullSex = sex === "M" ? "Male" : "Female";
  let gradeField = "Gr" + grade + type;
  let sexField = type + fullSex;
  await updateDoc(docRef, {
    [gradeField]: increment(value),
    [sexField]: increment(value),
    [type]: increment(value),
  });
}

// updates hoursofEachActivity of firebase
// if activity exists, increment the hours. If not, set a new doc.
// finish implementing this
export async function incrementActivityHours(hour, title) {
  const docRef = doc(db, "stats", "hoursofEachActivity");
  await setDoc(docRef, {
    [title]: increment(hour),
  });
}

export async function generateRecEvents(act1, act2) {
  // const activities = ["Meditation", "Listening to Music", "Reading a Book"];
  const actList = [
    "Sleep",
    "Listening to Music",
    "Reading a Book",
    "Talking with your friends",
    "Sports/Exercise",
    "Music",
  ];

  // filters act1 and act2 from the actList
  let newActList = actList.filter((e) => e !== act1 || e !== act2);
  let act3 =
    newActList[Math.floor(Math.random() * newActList.length)];

  const activities = [act1, act2, act3];
  const daysOfWeek = ["Tuesday", "Thursday", "Saturday"];
  const userId = await getUserId();

  let data = await getSexAndGrade(userId);
  let sex, grade;
  sex = data.sex;
  grade = data.grade;

  // Repeat for 3 cycles
  for (let i = 0; i < 3; i++) {
    // Repeat for 3 activities
    for (let k = 0; k < 3; k++) {
      for (let j = 0; j < 3; j++) {
        // Repeat for each activity
        const now = dayjs();
        let dayDiff = now.day() - 2;
        // const dayOfWeek = daysOfWeek[j];
        const startOfWeek = now
          .add(j * 2 + k * 7 + i * 21, "day")
          .subtract(dayDiff, "day");

        // console.log(startOfWeek.date());
        let eventData = {
          title: activities[k],
          description: "Recommended Event for today!",
          label: "indigo",
          startTime: "9:00 PM",
          endTime: "10:00 PM",
          hour: "9:00 PM",
          month: startOfWeek.month() + 1,
          year: startOfWeek.year(),
          day: startOfWeek.date(),
          date: startOfWeek.format("DD MMM YYYY"),
          id: now.valueOf(),
          timeIndex: 10,
          recommended: true,
        };
        console.log(eventData);

        await updateDoc(doc(db, "events", userId), {
          [now.valueOf()]: eventData,
        });
      }
    }
  }
  // increment counters
  await incrementCounters(grade, sex, "Rec", 27);
  // increment number of activities
  await incrementNumberofEvents(
    "Recommended",
    dayjs().format("DD MMM YYYY"),
    27
  );
}
