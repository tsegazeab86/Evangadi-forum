import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../axiosConfig";
import "./askQuestion.css";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // ✅ Endpoint-ው /questions ብቻ እንዲሆን ተደርጓል
      await axios.post(
        "/questions",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      navigate("/"); // ጥያቄው ሲለጠፍ ወደ Home ገፅ ይመልሳል
    } catch (error) {
      setLoading(false);
      console.error("Post Question Error:", error.response || error);
      if (error.response && error.response.data && error.response.data.msg) {
        setErrorMessage(error.response.data.msg);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section className="ask__container">
      <div className="ask__wrapper">
        <h2>Steps To Write A Good Question</h2>
        <ul>
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it here.</li>
        </ul>

        <h3>Post Your Question</h3>

        {errorMessage && (
          <div className="alert alert__danger">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form__group">
            <input
              type="text"
              placeholder="Question title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form__group">
            <textarea
              rows="6"
              placeholder="Question detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn__post" disabled={loading}>
            {loading ? "Posting..." : "Post Question"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AskQuestion;