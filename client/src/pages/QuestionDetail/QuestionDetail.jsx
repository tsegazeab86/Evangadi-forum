import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "./questionDetail.css";

function QuestionDetail() {
  const { questionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  // የጥያቄውን መረጃ እና መልሶችን አምጥቶ ማሳያ ፋንክሽን
  const fetchQuestionDetailsData = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // 1. የጥያቄውን መረጃ ማምጣት
      const questionRes = await axios.get(`/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestion(questionRes.data.question || questionRes.data);

      // 2. ለጥያቄው የተሰጡ መልሶችን ማምጣት
      const answerRes = await axios.get(`/answers/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const answerData = answerRes.data.answers || answerRes.data.allAnswers || answerRes.data;
      setAnswers(Array.isArray(answerData) ? answerData : []);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching details:", error.response || error);
      setErrorMessage("Failed to load question details or answers.");
    }
  }, [questionId, token, navigate]);

  useEffect(() => {
    fetchQuestionDetailsData();
  }, [fetchQuestionDetailsData]);

  // አዲስ መልስ Submit ማድረጊያ
  const handlePostAnswer = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newAnswer.trim()) {
      setErrorMessage("Answer field cannot be empty!");
      return;
    }

    try {
      setPosting(true);

      // መልስ ወደ Backend መላክ (በ backend route-ህ መሠረት /answers ወይም /answers/post-answer መሆኑን አረጋግጥ)
      await axios.post(
        "/answers",
        {
          questionid: questionId,
          answer: newAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewAnswer("");
      setPosting(false);

      // መልሶችን እንደገና Refresh አድርጎ ማምጣት
      fetchQuestionDetailsData();
    } catch (error) {
      setPosting(false);
      console.error("Post answer error:", error.response);
      if (error.response && error.response.data && error.response.data.msg) {
        setErrorMessage(error.response.data.msg);
      } else {
        setErrorMessage("Something went wrong while submitting your answer.");
      }
    }
  };

  if (loading) {
    return <div className="detail__loading">Loading question details...</div>;
  }

  return (
    <section className="detail__container">
      <div className="detail__wrapper">
        {/* Question Section */}
        {question && (
          <div className="question__detail__box">
            <h2 className="question__title">Question</h2>
            <h3 className="question__heading">{question.title}</h3>
            <p className="question__desc">{question.description}</p>
          </div>
        )}

        {/* Answers Header */}
        <h3 className="answers__title">Answer From The Community</h3>

        {/* Answers List */}
        <div className="answers__list">
          {answers.length === 0 ? (
            <p className="no__answers">
              No answers posted yet. Be the first to answer!
            </p>
          ) : (
            answers.map((ans, index) => (
              <div
                key={ans.answerid || ans.answer_id || index}
                className="answer__item"
              >
                <div className="user__avatar__box">
                  <div className="avatar__icon">👤</div>
                  <span className="question__user">
                    {ans.username || "Anonymous"}
                  </span>
                </div>
                <div className="answer__content">
                  <p>{ans.answer}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Post Answer Form */}
        <div className="post__answer__section">
          <h3>Answer The Top Question</h3>
          <p>
            <Link to="/">Go to Question page</Link>
          </p>

          {errorMessage && (
            <div className="alert alert__danger">{errorMessage}</div>
          )}

          <form onSubmit={handlePostAnswer}>
            <div className="form__group">
              <textarea
                rows="5"
                placeholder="Your answer..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" disabled={posting} className="btn__submit">
              {posting ? "Posting..." : "Post Your Answer"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default QuestionDetail;