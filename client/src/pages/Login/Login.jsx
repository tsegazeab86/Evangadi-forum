import React, { useState } from "react";
import axios from "../../axiosConfig"; // የራስህን Axios config path እዚህ አስተካክል
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  // 1. Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2. Hide/Show password state
  const [showPassword, setShowPassword] = useState(false);

  // 3. Error and Loading states
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility switch
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic Validation
    if (!email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);

      // Backend endpoint ጥሪ (Post request)
      const response = await axios.post("/users/login", {
        email,
        password,
      });

      // Token-ኡን በ LocalStorage ውስጥ ማስቀመጥ
      localStorage.setItem("token", response.data.token);

      alert("Login Successful!");

      // ወደ Home page መምራት
      navigate("/");
    } catch (error) {
      // Error handling
      const msg =
        error.response?.data?.msg || "Login failed. Please check your credentials.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login to your account</h2>
        <p style={styles.subTitle}>
          Don't have an account? <Link to="/register">Create a new account</Link>
        </p>

        {/* Error Message የማሳያ ክፍል */}
        {errorMessage && <div style={styles.errorAlert}>{errorMessage}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Password Input with Hide/Show Icon */}
          <div style={styles.inputGroup}>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

 const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "450px",
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
    backgroundColor: "#5146d6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default Login;