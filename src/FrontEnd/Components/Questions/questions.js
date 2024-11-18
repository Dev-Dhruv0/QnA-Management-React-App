import React, { useState, useEffect } from "react";
import axios from "axios";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuesNum, setCurrentQuesNum] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // For tracking selected option
  const [feedback, setFeedback] = useState(null);

  const optionLabels = ["A", "B", "C", "D"];

  // Fetch Questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/questions"
        );
        console.log("Fetched Questions Data Structure: ", response.data);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error Fetching Questions!", error);
      }
    };
    fetchQuestions();
  }, []);

  // Function to handle the next question
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback(null);
    }
    setCurrentQuesNum((previndex) => previndex + 1);
  };

  // Function to handle previous question
  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFeedback(null);
    }
    setCurrentQuesNum((previndex) => previndex - 1);
  };

  // Track selected option for the current question
  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId 
    }));
    console.log("Question ID: ",questionId);
    console.log("Option ID: ", optionId);
  };

  // Submit selected answer to the backend
  const handleSubmitAnswer = async () => {
    // console.log("Payload", payload)
    const question = questions[currentIndex];
    const selectedOptionId = selectedOptions[question.ques_id];

    if (!selectedOptionId) {
      setFeedback({
        type: "error",
        message: "Please select an option before submitting!",
      });
      return;
    }

    const payload = {
      ques_id: question.ques_id,
      selected_option_id: selectedOptionId,
    };
    console.log("Payload", payload)

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/submit-answer",
        payload
      );
      setFeedback({ type: "success", message: response.data.message });
    } catch (error) {
      console.error("Error submitting answer: ", error);
      console.log("Server Response", error.response.data);
      setFeedback({
        type: "error",
        message: "Failed to submit the answer. Please try again.",
      });
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="main-container flex flex-col items-center justify-center min-h-screen bg-purple-100 p-4">
      <div className="form-container bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl p-8 max-w-6xl w-full min-h-full flex flex-col justify-between shadow-xl">
        {questions.length === 0 ? (
          <p className="text-purple-500 text-lg font-semibold text-center">
            No Questions Available Currently...
          </p>
        ) : (
          <>
            {/* Feedback */}
            {feedback && (
              <div
                className={`feedback ${
                  feedback.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                } text-center mb-4`}
              >
                {feedback.message}
              </div>
            )}
            {/* Main Container */}
            <div className=" inner-container flex flex-col lg:flex-row justify-between mb-8">
              {/* Question Section */}
              <div className="flex-1 flex flex-col justify-between pr-0 lg:pr-7 mb-6 lg:mb-0">
                <h3 className="text-2xl lg:text-3xl font-semibold text-purple-700">
                  Q:{currentQuesNum + 1} {questions[currentIndex].question}
                </h3>
                {/* {console.log("Current Index: ", currentIndex)} */}
                {/* Progress Bar */}
                <div className="mt-4">
                  {/* <div className="mb-1 text-lg font-medium text-purple-700"> */}
                  {/* Progress */}
                  {/* </div> */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 lg:h-3">
                    <div
                      className="bg-purple-600 h-2.5 lg:h-3 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Options Section */}
              <div className="flex-1 mt-6 lg:mt-0">
                {questions[currentIndex].options.map((option, i) => (
                  <div
                    key={i}
                    className="border-b border-purple-300 last:border-b-0 mt-4"
                  >
                    <label
                      htmlFor={`option${i}`}
                      className={`flex items-center p-4 cursor-pointer transition-all duration-300
                        ${
                          selectedOptions[
                            questions[currentIndex].ques_id
                          ] === option.option_id
                            ? "bg-purple-200 border-purple-500 shadow-md"
                            : "bg-white"
                        } 
                        hover:bg-purple-100`}
                      onClick={() =>
                        handleOptionSelect(
                          questions[currentIndex].ques_id,
                          option.option_id
                        )
                      }
                    >
                      <span className="bg-purple-500 text-white font-bold w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full mr-4">
                        {optionLabels[i]}
                      </span>
                      <input
                        type="radio"
                        id={`option${i}`}
                        name={`question${questions[currentIndex].ques_id}`}
                        value={option.option_id}
                        checked={
                          selectedOptions[
                            questions[currentIndex].ques_id
                          ] === option.option_id
                        }
                        className="hidden"
                        onChange={() =>
                          handleOptionSelect(
                            questions[currentIndex].ques_id,
                            option.option_id
                          )
                        }
                      />
                      <span className="text-purple-700 text-xl ml-2">
                        {option.option_text}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6 sm:gap-10">
              {currentIndex > 0 && (
                <button
                  onClick={handlePrevQuestion}
                  className="px-8 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all duration-200"
                >
                  Previous
                </button>
              )}
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="ml-auto px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitAnswer}
                  className="ml-auto px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200"
                >
                  Submit Answer
                </button>
              )}
            </div>
            {currentIndex === questions.length - 1 && (
              <p className="text-purple-500 text-lg text-center mt-4">
                End of Questions!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Questions;
