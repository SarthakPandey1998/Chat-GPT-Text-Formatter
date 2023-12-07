import React, { useEffect, useRef, useState } from "react";
import Popup from "../Popup/Popup.js";
import { isEmpty } from "lodash";
import "./style.css";

const TextFormatter = () => {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [htmlText, setHtmlText] = useState("");
  const [removeBackgroundColor, setRemoveBackgroundColor] = useState(false);
  const [removeHyperlink, setRemoveHyperlink] = useState(false);
  const [show, setShow] = useState(true);
  const [change, setChange] = useState(false);
  const [labelData, setLabelData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [edit2, setEdit2] = useState(false);
  const [submittedValue, setSubmittedValue] = useState([]);
  const [initialVal, setInitialVal] = useState("");
  const initialRef = useRef(null);


  const input = (e) => {
    setHtmlText((e.currentTarget.innerHTML));
    setModifiedText((e.currentTarget.innerHTML));
    setOriginalText((e.currentTarget.innerHTML));
    setInitialVal(e.currentTarget.innerHTML);
    setEdit(true);
    setEdit2(false);

  }


  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    const html = clipboardData.getData("text/html");
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
      }
      else {
        setHtmlText(html);
        setOriginalText(html);
        setModifiedText(html);
        setEdit(true);
        setEdit2(false);
      }
    }
  }



  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleSubmit = (value) => {
    setSubmittedValue(value);
    closePopup();
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "removeBackgroundColor") {
      setRemoveBackgroundColor(checked);
    } else if (name === "removeHyperlink") {
      setRemoveHyperlink(checked);
    }
  };

  const format = () => {
    var arr1 = [];
    var arr2 = [];
    var div1 = document.getElementById("originaltext");
    var child1 = div1.children;
    for (var i = 0; i < child1.length; i++) {
      var fontSize = child1[i].style.fontSize;
      var fontFamily = child1[i].style.fontFamily;
      arr1.push(fontSize);
      arr2.push(fontFamily);
    }
    console.log("arr1", arr1);
    console.log("arr2", arr2);
    var div2 = document.getElementById("myDiv");
    var child2 = div2?.children;
    console.log("child2", child2);

    if (child2) {
      for (var j = 0; j < child2.length; j++) {
        child2[j].style.fontSize = arr1[j];
        child2[j].style.fontFamily = arr2[j];
      }
    }

  }
  const modifyText = () => {
    let modified = initialVal;
    if (removeBackgroundColor) {
      modified = modified.replace(
        /(<[^>]+) style="(?!.^background-color).*?"/g,
        "$1"
      );

    }
    if (removeHyperlink) {
      modified = modified.replace(/<a/gi, "<span");
      modified = modified.replace(/<\/a>/gi, "</span>");
    }
    format();
    setOriginalText(modified);
    setModifiedText(modified);
    setHtmlText(modified);
    setChange(true);
    (edit && !isEmpty(originalText)) && (/\[(.*?)\]/).test(originalText) && openPopup();
    setShow(true);
    setEdit2(true);
  };

  const handleCopyClick = () => {

    // const textToCopy = initialRef.current.children[0];
    // navigator.clipboard
    //   .writeText(textToCopy)
    //   .then(() => {
    //     console.log("copiedtext", textToCopy);
    //     setShowPopup(true);
    //     setTimeout(() => {
    //       setShowPopup(false);
    //     }, 2000);
    //   })
    //   .catch((error) => {
    //     console.log("The text is not copied");
    //   });
    const divElement = document.getElementById("myDiv");
    const textToCopy = divElement.innerText;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Text copied: " + textToCopy);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });

    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const cut = () => {
    setShow(false);
  };





  function replaceTextWithCustom(text, customTextArray) {
    const regex = /\[(.*?)\]/g;
    let currentIndex = 0;
    return text.replace(regex, (match) => {
      const replacement = customTextArray[currentIndex];
      currentIndex = (currentIndex + 1) % customTextArray.length;
      return replacement;
    });
  }

  useEffect(() => {
    var str1 = initialVal;
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    if (!removeBackgroundColor && !removeHyperlink) {
      for (var k = 0; k < str1.length; k++) {
        {
          if (str1.charAt(k) === "[") {
            arr1.push(k);
          } else if (str1.charAt(k) === "]") {
            arr2.push(k);
          }
        }
      }
    } else if (removeBackgroundColor || removeHyperlink) {
      for (k = 0; k < str1.length; k++) {
        {
          if (str1.charAt(k) === "[") {

            arr1.push(k);
          } else if (str1.charAt(k) === "]") {
            arr2.push(k);
          }
        }
      }
    }
    for (var i = 0; i < arr1.length; i++) {
      var strings = "";
      for (var j = arr1[i]; j <= arr2[i]; j++) {
        strings = strings + `${str1[j]}`;
        var string = String(strings);
      }
      arr3.push(string);
    }
    setLabelData(arr3);
    if (
      change &&
      !isEmpty(submittedValue) &&
      !removeBackgroundColor &&
      !removeHyperlink
    ) {
      const replacementValues = submittedValue;
      const replacedText = replaceTextWithCustom(originalText, replacementValues);
      setHtmlText(replacedText);
    } else if (
      change &&
      !isEmpty(submittedValue) &&
      (removeBackgroundColor || removeHyperlink)
    ) {
      const replacementValues = submittedValue;
      const replacedText = replaceTextWithCustom(
        originalText,
        replacementValues
      );
      setModifiedText(replacedText);
    }

  }, [htmlText, modifiedText, removeBackgroundColor, removeHyperlink, submittedValue]);

  return (
    <div className="container-fluid">
      <div className="row">
        <h2
          className="col-sm-12 text-center"
          style={{
            color: "purple",
            marginRight: "5rem",
            marginTop: "3rem",
          }}
        >
          ChatGPT Text Formatter
        </h2>
        <div className="col-sm-5 mt-4">
          <h3
            style={{
              textAlign: "center",
              width: "100%",
              color: "purple",
            }}
          >
            Original Text :
          </h3>

          <div
            className="col-sm-4"
            id="originaltext"
            contenteditable="true"
            data-text="Enter the text..."
            onPaste={handlePaste}
            onInput={(e) => input(e)}
            style={{
              width: "100%",
              height: "680px",
              resize: "both",
              overflow: "auto",
              border: "solid 1px gray",
              marginTop: "88px",
              padding: "16px",
            }}
          ></div>

        </div>
        <div
          className="col-sm-2 "
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "120px",
          }}
        >
          <div>
            <div>
              <input
                id="input1"
                type="checkbox"
                name="removeBackgroundColor"
                checked={removeBackgroundColor}
                onChange={handleCheckboxChange}
                style={{ cursor: "pointer" }}
              />

              <label
                style={{ color: "orange", marginLeft: "8px", cursor: "pointer" }}
                htmlFor="input1"
              >
                Remove Background Color
              </label>
            </div>
            <div className="hyperlink">
              <span>
                <input
                  id="input2"
                  type="checkbox"
                  name="removeHyperlink"
                  checked={removeHyperlink}
                  onChange={handleCheckboxChange}
                  style={{ cursor: "pointer" }}
                />
              </span>
              <label
                style={{ color: "orange", marginLeft: "8px", cursor: "pointer" }}
                htmlFor="input2"
              >
                Remove Hyperlinks
              </label>
            </div>
          </div>

          <div
            className={!isEmpty(originalText) ? "formattext" : "disableformattext"}
            style={{
              marginTop: "24px",
            }}
          >
            <button
              onClick={() => modifyText()}
              type="btn"
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: "16px",
                padding: "8px 16px",

              }}
            >
              Format Text
            </button>
          </div>
        </div>
        <div className="col-sm-5 mt-4">
          <div>
            <>
              <h3
                style={{
                  textAlign: "center",
                  width: "100%",
                  color: "purple",
                }}
              >
                Modified Text :
              </h3>
              <div
                style={{
                  width: "97%",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <span className={edit && !isEmpty(originalText) ? "textcopy" : "disabletextcopy"}>
                  <button
                    type="btn"
                    onClick={() => edit && !isEmpty(originalText) ? handleCopyClick() : null}
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      padding: "8px 16px",
                    }}
                  >
                    Copy
                  </button>
                </span>
                <span className={edit && !isEmpty(originalText) ? "textcopy" : "disabletextcopy"}>{showPopup && <Popup2 />}</span>

                <span className={edit && !isEmpty(originalText) ? "textclear" : "disabletextclear"}>
                  <button
                    type="btn"
                    onClick={() => edit && !isEmpty(originalText) ? cut() : null}
                    style={{
                      cursor: "pointer",
                      border: "none",
                      borderRadius: "16px",
                      padding: "8px 16px",
                      marginLeft: "16px",
                    }}
                  >
                    Clear
                  </button>
                </span>
              </div>

              <div
                contenteditable="true"
                id="myDiv"
                ref={initialRef}
                onPaste={handlePaste}
                style={{
                  width: "100%",
                  height: "688px",
                  display: "flex",
                  flexDirection: "column",
                  border: "solid 1px gray",
                  marginTop: "18px",
                  resize: "both",
                  overflow: "auto",
                  padding: "16px",
                }}
              >
                {" "}
                {show && edit2 && (
                  <div >
                    {!removeBackgroundColor && !removeHyperlink && (
                      <div dangerouslySetInnerHTML={{ __html: htmlText }} />
                    )}
                    {(removeBackgroundColor || removeHyperlink) && (
                      <div
                        dangerouslySetInnerHTML={{ __html: modifiedText }}
                      />
                    )}
                  </div>
                )}
              </div>
            </>

          </div>
        </div>
      </div>

      <div>
        <Popup
          isOpen={isOpen}
          onClose={closePopup}
          onSubmit={handleSubmit}
          labelData={labelData}
          originalText={originalText}
        />
      </div>
    </div>
  );
};
const Popup2 = () => {
  return <div className="popup2">The text is copied!!!</div>;
};

export default TextFormatter;
