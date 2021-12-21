import React, { useState } from "react";
import Display from "./Display";
import NumPadButtons from "./NumPadButtons";

export default function App() {
  // Hooks.
  const [displayStr, setDisplayStr] = useState("0"); // The display on the calculator.
  const [history, setHistory] = useState(["0"]); // The last 10 operations, and the index which depicts which of these operations to show in the historyDisplay.
  const [isAnsBool, setIsAnsBool] = useState(true); // The boolean used to determine whether a new input should reset the display (after an answer has been entered).

  // Functions and constants used by multiple components.
  function addCommas(strArg) {
    // Returns the passed number string formatted with commas.
    // Run if the passed string has no periods (decimals) or letters.
    if (typeof strArg === "string" && !strArg.match(/[.a-z]/i)) {
      const strArgIsPos = !strArg.includes("⁻");
      // Turn the string into an array and filter out any commas.
      const str = strArgIsPos ? strArg : strArg.substring(1, strArg.length - 1);
      const arr = str.split("").filter(elem => elem !== ",");
      const subArrs = [];
      for (let i = arr.length - 3; i > 0; i -= 3) {
        // Separate arr into groups of three (starting from the end), and add these arrs to subArr.
        subArrs.unshift(arr.splice(i, 3));
      }
      subArrs.unshift(arr);
      // Now, we concat all the subArrs with commas between them using the reducer function.
      function reducer(acc, curVal) {
        return acc.concat(",", curVal);
      }
      const finalNum = subArrs.reduce(reducer).join("");
      return strArgIsPos ? finalNum : "⁻" + finalNum;
    } else {
      return strArg.toString();
    }
  }
  // None of these definitions should MUTATE each other.
  const numsAndOpsArr = displayStr.split(/\s/);
  // Need to append a space after the operator to make sure that large numbers containing e+ are included in numsArr.
  const numsArr = numsAndOpsArr.filter(
    str => !str.toString().match(/[+\-*/]\s/)
  );
  // lastNum is the string since the last operation.
  const lastNumStr = numsArr[numsArr.length - 1];
  let displayWithoutLastNumStr = [...numsAndOpsArr];
  if (displayWithoutLastNumStr.length % 2 !== 0) {
    // If length is odd, the last element is a number, and we set it to an empty string (removing it would remove a space at the end that is required to differentiate operations from numbers).
    displayWithoutLastNumStr[displayWithoutLastNumStr.length - 1] = "";
  }
  // Then we join displayWithoutLastNumStr with spaces again, and store this new value.
  displayWithoutLastNumStr = displayWithoutLastNumStr.join(" ");
  const lastCharStr = displayStr[displayStr.length - 1];

  window.onload = function () {
    function adjustBtnContainer() {
      console.log("adjusting button container...");
      const display = document.getElementById("displayContainer");
      // The heigth of display, plus the ten pixels of margin top and bottom.
      const displayHeight = display.offsetHeight;
      console.log(displayHeight);
      // Set a minHeight so that the buttons don't go up when the display is empty.
      display.style.minHeight = `${displayHeight}px`;
      document.getElementById("numPadButtonsContainer").style.height = `${
        window.innerHeight - displayHeight
      }px`;
    };
    adjustBtnContainer();
    document.onvisibilitychange = adjustBtnContainer;
    // window.onresize = adjustBtnContainer;
  };

  return (
    <div className="app">
      <Display
        history={history}
        setHistory={setHistory}
        displayStr={displayStr}
        setDisplayStr={setDisplayStr}
        isAnsBool={isAnsBool}
        setIsAnsBool={setIsAnsBool}
        addCommas={addCommas}
        lastNumStr={lastNumStr}
        lastCharStr={lastCharStr}
        displayWithoutLastNumStr={displayWithoutLastNumStr}
      />

      <NumPadButtons
        history={history}
        setHistory={setHistory}
        isAnsBool={isAnsBool}
        setIsAnsBool={setIsAnsBool}
        displayStr={displayStr}
        setDisplayStr={setDisplayStr}
        addCommas={addCommas}
        numsAndOpsArr={numsAndOpsArr}
        lastNumStr={lastNumStr}
        lastCharStr={lastCharStr}
        displayWithoutLastNumStr={displayWithoutLastNumStr}
      />
    </div>
  );
}
