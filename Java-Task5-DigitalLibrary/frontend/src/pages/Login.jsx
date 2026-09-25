import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import "../styles/login.css";
import adminConfig from "../config/adminConfig";
import Toast from "../components/Toast";

function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [adminMode, setAdminMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // =========================
  // TOAST
  // =========================

  const showToast = (message, type = "error") => {
    setToast({
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast(null);
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {
    // =====================================================
    // ADMIN LOGIN
    // =====================================================

    if (adminMode) {
      const user = username.trim();
      const pass = password;

      if (!user && !pass) {
        return showToast("Please enter your login details");
      }

      if (!user) {
        return showToast("Please enter username");
      }

      if (!pass) {
        return showToast("Please enter password");
      }

      const validUser = user === adminConfig.username;
      const validPass = pass === adminConfig.password;

      if (!validUser && !validPass) {
        return showToast("Invalid username and password");
      }

      if (!validUser) {
        return showToast("Invalid username");
      }

      if (!validPass) {
        return showToast("Invalid password");
      }

      localStorage.setItem("isAdminLoggedIn", "true");

      showToast("Admin login successful!", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

      return;
    }

    // =====================================================
    // STUDENT LOGIN
    // =====================================================

    const studentEmail = email.trim();
    const studentPassword = password;

    if (!studentEmail && !studentPassword) {
      return showToast("Please enter your login details");
    }

    if (!studentEmail) {
      return showToast("Please enter email");
    }

    if (!studentPassword) {
      return showToast("Please enter password");
    }

    // =====================================================
    // SEND LOGIN REQUEST TO SPRING BOOT
    // =====================================================

    try {
      const response = await fetch(
        "http://localhost:8080/api/students/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: studentEmail,
            password: studentPassword,
          }),
        }
      );

      // ===================================================
      // INVALID LOGIN
      // ===================================================

      if (!response.ok) {
        if (response.status === 401) {
          return showToast("Invalid email or password");
        }

        if (response.status === 404) {
          return showToast(
            "Login service not found. Check StudentController."
          );
        }

        if (response.status >= 500) {
          return showToast(
            "Server error. Please try again."
          );
        }

        return showToast(
          "Unable to login. Please try again."
        );
      }

      // ===================================================
      // GET STUDENT DATA
      // ===================================================

      const student = await response.json();

      if (!student) {
        return showToast("Invalid email or password");
      }

      // ===================================================
      // SAVE STUDENT LOGIN
      // ===================================================

      localStorage.setItem(
        "studentLoggedIn",
        "true"
      );

      localStorage.setItem(
        "student",
        JSON.stringify(student)
      );

      // ===================================================
      // SUCCESS
      // ===================================================

      showToast(
        "Login successful!",
        "success"
      );

      // ===================================================
      // GO TO STUDENT DASHBOARD
      // ===================================================

      setTimeout(() => {
        navigate("/student-dashboard");
      }, 700);

    } catch (error) {
      console.error(
        "Student login error:",
        error
      );

      showToast(
        "Unable to connect to server"
      );
    }
  };

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="login-container">

      <div className="login-box">

        {/* BOOK ICON */}
        <div className="book-icon">
          📖
        </div>

        {/* TITLE */}
        <h1>
          Log In to your
        </h1>

        <h2>
          <span>
            Library Management System
          </span>
        </h2>

        <p className="login-subtitle">
          Access your library account and stay updated
        </p>

        {/* =================================================
            STUDENT LOGIN
        ================================================= */}

        {!adminMode ? (
          <>
            {/* EMAIL */}

            <div className="input-box">

              <span>
                ✉
              </span>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            {/* PASSWORD */}

            <div className="input-box password-input-box">

              <span>
                🔑
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="password-eye-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <Eye size={19} />
                ) : (
                  <EyeOff size={19} />
                )}
              </button>

            </div>

            {/* FORGOT PASSWORD */}

            <div className="forgot">
              Forgot Password?
            </div>

            {/* LOGIN BUTTON */}

            <button
              className="login-btn"
              onClick={handleLogin}
            >
              Log In
              <span>
                →
              </span>
            </button>

            {/* DIVIDER */}

            <div className="divider">
              <span>
                OR
              </span>
            </div>

            {/* ADMIN LOGIN */}

            <button
              className="admin-btn"
              onClick={() => {
                setAdminMode(true);
                setEmail("");
                setPassword("");
                setShowPassword(false);
              }}
            >
              🛡️ Login as Admin
            </button>

            {/* REGISTER */}

            <p className="register">

              New here?{" "}

              <span
                onClick={() =>
                  navigate("/register")
                }
              >
                Register a new account
              </span>

            </p>
          </>
        ) : (

          /* =================================================
             ADMIN LOGIN
          ================================================= */

          <>
            <div className="admin-title">
              Admin Login
            </div>

            {/* USERNAME */}

            <div className="input-box">

              <span>
                👤
              </span>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />

            </div>

            {/* PASSWORD */}

            <div className="input-box password-input-box">

              <span>
                🔑
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="password-eye-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <Eye size={19} />
                ) : (
                  <EyeOff size={19} />
                )}
              </button>

            </div>

            {/* ADMIN LOGIN BUTTON */}

            <button
              className="login-btn"
              onClick={handleLogin}
            >
              Admin Login
              <span>
                →
              </span>
            </button>

            {/* BACK BUTTON */}

            <button
              className="back-btn"
              onClick={() => {
                setAdminMode(false);
                setUsername("");
                setPassword("");
                setShowPassword(false);
              }}
            >
              ← Back to Student Login
            </button>
          </>
        )}

      </div>

      {/* TOAST */}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

    </div>
  );
}

export default Login;