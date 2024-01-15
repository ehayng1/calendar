import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import SurveyButton from "./SurveyButton";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { height } from "@mui/system";
import { getUserId } from "../utils/firebase";

export default function Labels() {
  const {
    labels,
    updateLabel,
    refresh,
    setLabelList,
    labelList,
    updateLabelList,
  } = useContext(GlobalContext);
  const [serverLabels, setServerLabels] = useState([]);
  const [labelNames, setLabelNames] = useState({});
  const [editMode, setEditMode] = useState(false);
  const labelsClasses = ["indigo", "grey", "green", "blue", "red", "purple"];
  let userId;

  useEffect(() => {
    const getLabels = async () => {
      userId = await getUserId();
      const docRef = doc(db, "label", userId);
      // const docRef = doc(db, "label", "EyepSY8B48R8cqeWozZs(USER1)");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let data = docSnap.data();
        let keys = Object.keys(data);
        let filtered = keys.filter(
          (el) => labelsClasses.includes(el) && data[el] > 0
        );
        console.log(filtered);
        setServerLabels(filtered);
      } else {
        console.log("No such document!");
      }
    };
    getLabels();
  }, [refresh]);

  // console.log("labelNames: ", labelNames);
  // console.log("label list: ", labelList);

  useEffect(() => {
    const getLabelNames = async () => {
      userId = await getUserId();
      const docRef = doc(db, "labelNames", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let data = docSnap.data();
        setLabelNames(data);

        // setServerLabels(filtered);
      } else {
        console.log("No such document!");
      }
    };
    getLabelNames();
  }, [refresh]);

  function handleEdit() {
    /// write here!
    setEditMode(!editMode);
  }

  async function handleSave() {
    /// write firebase code here!
    setEditMode(!editMode);
    // const docRef = doc(db, "labelNames", userId);
    // await setDoc(docRef, labelNames);
    console.log("Saving the label names...");
    userId = await getUserId();
    await setDoc(doc(db, "labelNames", userId), labelNames);
  }

  return (
    <React.Fragment>
      <div className=" mt-10 mb-5">
        <div className="flex flex-col justify-start content-start flex-nowrap">
          <div className="flex items-center">
            <p className="text-gray-500 font-bold flex-1">Label</p>
            <div
              onClick={editMode ? handleSave : handleEdit}
              className=" bg-blue-600 text-white p-1 px-3 rounded cursor-pointer"
            >
              {editMode ? "Save" : "Edit"}
            </div>
          </div>
          {/* <div> */}
          {serverLabels.map((el, idx) => (
            <>
              <label key={idx} className="items-center mt-3 block">
                <input
                  type="checkbox"
                  checked={labelList[el]}
                  onChange={() => {
                    let labels = { ...labelList };
                    labels[el] = !labels[el];
                    setLabelList(labels);
                    console.log(labels);
                  }}
                  className={`form-checkbox h-5 w-5 text-${
                    el == "grey" ? "gray" : el
                  }-400 rounded focus:ring-0 cursor-pointer`}
                  style={{
                    backgroundColor: labelList[el] ? el : "",
                    opacity: "0.6",
                  }}
                />
                <span className="ml-2 text-gray-700 capitalize">
                  {editMode ? (
                    <input
                      style={{
                        width: "9vw",
                        maxHeight: "3.4vh",
                        border: "none",
                      }}
                      type="text"
                      id="fname"
                      name="fname"
                      onChange={(e) => {
                        // console.log(e.target.value);
                        setLabelNames({ ...labelNames, [el]: e.target.value });
                        // setLabelNames(labelNames[el])
                        // setstate....
                      }}
                      placeholder={labelNames[el]}
                    ></input>
                  ) : (
                    labelNames[el]
                  )}
                </span>
              </label>
            </>
          ))}
          <div
            style={{
              position: "absolute",
              bottom: "0vh",
              left: "13vw",
            }}
          >
            {/* <SurveyButton></SurveyButton> */}
          </div>
          {/* </div> */}
        </div>
        {/* <div className="flex flex-col"></div> */}
      </div>
    </React.Fragment>
  );
}
