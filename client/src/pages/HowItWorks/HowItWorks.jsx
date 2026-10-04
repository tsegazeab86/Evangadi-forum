import React from "react";
import { Link } from "react-router-dom";
import "./HowItWorks.css";

function HowItWorks() {
  return (
    <section className="howitworks__container">
      <div className="howitworks__wrapper">
        {/* Header Section */}
        <div className="howitworks__header">
          <h2>How Evangadi Forum Works</h2>
          <p>
            Evangadi Forum is a collaborative platform designed for students and developers to ask questions, share knowledge, and learn together.
          </p>
        </div>

        {/* Steps Section */}
        <div className="steps__container">
          {/* Step 1 */}
          <div className="step__card">
            <div className="step__number">1</div>
            <h3>Create an Account</h3>
            <p>
              Sign up with your details to join the community. Once registered, you can log in and access all forum features.
            </p>
            <Link to="/register" className="step__link">
              Create Account &rarr;
            </Link>
          </div>

          {/* Step 2 */}
          <div className="step__card">
            <div className="step__number">2</div>
            <h3>Ask Questions</h3>
            <p>
              Stuck on a bug or coding challenge? Post your question with a detailed explanation and title to get help from peers.
            </p>
            <Link to="/ask-question" className="step__link">
              Ask a Question &rarr;
            </Link>
          </div>

          {/* Step 3 */}
          <div className="step__card">
            <div className="step__number">3</div>
            <h3>Answer & Learn</h3>
            <p>
              Browse existing questions, share your expertise by answering others, and learn from solutions posted by fellow developers.
            </p>
            <Link to="/" className="step__link">
              Browse Questions &rarr;
            </Link>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="howitworks__cta">
          <h3>Ready to get started?</h3>
          <p>Join the Evangadi developer community today.</p>
          <div className="cta__buttons">
            <Link to="/register" className="btn__primary">
              Join Now
            </Link>
            <Link to="/login" className="btn__secondary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;