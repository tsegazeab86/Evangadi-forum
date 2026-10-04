import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import userAvatar from "../../assets/images/e.jpg";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

   const handleAuthAction = () => {
    if (token) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="header__container">
      <div className="header__wrapper">
        {/* Logo Section */}
        <div className="header__logo">
          <Link to="/">
            <img src={userAvatar} alt="Evangadi Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="header__nav">
          <Link to="/" className="nav__link">
            Home
          </Link>
          <Link to="/how-it-works" className="nav__link">
            How it Works
          </Link>

          <button className="btn__auth" onClick={handleAuthAction}>
            {token ? "SIGN OUT" : "SIGN IN"}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
