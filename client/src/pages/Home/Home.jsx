import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "./Home.css";


function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Token ከሌለ በቀጥታ ወደ Login መመለስ
    if (!token) {
      navigate("/login");
      return;
    }

    // 1. የተጠቃሚውን መረጃ ማረጋገጫ (Check User)
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/users/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data.username);
      } catch (err) {
        console.error("User check failed:", err.response || err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    // 2. ሁሉንም ጥያቄዎች ከ Backend ማምጫ (Fetch Questions)
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        
        // ✅ የተስተካከለው Endpoint URL (ከ /questions/all-questions ይልቅ /questions)
        const { data } = await axios.get("/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Data Structure ማረጋገጥ
        const questionData = data.questions || data.allQuestions || data;
        setQuestions(Array.isArray(questionData) ? questionData : []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Fetch Questions Error Details:", err.response || err);
        
        if (err.response && err.response.data && err.response.data.msg) {
          setError(err.response.data.msg);
        } else {
          setError("Failed to fetch questions. Please check server connection.");
        }
      }
    };

    checkUser();
    fetchQuestions();
  }, [navigate]);

  // በጥያቄዎች Title ወይም Description ላይ Search ማድረጊያ Filter
  const filteredQuestions = questions.filter(
    (q) =>
      q.title?.toLowerCase().includes(search.toLowerCase()) ||
      q.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="home__container">
      <div className="home__wrapper">
        {/* Top Header Section */}
        <div className="home__header">
          <button
            className="btn__ask"
            onClick={() => navigate("/ask-question")}
          >
            Ask Question
          </button>
          <h2 className="welcome__user">
            Welcome: <span className="username">{user || "User"}</span>
          </h2>
        </div>

        {/* Search Bar Section */}
        <div className="home__search">
          <input
            type="text"
            placeholder="Search questions by title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Questions Title */}
        <h3 className="questions__title">Questions</h3>

        {/* Loading and Error States */}
        {loading && <div className="loading__text">Loading questions...</div>}
        {error && <div className="alert alert__danger">{error}</div>}

        {/* Questions List */}
        {!loading && !error && (
          <div className="questions__list">
            {filteredQuestions.length === 0 ? (
              <p className="no__questions">No questions found.</p>
            ) : (
              filteredQuestions.map((q) => (
                <div key={q.questionid || q.id} className="question__item">
                  <div className="user__avatar__box">
                    <div className="avatar__icon">👤</div>
                    <span className="question__user">{q.username}</span>
                  </div>

                  <div className="question__content">
                    <Link
                      to={`/questions/${q.questionid || q.id}`}
                      className="question__link"
                    >
                      <p className="question__text">{q.title}</p>
                    </Link>
                  </div>


                  <div className="question__arrow">
                    <Link to={`/questions/${q.questionid || q.id}`}>➔</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;