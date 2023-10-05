import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import SurveyButton from "./SurveyButton";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

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

  const labelsClasses = [
    "indigo",
    "gray",
    "green",
    "blue",
    "red",
    "purple",
  ];

  useEffect(() => {
    const getLabels = async () => {
      const docRef = doc(db, "label", "EyepSY8B48R8cqeWozZs(USER1)");
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

  return (
    <React.Fragment>
      <div className="flex-col">
        <div className="">
          <p className="text-gray-500 font-bold mt-10">Label</p>
          {/* {labels.map(({ label: lbl, checked }, idx) => (
            <label key={idx} className="items-center mt-3 block">
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  updateLabel({ label: lbl, checked: !checked })
                }
                className={`form-checkbox h-5 w-5 text-${lbl}-400 rounded focus:ring-0 cursor-pointer`}
              />
              <span className="ml-2 text-gray-700 capitalize">
                {lbl}
              </span>
            </label>
          ))} */}
          {serverLabels.map((el, idx) => (
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
                className={`form-checkbox h-5 w-5 text-${el}-400 rounded focus:ring-0 cursor-pointer`}
              />
              <span className="ml-2 text-gray-700 capitalize">
                {el}
              </span>
            </label>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: "2vh" }}>
          <SurveyButton></SurveyButton>
        </div>
      </div>
    </React.Fragment>
  );
}
