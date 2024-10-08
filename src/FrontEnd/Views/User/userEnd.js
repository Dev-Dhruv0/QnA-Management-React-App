import React, { useState, useEffect } from "react";
import axios from "axios";
import '../User/userEnd.css'

const User = () => {
  // State to store and handle questions
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current question index

  // Fetch Questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/questions");
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
    }
  };

  return (
    <>
      <div className="user-container">
        <h2>User End</h2>
        <div className="Qna-container">
          {questions.length === 0 ? (
            <p>No Questions Available Currently...</p>
          ) : (
            <>
              <div key={currentIndex}>
                <div className="question-block">
                  <h3>{questions[currentIndex].question}</h3>
                </div>
                <div className="option-block">
                  {questions[currentIndex].options.map((option, i) => (
                    <div key={i}>
                      <input
                        type="radio"
                        id={`option${i}`}
                        name={`question${currentIndex}`}
                      />
                      <label htmlFor={`option${i}`}>{option.value}</label>
                    </div>
                  ))}
                </div>
              </div>
              {currentIndex < questions.length - 1 && (
                <button onClick={handleNextQuestion}>Next</button>
              )}
              {currentIndex === questions.length - 1 && (
                <p>No more questions available at a time.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default User;
