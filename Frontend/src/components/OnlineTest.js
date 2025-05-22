import React, { useState } from "react";
import axios from "axios";
import he from "he";
import "./OnlineTest.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OnlineTest = () => {
  const [subject, setSubject] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleGenerateMCQs = async () => {
    if (!subject) {
      toast.warning("Please select a subject");
      return;
    }

    setLoading(true);
    setError("");
    setMcqs([]);
    setSelectedAnswers({});
    setTotalAttempts(0);
    setCorrectAnswers(0);
    setSubmitted(false);

    try {
      const response = await axios.post("http://localhost:5000/api/generate-mcqs", { subject });

      const decodedMCQs = response.data.mcqs.map((mcq) => ({
        ...mcq,
        question: he.decode(mcq.question),
        correct_answer: he.decode(mcq.correct_answer),
        incorrect_answers: mcq.incorrect_answers.map((option) => he.decode(option)),
      }));

      setMcqs(decodedMCQs);
    } catch (err) {
      setError("Error generating MCQs. Please try again.");
      toast.error("Error generating MCQs.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, answer) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev, [index]: answer };
      setTotalAttempts(Object.keys(updatedAnswers).length);
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    mcqs.forEach((mcq, index) => {
      if (selectedAnswers[index] === mcq.correct_answer) {
        correctCount++;
      }
    });

    const score = ((correctCount / mcqs.length) * 100).toFixed(2);
    setCorrectAnswers(correctCount);
    setSubmitted(true);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.info("You need to log in to save the test result.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/saveTestResult",
        { testScore: score },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { message, finalMeritPercentage } = response.data;

      toast.success(`${message} Final Merit: ${finalMeritPercentage.toFixed(2)}%`);
    } catch (err) {
      console.error("Error saving test result:", err);
      toast.error("Failed to save test result. Please try again.");
    }
  };

  return (
    <div className="online-test-container">
      <ToastContainer position="top-center" />
      <h2>Online Test</h2>

      <div className="select-subject">
        <table>
          <thead>
            <tr>
              <th>Select Subject</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <select value={subject} onChange={handleSubjectChange}>
                  <option value="">Select a subject</option>
                  <option value="Maths">Maths</option>
                  <option value="English">English</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className="start-test-btn" onClick={handleGenerateMCQs} disabled={loading}>
        {loading ? "Starting Test..." : "Start Test"}
      </button>

      {error && <p className="error">{error}</p>}

      {mcqs.length > 0 && (
        <div className="mcqs-table">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Question</th>
                <th>Option A</th>
                <th>Option B</th>
                <th>Option C</th>
                <th>Option D</th>
                <th>Your Answer</th>
              </tr>
            </thead>
            <tbody>
              {mcqs.map((mcq, index) => {
                const options = [mcq.correct_answer, ...mcq.incorrect_answers].sort(() => Math.random() - 0.5);

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{mcq.question}</td>
                    {options.map((option, i) => (
                      <td key={i}>
                        <label>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={selectedAnswers[index] === option}
                            onChange={() => handleAnswerChange(index, option)}
                          />
                          {option}
                        </label>
                      </td>
                    ))}
                    <td>
                      <span>{selectedAnswers[index] || "Not answered"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {mcqs.length > 0 && !submitted && (
        <div className="total-attempted-container">
          <table>
            <thead>
              <tr>
                <th>Total Attempted</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalAttempts}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {mcqs.length > 0 && !submitted && (
        <button className="submit-test-btn" onClick={handleSubmit}>
          Submit Test
        </button>
      )}

      {submitted && (
        <div className="result-container">
          <h3>Test Results</h3>
          <table>
            <thead>
              <tr>
                <th>Correct Answers</th>
                <th>Total Questions</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{correctAnswers}</td>
                <td>{mcqs.length}</td>
                <td>{((correctAnswers / mcqs.length) * 100).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OnlineTest;
