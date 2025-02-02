import { createContext } from "react";

function setter() {
  console.error("A setter should have been set");
}

export const RecordsDataContext = createContext({
  gx: {},
  setGx: setter,
  comparingToGx: {},
  setComparingToGx: setter,
  finalGx: {},
  setFinalGx: setter,
  side: "",
});
