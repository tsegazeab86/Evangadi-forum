import React, { useState } from "react";
import axios from "../../axiosConfig";  
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  // 1. Form States
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  // 2. Hide/Show Password State
  const [showPassword, setShowPassword] = useState(false);

  // 3. Error and Loading States
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { username, firstname, lastname, email, password } = formData;

    // Client-side Validation
    if (!username || !firstname || !lastname || !email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    try {
      setIsLoading(true);

      await axios.post("/users/register", {
        username,
        firstname,
        lastname,
        email,
        password,
      });

      alert("Registration successful! Please login to continue.");

      navigate("/login");
    } catch (error) {
      const msg =
        error.response?.data?.msg || "Registration failed. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Join the Network</h2>
        <p style={styles.subTitle}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        {/* Error Alert */}
        {errorMessage && <div style={styles.errorAlert}>{errorMessage}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* First Name & Last Name (Row) */}
          <div style={styles.rowGroup}>
            <input
              type="text"
              name="firstname"
              placeholder="First name"
              value={formData.firstname}
              onChange={handleChange}
              style={{ ...styles.input, flex: 1 }}
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last name"
              value={formData.lastname}
              onChange={handleChange}
              style={{ ...styles.input, flex: 1 }}
              required
            />
          </div>

          {/* Username Input */}
          <div style={styles.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Password Input with Hide/Show Icon */}
          <div style={styles.inputGroup}>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={styles.passwordInput}
                required
              />
              <span
                onClick={togglePasswordVisibility}
                style={styles.eyeIcon}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? "Agree and Join..." : "Agree and Join"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "85vh",
    backgroundColor: "#9eb7d0",
    padding: "20px",
  },
  card: {
    backgroundColor: "#bc6262",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "480px",
    width: "100%",
  },
  subTitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#555",
  },
  errorAlert: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    fontSize: "14px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  rowGroup: {
    display: "flex",
    gap: "10px",
  },
  input: {
    padding: "12px",
    fontSize: "15px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "12px",
    paddingRight: "40px",
    fontSize: "15px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
  },
  eyeIcon: {
    position: "absolute",
    right: "12px",
    cursor: "pointer",
    color: "#666",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#fe8402", // Evangadi theme Orange/Yellow
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default Register;