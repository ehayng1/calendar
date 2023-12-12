import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  updateDoc,
  getDocs,
  where,
  increment,
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
export async function incrementNumberofEvents(type, date) {
  const docRef = doc(db, "numberofEventbyDate", type);
  await setDoc(docRef, { [date]: increment(1) }, { merge: true });

  const totalRef = doc(db, "numberofEventbyDate", "Total");
  // await updateDoc(totalRef, {
  //   [date]: increment(1),
  // });
  await setDoc(totalRef, { [date]: increment(1) }, { merge: true });
}

// takes grade, sex and type as input  then increments the counter.
// sex takes Female or Male
// grade takes Gr9, Gr10 or Gr11
// type takes Other or Rec
export async function incrementCounters(grade, sex, type) {
  const docRef = doc(db, "stats", "Jf8GaQwvyXMWk0Zn8dcR");
  let fullSex = sex === "M" ? "Male" : "Female";
  let gradeField = "Gr" + grade + type;
  let sexField = type + fullSex;
  await updateDoc(docRef, {
    [gradeField]: increment(1),
    [sexField]: increment(1),
    [type]: increment(1),
  });
}
