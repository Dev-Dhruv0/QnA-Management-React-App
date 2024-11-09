import React, { useState } from "react";
import axios from "axios";
import "../Admin/AdminPanel.css";
import InputLabelField from "../../Components/InputLabelField/InputLabelField";

const AdminPanel = () => {
  // Question handler
  const [questionInput, setQuestionInput] = useState([
    {
      id: 1,
      question: "",
      isEditing: true,
      options: [{ id: 1, value: "", isEditing: true }],
    },
  ]);

  // Id state handler
  const [nextQuestionId, setNextQuestionId] = useState(2);
  const [nextOptionId, setNextOptionId] = useState(2);

  // Error Messages Handler
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  // Toggle question editing state
  const handleEditToggler = (questionId) => {
    setQuestionInput((prevState) =>
      prevState.map((question) =>
        question.id === questionId ? { ...question, isEditing: true } : question
      )
    );
  };

  // Add new question
  const handleAddQuestionInput = () => {
    setQuestionInput([
      ...questionInput,
      {
        id: nextQuestionId,
        question: "",
        isEditing: true,
        options: [{ id: nextOptionId, value: "", isEditing: true }],
      },
    ]);
    setNextQuestionId(nextQuestionId + 1);
    setNextOptionId(nextOptionId + 1); // New option for the new question
  };

  // Toggle question save state
  const handleQuestionSaveToggler = (questionId) => {
    setQuestionInput((prevState) =>
      prevState.map((question) => {
        if (question.id === questionId) {
          if (!question.question.trim()) {
            setErrors((prevErrors) => ({
              ...prevErrors, 
              [questionId]: "Question Cannot be empty!",
            }));
            return question;
          }

          if (question.options.length === 0)
          {
            setErrors((prevErrors) => ({
              ...prevErrors,
              [questionId]: "At least one option is required!",
            }));
            return question;
          }

          setErrors((prevErrors) => {
            // Clear error for thi question
            const { [questionId]: _, ...rest } = prevErrors
            return rest;
          });
          return { ...question, isEditing: false };
        }
        return question;
      })
    );
  };

  // Add new option to a question
  const handleAddOption = (questionId) => {
    setQuestionInput(
      questionInput.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [
                ...question.options,
                { id: nextOptionId, value: "", isEditing: true },
              ],
            }
          : question
      )
    );
    setNextOptionId(nextOptionId + 1);
  };

  // Handle option value change
  const handleOptionChange = (e, questionId, optionId) => {
    const { value } = e.target;
    setQuestionInput(
      questionInput.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, value } : option
              ),
            }
          : question
      )
    );
  };

  // Toggle option editing state
  const handleOptionEditToggler = (questionId, optionId) => {
    setQuestionInput(
      questionInput.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, isEditing: true } : option
              ),
            }
          : question
      )
    );
  };

  // Save option
  const handleOptionSaveToggler = (questionId, optionId) => {
    setQuestionInput((prevState) =>
      prevState.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) => {
                if (option.id === optionId) {
                  if (!option.value.trim()) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      [`${questionId}-${optionId}`]: "Option cannot be empty!",
                    }));
                    return option;
                  }
                  setErrors((prevErrors) => {
                    const { [`${questionId}-${optionId}`]: _, ...rest } = prevErrors;
                    return rest;
                  });
                  return { ...option, isEditing: false };
                }
                return option;
              }),
            }
          : question
      )
    );
  };

  // Delete option from a question
  const handleDeleteOption = (questionId, optionId) => {
    console.log("Option Deleted", optionId);
    setQuestionInput((prevState) => 
      prevState.map((question) => {
        if (question.id === questionId) 
          {
            const updatedOptions = question.options.filter(
              (option) => option.id !== optionId
            );
            if (updatedOptions.length === 0)
            {
              setErrors((prevErrors) => ({
                ...prevErrors,
                [questionId]: "At least one option is required!"
              }));
            } else {
              setErrors((prevErrors) => {
                const { [questionId]: _, ...rest } = prevErrors;
                return rest;
              })
            }
            return { ...question, options: updatedOptions };
          }
          return question;        
      })
      // questionInput.map((question) =>
      //   question.id === questionId
      //     ? {
      //         ...question,
      //         options: question.options.filter(
      //           (option) => option.id !== optionId
      //         ),
      //       }
      //     : question
      // )
    );
  };

  // Handle Correct Option Toggler
  const handleCorrectOptionToggle = (questionId, optionId) => {
    setQuestionInput((prevState) =>
      prevState.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) => ({
                ...option,
                is_correct: option.id === optionId,
              })),
            }
          : question
      )
    );
  };

  // Handle Input question change
  const handleInputQuestionChange = (e, questionId) => {
    const { name, value } = e.target;
    setQuestionInput((prevState) =>
      prevState.map((question) =>
        question.id === questionId ? { ...question, [name]: value } : question
      )
    );
  };

  // Delete Question Element
  const handleDeleteQuestionInput = (questionId) => {
    setQuestionInput(
      questionInput.filter((question) => question.id !== questionId)
    );
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for unsaved items or empty fields
    // const unsavedOrEmptyItems = questionInput.some(
    //   (question) =>
    //     question.isEditing || // Check if any question is still in editing mode
    //     !question.question || // Check if question is empty
    //     question.options.some((option) => option.isEditing || !option.value) // Check if any option is unsaved or empty
    // );

    // if (unsavedOrEmptyItems) {
    //   console.log("Called Error");
    //   setError(
    //     "Please save all changes and ensure no fields are empty before submitting!"
    //   );
    //   return;
    // }  

    try {
      // Submit data logic
      const payload = questionInput.map((question) => ({
        question: question.question,
        options: question.options.map((option) => ({
          option_text: option.value,
          is_correct: option.is_correct || false,
        })),
      }));

      console.log("Payload being sent: ", JSON.stringify(payload, null, 2));
      await axios.post("http://localhost:5000/api/admin/questions", payload);
      console.log("Questions Submitted Successfully");
      setError(""); // Clear any previous error
    } catch (error) {
      console.error("Error Submitting the question", error);
      if (error.response) {
        console.log("Server responded with error: ", error.response.data);
      } else if (error.request) {
        console.log("No response reveived: ", error.request);
      } else {
        console.log("Error in requeest setup: ", error.message);
      }
      // setError("An error occurred while submitting the questions.");
    }
  };

  return (
    <>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Display error messages */}
      <div className="admin-container">
        <div className="container">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="my-form">
              {questionInput.map((question, index) => (
                <div key={question.id} className="form-group">
                  <InputLabelField
                    label={`Question ${index + 1}`}
                    name="question"
                    value={question.question}
                    onChange={(e) => handleInputQuestionChange(e, question.id)}
                    // disabled={!question.isEditing}
                    isEditing={question.isEditing}
                  />

                  {/* Display Question Error */}
                  {errors[question.id] && (
                    <p className="error-message">{errors[question.id]}</p>
                  )}

                <div className="input-btn-container">
                  <div className="options-input-field">
                    {question.options.map((option, optionIndex) => (
                      <div key={option.id} className="form-group">
                        <div className="form-div">
                          <div className="input-wrapper">
                     {/* Checkbox for marking the option as correct */}
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={option.is_correct || false}
                          onChange={() =>
                            handleCorrectOptionToggle(question.id, option.id)
                          }
                          className="checkbox"
                        />
                        <span className="custom-checkbox"></span>
                      </label>

                          <InputLabelField
                            label={`Option ${optionIndex + 1}`}
                            name={`option-${optionIndex}`}
                            value={option.value}
                            onChange={(e) =>
                              handleOptionChange(e, question.id, option.id)
                            }
                            // disabled={!option.isEditing}
                            isEditing={option.isEditing}
                          />

                      {/* Edit/Save toggler button for each option */}
                        <div className="option-buttons-container">
                          {option.isEditing ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleOptionSaveToggler(question.id, option.id)
                              }
                              className="btn-option-save"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleOptionEditToggler(question.id, option.id)
                              }
                              className="btn-option-edit"
                            >
                              Edit
                            </button>
                          )}

                          {/* Delete Option button */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteOption(question.id, option.id)
                            }
                            className="btn-option-delete"
                          >
                            Delete
                          </button>
                        </div>

                      </div>

                          {/* Display Option Error */}
                          {errors[`${question.id}-${option.id}`] && (
                            <p className="error-message">{errors[`${question.id}-${option.id}`]}</p>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                  {/* Add Option button */}
                  <div className="add-option-container">
                    <div className="add-option-line"></div>
                    <button
                      type="button"
                      onClick={() => handleAddOption(question.id)}
                      className="btn-add-option"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <div className="add-option-line"></div>
                  </div>

                  {/* Edit/Save toggler button for question */}
                  {question.isEditing ? (
                    <button
                      type="button"
                      onClick={() => handleQuestionSaveToggler(question.id)}
                      className="btn-save"
                    >
                      Save Question
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEditToggler(question.id)}
                      className="btn-edit"
                    >
                      Edit Question
                    </button>
                  )}

                  {/* Delete Question button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestionInput(question.id)}
                    className="btn-delete"
                  >
                    Delete Question
                  </button>
                </div>
              ))}

              {/* Submit button */}
              <div className="btn-group">
              {/* Add New Question */}
              <button
                type="button"
                onClick={handleAddQuestionInput}
                className="btn-add"
              >
                Add Question
              </button>
                <button type="submit" className="btn-submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
