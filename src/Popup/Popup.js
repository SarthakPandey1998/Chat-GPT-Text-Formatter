import React, { useEffect, useState } from "react";
import "./Popup.css"; // Import the CSS file for styling
import { isEmpty } from "lodash";

const Popup = ({ isOpen, onClose, onSubmit, labelData, OriginalText }) => {
  const [showInput, setShowInput] = useState(true);
  const obj = {};
  const [errors, setErrors] = useState({});

  useEffect(() => {
    labelData?.forEach((element) => {
      obj[element] = "";
    });
  }, [labelData]);


  const [inputValue, setInputValue] = useState([obj]);
  const [inputVal, setInputVal] = useState();
  const handleInputchange = (index, e, item) => {
    const { value } = e.target;
    setInputVal(value);
    if (inputValue[item] !== "") {
      const updatedFields = [...inputValue];
      updatedFields[index] = value;
      setInputValue(updatedFields);
    }
    else {

    }
    const updatedErrors = { ...errors };
    if (value.length < 1 || value.length >= 30) {
      updatedErrors[index] = "Value should be between 1 and 30";
    } else {
      delete updatedErrors[index];
    }

    setErrors(updatedErrors);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    isEmpty(errors) && onSubmit(inputValue);
    setShowInput(/\[(.*?)\]/g.test(e.target.innerHTML));

  };
  if (!isOpen) {
    return null;
  }


  return (
    <div className="popup">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <form onSubmit={handleSubmit}>
          {labelData?.map((item, index) => (
            <div className="container" key={index} >
              <div className="row p-3">
                <label value="item" className="col p-0">
                  <div
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </label>
                {showInput &&
                  <input
                    type="text"
                    value={inputValue[item]}
                    defaultValue={!isEmpty(inputValue[index]) ? inputValue[index] : ""}
                    onChange={(e) => { handleInputchange(index, e, item); }}
                    placeholder=" Enter a value"
                    className="col p-1"
                    style={{ borderRadius: "8px", border: "0.5px", borderStyle: "groove" }}
                    maxLength={30}
                    required
                  />}
                <span className="error"> {errors[index] && <p>{errors[index]}</p>}</span>
              </div>
            </div>
          ))}

          <div
            className={!isEmpty(inputVal) ? "submitbutton text-center" : ""}
            style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}

          >

            <button
              type="btn"
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: "16px",
                padding: "8px 16px",


              }}
              className="col"

            >
              Submit

            </button>

            <button
              type="btn"
              onClick={onClose}
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: "16px",
                padding: "8px 16px",
                marginLeft: "16px",
              }}
              className="col"
            >
              Skip
            </button>

          </div>
        </form>
      </div>
    </div>

  );
};

export default Popup;
