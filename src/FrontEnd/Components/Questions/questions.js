import React, { useState, useEffect } from "react";
import axios from "axios";
import 'A:/G_Square/Small Projects/app-quiz/src/FrontEnd/Views/User/userEnd.css';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null); // For tracking selected radio button

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
            // setSelectedOption(null); 
        }
    };

    // Function to handle previous question
    const handlePrevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            // setSelectedOption(null); 
        }
    };

    return (
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
                                    <div key={i} className="option-container">
                                        <input
                                            type="radio"
                                            id={`option${i}`}
                                            name={`question${currentIndex}`}
                                            value={option.value}
                                            checked={selectedOption === option.value}
                                            onChange={(e) => setSelectedOption(e.target.value)}
                                        />
                                        <label htmlFor={`option${i}`}>{option.value}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="button-group">
                            {currentIndex > 0 && (
                                <button onClick={handlePrevQuestion}>Previous Question</button>
                            )}
                            {currentIndex < questions.length - 1 && (
                                <button onClick={handleNextQuestion}>Next Question</button>
                            )}
                        </div>
                        {currentIndex === questions.length - 1 && (
                            <p>No more questions available at this time!</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Questions;
