import React, { useEffect } from "react";

export default function NumPadButtons({
  // Props, or dependencies.
  displayStr,
  setDisplayStr,
  isAnsBool,
  setIsAnsBool,
  history,
  setHistory,
  addCommas,
  displayWithoutLastNumStr,
  lastNumStr,
  lastCharStr,
}) {
  useEffect(() => {

    // Keydown handles all the digits, decimals, and 
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);
    // pointerdown/up handles both click and touch events.
    document
      .getElementById("button0")
      .addEventListener("pointerdown", handleDelPress);
    document
      .getElementById("button0")
      .addEventListener("pointerup", handleDelRelease);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyup);
      document
        .getElementById("button0")
        .removeEventListener("pointerdown", handleDelPress);
      document  
        .getElementById("button0")
        .removeEventListener("pointerup", handleDelRelease);
    };
  });

  let deleteTimer;
  let dispatched;
  function handleKeydown(e) {
    const buttonKeys = {
      "/": "button2",
      x: "button3",
      X: "button3",
      "*": "button3",
      7: "button4",
      8: "button5",
      9: "button6",
      "+": "button7",
      4: "button8",
      5: "button9",
      6: "button10",
      "-": "button11",
      1: "button12",
      2: "button13",
      3: "button14",
      Enter: "button15",
      "=": "button15",
      0: "button16",
      ".": "button17",
      ArrowUp: "historyDisplay",
    };
    const elem = document.getElementById(buttonKeys[e.key]);
    if (e.key.match(/Escape|Delete|Backspace/)) {
      document.getElementById("button0").dispatchEvent(new PointerEvent("pointerdown"));
    } else if (e.key === "ArrowUp" && !dispatched) {
      elem.dispatchEvent(new PointerEvent("pointerdown"));
      dispatched = true;
    } else if (elem) {
      elem.click();
    }
  }
  function handleKeyup(e) {
    if (e.key.match(/Delete|Escape|Backspace/)) {
      // Works.
      document.getElementById("button0").dispatchEvent(new PointerEvent("pointerup"));
    } else if (e.key === "ArrowUp") {
      // Doesn't.
      document.getElementById("historyDisplay").dispatchEvent(new PointerEvent("pointerup"));
      dispatched = false;
    }
  }
  function handleDelPress() {
    deleteTimer = setTimeout(() => setDisplayStr(""), 250);
  }
  function handleDelRelease() {
    // If the timer exists, clear it and remove the last character from display.
    if (deleteTimer && !deleteTimer._destroyed && displayStr !== "") {
      // If the timer still exists when the user stops pressing, they just want to erase their last entry.
      // lastCharStr could be a space, a digit, a decimal, an empty string, or a negative sign.
      // If space, clear out the last three entires (sign and spaces around it).
      // If negative sign, take it back.
      // If empty string, don't do anything (could be default).
      // If digit or decimal, just set displayWithoutLastNum plus addCommas(lastNum without last entry) DEFAULT.
      clearTimeout(deleteTimer);
      if (isAnsBool) {
        setDisplayStr("");
      } else if (
        typeof lastNumStr === "string" &&
        !lastCharStr.match(/[A-Za-z]/)
      ) {
        switch (lastCharStr) {
          case " ":
            setDisplayStr(displayStr.substr(0, displayStr.length - 3));
            setIsAnsBool(false);
            break;
          case "⁻":
          case "-":
            setDisplayStr(displayStr.substr(0, displayStr.length - 1));
            setIsAnsBool(false);
            break;
          case "":
            break;
          default:
            // Digits or decimals.
            setDisplayStr(
              displayWithoutLastNumStr +
                addCommas(lastNumStr.substr(0, lastNumStr.length - 1))
            );
            setIsAnsBool(false);
            break;
        }
      } else {
        // Otherwise, the last "num" is actually a word, or is an empty string.
        setDisplayStr(displayWithoutLastNumStr);
      }
    }
  }
  const symbols = [
    {
      symbol: "Del",
      class: "clear",
    },
    {
      symbol: "+/-",
      class: "sign",
    },
    {
      symbol: "/",
      class: "operation",
    },
    {
      symbol: "*",
      class: "operation",
    },
    {
      symbol: "7",
      class: "description",
    },
    {
      symbol: "8",
      class: "description",
    },
    {
      symbol: "9",
      class: "description",
    },
    {
      symbol: "+",
      class: "operation",
    },
    {
      symbol: "4",
      class: "description",
    },
    {
      symbol: "5",
      class: "description",
    },
    {
      symbol: "6",
      class: "description",
    },
    {
      symbol: "-",
      class: "operation",
    },
    {
      symbol: "1",
      class: "description",
    },
    {
      symbol: "2",
      class: "description",
    },
    {
      symbol: "3",
      class: "description",
    },
    {
      symbol: "=",
      class: "ansRes",
    },
    {
      symbol: "0",
      class: "description",
    },
    {
      symbol: ".",
      class: "decimal",
    },
  ];

  return (
    <div className="numPadButtonsContainer" id="numPadButtonsContainer">
      {symbols.map((obj, i) => {
        return (
          <button
            className={`numPadButton ${obj.class}`}
            id={`button${i}`}
            key={i}
            onClick={() => {
              switch (obj.class) {
                case "clear":
                  // Erase the last entry, or the whole display if held for 0.4s. Handled by the event listener.
                  setIsAnsBool(false);
                  break;

                case "decimal":
                  // Check to see if there are any decimals in the current number.
                  if (!lastNumStr.match(/[.a-zA-Z+\-*/]/) && !isAnsBool) {
                    // Append decimal to display if it is NOT the previous answer,if it contains no letters or operands, and if there isn't a decimal already.
                    setDisplayStr(displayStr + ".");
                  } else if (isAnsBool) {
                    // If the previous answer is being displayed, just override it with the decimal.
                    setDisplayStr(".");
                    setIsAnsBool(false);
                  }
                  break;

                case "operation":
                  if (displayStr === "") {
                    // Assume number is 0 if operation entered first.
                    setDisplayStr(`0 ${obj.symbol} `);
                  } else {
                    switch (lastCharStr) {
                      case " ": // Switch the operation if the last character entered was an operation.
                        const last3CharsCut = displayStr.substr(
                          0,
                          displayStr.length - 3
                        );
                        setDisplayStr(`${last3CharsCut} ${obj.symbol} `);
                        break;
                      case "⁻":
                        // Assume 0 if only the sign of the number is specified.
                        setDisplayStr(`${displayStr}0 ${obj.symbol} `);
                        break;
                      default:
                        // Otherwise, just append the operation (with two spaces) to the display.
                        setDisplayStr(`${displayStr} ${obj.symbol} `);
                        // And setIsAns to false.
                        setIsAnsBool(false);
                        break;
                    }
                  }
                  break;

                case "sign":
                  switch (lastCharStr) {
                    case "": // Empty display.
                      setDisplayStr("⁻");
                      break;
                    case " ": // After an operation.
                      setDisplayStr(displayStr + "⁻");
                      break;
                    default:
                      // In the middle of a number, or after the negative sign itself.
                      setDisplayStr(
                        lastNumStr && lastNumStr.match(/⁻/)
                          ? displayWithoutLastNumStr +
                              lastNumStr.substr(1, lastNumStr.length)
                          : displayWithoutLastNumStr + "⁻" + lastNumStr
                      );
                      // Need to setIsAns to false, since we're possibly changing the value of the previous ans. But we don't override it.
                      setIsAnsBool(false);
                      break;
                  }
                  break;

                case "description":
                  if (
                    lastNumStr &&
                    lastNumStr.toString().match(/[a-zA-Z]/) &&
                    !isAnsBool
                  ) {
                    // If the calculator has NaN or Infinity or e+, and that is NOT the last answer. No need for addCommas.
                    setDisplayStr(`${displayStr} * ${obj.symbol}`); // Multiply whatever number is inputted by the previous "num".
                  } else if (isAnsBool) {
                    // If a number is entered with the previous answer being displayed, override the last answer. No need for addCommas.
                    setDisplayStr(obj.symbol);
                    setIsAnsBool(false);
                  } else {
                    // Otherwise, just append and add commas.
                    setDisplayStr(
                      displayWithoutLastNumStr +
                        addCommas(lastNumStr + obj.symbol)
                    );
                  }
                  break;

                default:
                  // = button.
                  if (displayStr !== "") {
                    let numsOpsUsedToCalc = displayStr
                      .split(/\s/)
                      .map(elem => {
                        if (elem === "⁻" || elem === "" || elem === " ") {
                          return "0";
                        } else {
                          return elem;
                        }
                      })
                      .join(" ");
                    const numsOpsArr = numsOpsUsedToCalc
                      .replace(/⁻/g, "-")
                      .replace(/,/g, "")
                      .split(/\s/);
                    if (numsOpsArr.length % 2 === 0) {
                      // Add a 0 to the end if length is even, since there is an operation with no number following it.
                      numsOpsArr.push(0);
                    }
                    const ops = {
                      "*": function (a, b) {
                        return a * b;
                      },
                      "/": function (a, b) {
                        return a / b;
                      },
                      "+": function (a, b) {
                        return a + b;
                      },
                      "-": function (a, b) {
                        return a - b;
                      },
                    };
                    for (let i = 0; i < numsOpsArr.length; i += 2) {
                      // Convert all strings in even indexes (number indexes) to numbers.
                      numsOpsArr[i] = parseFloat(numsOpsArr[i]);
                    }
                    let ind = 1;
                    while (ind < numsOpsArr.length) {
                      if (numsOpsArr[ind] === "*" || numsOpsArr[ind] === "/") {
                        // Remove the current element, as well as the two elements around it, and add the result of whatever operationthe current element represents (mul or div) with the number before and after the current element.
                        numsOpsArr.splice(
                          ind - 1,
                          3,
                          ops[numsOpsArr[ind]](
                            numsOpsArr[ind - 1],
                            numsOpsArr[ind + 1]
                          )
                        );
                      } else {
                        // If the current operation is not multiplication or addition, we simply move on to the next operation, whichwill be two indexes over.
                        ind += 2;
                      }
                    }
                    ind = 1; // Then we reset ind.
                    while (ind < numsOpsArr.length) {
                      // Now that only addition and subtraction are left, we can do all the operations we encounter.
                      numsOpsArr.splice(
                        ind - 1,
                        3,
                        ops[numsOpsArr[ind]](
                          numsOpsArr[ind - 1],
                          numsOpsArr[ind + 1]
                        )
                      );
                    }
                    const ans =
                      numsOpsArr.length === 1
                        ? addCommas(
                            numsOpsArr[0]
                              .toString()
                              .replace(/-/g, "⁻")
                              .replace(/Infinity/g, "Undefined")
                          )
                        : "Error";
                    setHistory(
                      // If the array has reached a length of ten, we remove the last element and add the last answer to the beginning. Otherwise, we just add the last answer to the beginning.
                      history.length === 10
                        ? [
                            `${numsOpsUsedToCalc} = ${ans}`,
                            ...history.slice(0, history.length - 1),
                          ]
                        : [`${numsOpsUsedToCalc} = ${ans}`, ...history]
                    );
                    setDisplayStr(ans);
                    setIsAnsBool(true);
                  } else if (history[history.length - 1]) {
                    const prevAns = history[history.length - 1]
                      .replace(/\s/g, "")
                      .replace(/Infinity/g, "Undefined")
                      .split(/=/)
                      .pop();
                    setDisplayStr(addCommas(prevAns));
                    setIsAnsBool(true);
                  }
                  break;
              }
            }}
          >
            {obj.symbol}
          </button>
        );
      })}
    </div>
  );
}
