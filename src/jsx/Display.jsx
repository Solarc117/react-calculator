import React, { useEffect } from "react";

export default function Display({
  history,
  displayStr,
  setDisplayStr,
  isAnsBool,
  setIsAnsBool,
  addCommas,
  displayWithoutLastNumStr,
  lastNumStr,
  lastCharStr,
}) {
  // We need to wait until after this component has updated to scroll to the right after the user inputs.
  useEffect(() => {
    const mainDisplay = document.getElementById("mainDisplay");
    const historyDisplay = document.getElementById("historyDisplay");
    document.body.addEventListener("pointerdown", hideHistoryIfNeeded);
    if (!isAnsBool) {
      mainDisplay.scrollBy({
        left: mainDisplay.scrollWidth,
        behavior: "smooth",
      });
    }
    historyDisplay.scrollBy({
      left: historyDisplay.scrollWidth,
      behaviora: "smooth",
    });
    return () => document.body.removeEventListener("pointerdown", hideHistoryIfNeeded);
  });

  function addAns(str) {
    const ans = str
      .replace(/\s/g, "")
      .split(/=/)
      .pop();
    if (ans) {
      // All of the following only applies if ans is a truthy value.
      if (lastNumStr === "⁻") {
        setDisplayStr(displayStr + ans);
        setIsAnsBool(false);
      } else if (
        (displayStr.match(/[a-zA-Z0-9]/) && lastCharStr !== " ") ||
        (ans.match(/[a-zA-Z0-9]/) && displayStr !== "" && lastCharStr !== " ")
      ) {
        // If last "num" is NaN or Infinity, we can't append a digit to it, so we assume it's being multiplied. Also check in the second condition that the display is not empty.
        setDisplayStr(`${displayStr} * ${ans}`);
        setIsAnsBool(false);
      } else {
        // Otherwise, just append ans as if it were a digit.
        setDisplayStr(displayWithoutLastNumStr + addCommas(lastNumStr + ans));
        setIsAnsBool(false);
      }
    }
  }
  function hideHistoryIfNeeded(e) {
    // Hides the history list if the user presses somewhere other than the list.
    if (e.target !== document.getElementById("historyDisplay")) {
      document.getElementById("historyList").classList.add("hidden");
    }
  }
  let timer;

  return (
    <div className="displayContainer" id="displayContainer">
      <div
        className="historyDisplay"
        id="historyDisplay"
        onPointerDownCapture={() => {
          timer = window.setTimeout(() => {
            document.getElementById("historyList").classList.toggle("hidden");
            timer = undefined;
          }, 250);
        }}
        onPointerUpCapture={() => {
          if (timer) {
            clearTimeout(timer);
            // Need the g flag on the regex to replace all \s instances.
            const ans = history[0]
              .replace(/\s/g, "")
              .split(/=/)
              .pop();
            if (ans) {
              addAns(history[0]);
            }
          }
        }}
        onScroll={() => {
          clearTimeout(timer);
        }}
      >
        {history[0]}
      </div>
      <div className="historyList hidden" id="historyList">
        {history.map((elem, i) => {
          return (
            <div className="listItem" key={i} onPointerDown={() => { 
              addAns(history[i]);
              document.getElementById("historyList").classList.add("hidden");
            }}>
              {elem}
            </div>
          );
        })}
      </div>
      <div className="mainDisplay" id="mainDisplay">
        {displayStr}
      </div>
    </div>
  );
}