import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiBookOpen,
  FiLock,
  FiHash,
  FiUserCheck,
  FiChevronDown,
} from "react-icons/fi";

import "../styles/register.css";
import Toast from "../components/Toast";

function Register() {
  const navigate = useNavigate();

  // =========================
  // STUDENT DATA
  // =========================

  const [studentData, setStudentData] = useState({
    id: "",
    name: "",
    email: "",
    branch: "",
    year: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  // =========================
  // PASSWORD VISIBILITY
  // =========================

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================
  // DROPDOWN
  // =========================

  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownRef = useRef(null);

  // =========================
  // TOAST
  // =========================

  const [toast, setToast] = useState(null);

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
  // BRANCH OPTIONS
  // =========================

  const branchOptions = [
    "IT",
    "CSIOT",
    "CE",
    "MECH",
    "AIML",
    "EXTC",
  ];

  // =========================
  // YEAR OPTIONS
  // =========================

  const yearOptions = [
    "FE",
    "SE",
    "TE",
    "BE",
  ];

  // =========================
  // CLOSE DROPDOWN
  // WHEN CLICKING OUTSIDE
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudentData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================
  // GENDER
  // =========================

  const handleGenderChange = (gender) => {
    setStudentData((previousData) => ({
      ...previousData,
      gender,
    }));
  };

  // =========================
  // DROPDOWN TOGGLE
  // =========================

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((previous) =>
      previous === dropdownName
        ? null
        : dropdownName
    );
  };

  // =========================
  // SELECT BRANCH
  // =========================

  const handleBranchSelect = (branch) => {
    setStudentData((previousData) => ({
      ...previousData,
      branch,
    }));

    setOpenDropdown(null);
  };

  // =========================
  // SELECT YEAR
  // =========================

  const handleYearSelect = (year) => {
    setStudentData((previousData) => ({
      ...previousData,
      year,
    }));

    setOpenDropdown(null);
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async () => {
    const {
      id,
      name,
      email,
      branch,
      year,
      gender,
      password,
      confirmPassword,
    } = studentData;

    // =========================
    // EMPTY VALIDATION
    // =========================

    if (
      !id ||
      !name.trim() ||
      !email.trim() ||
      !branch ||
      !year ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      showToast("Please fill all fields");
      return;
    }

    // =========================
    // ID VALIDATION
    // =========================

    if (!/^\d+$/.test(id)) {
      showToast(
        "Student ID must contain numbers only"
      );
      return;
    }

    // =========================
    // NAME VALIDATION
    // =========================

    const nameRegex =
      /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    if (!nameRegex.test(name.trim())) {
      showToast("Please enter a valid name");
      return;
    }

    // =========================
    // EMAIL VALIDATION
    // =========================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      showToast("Please enter a valid email");
      return;
    }

    // =========================
    // PASSWORD LENGTH
    // =========================

    if (password.length < 6) {
      showToast(
        "Password must be at least 6 characters"
      );
      return;
    }

    // =========================
    // CONFIRM PASSWORD
    // =========================

    if (password !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }

    // =========================
    // SEND TO BACKEND
    // =========================

    try {
      const response = await fetch(
        "http://localhost:8080/api/students",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: Number(id),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            branch: branch,
            year: year,
            gender: gender,
            password: password,
          }),
        }
      );

      // =========================
      // READ BACKEND RESPONSE
      // =========================

      const responseText =
        await response.text();

      // =====================================================
      // SUCCESS
      // =====================================================

      if (response.ok) {

        // ===================================================
        // SAVE RECENT ACTIVITY
        // ===================================================

        const newActivity = {
          id: `student-${id}-${Date.now()}`,

          type: "student",

          title: "New Student Registered",

          description: `${name.trim()} registered as a new student`,

          date: new Date().toISOString(),
        };

        // ===================================================
        // GET EXISTING ACTIVITIES
        // ===================================================

        let existingActivities = [];

        try {
          existingActivities = JSON.parse(
            localStorage.getItem(
              "adminActivities"
            ) || "[]"
          );

          if (
            !Array.isArray(
              existingActivities
            )
          ) {
            existingActivities = [];
          }
        } catch (error) {
          console.error(
            "Error reading admin activities:",
            error
          );

          existingActivities = [];
        }

        // ===================================================
        // ADD NEW ACTIVITY AT TOP
        // ===================================================

        const updatedActivities = [
          newActivity,
          ...existingActivities,
        ].slice(0, 20);

        // ===================================================
        // SAVE TO LOCAL STORAGE
        // ===================================================

        localStorage.setItem(
          "adminActivities",
          JSON.stringify(
            updatedActivities
          )
        );

        // ===================================================
        // NOTIFY DASHBOARD
        // ===================================================

        window.dispatchEvent(
          new Event(
            "adminDashboardUpdated"
          )
        );

        // ===================================================
        // SUCCESS TOAST
        // ===================================================

        showToast(
          "Account created successfully!",
          "success"
        );

        // ===================================================
        // GO TO LOGIN
        // ===================================================

        setTimeout(() => {
          navigate("/login");
        }, 1200);

        return;
      }

      // =========================
      // DUPLICATE / CONFLICT
      // =========================

      if (response.status === 409) {
        showToast(responseText);
        return;
      }

      // =========================
      // BAD REQUEST
      // =========================

      if (response.status === 400) {
        showToast(responseText);
        return;
      }

      // =========================
      // OTHER ERROR
      // =========================

      showToast(
        responseText ||
          "Registration failed. Please try again."
      );

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      showToast(
        "Unable to connect to the server."
      );
    }
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="register-container">

      <div className="register-box">

        {/* BOOK ICON */}

        <div className="book-icon">
          📖
        </div>

        {/* TITLE */}

        <h1>
          Create your account
        </h1>

        <p className="register-subtitle">
          Register as a student to access your
          library account
        </p>

        {/* =========================
            STUDENT ID
        ========================= */}

        <div className="input-box">

          <span className="field-icon">
            <FiHash />
          </span>

          <input
            type="text"
            name="id"
            placeholder="Student ID"
            value={studentData.id}
            onChange={handleChange}
          />

        </div>

        {/* =========================
            NAME
        ========================= */}

        <div className="input-box">

          <span className="field-icon">
            <FiUser />
          </span>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={studentData.name}
            onChange={handleChange}
          />

        </div>

        {/* =========================
            EMAIL
        ========================= */}

        <div className="input-box">

          <span className="field-icon">
            <FiMail />
          </span>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={studentData.email}
            onChange={handleChange}
          />

        </div>

        {/* =========================
            CUSTOM DROPDOWNS
        ========================= */}

        <div
          className="custom-dropdown-wrapper"
          ref={dropdownRef}
        >

          {/* =========================
              BRANCH DROPDOWN
          ========================= */}

          <div className="custom-dropdown">

            <button
              type="button"
              className={`custom-dropdown-button ${
                openDropdown === "branch"
                  ? "dropdown-open"
                  : ""
              } ${
                studentData.branch
                  ? "dropdown-selected"
                  : ""
              }`}
              onClick={() =>
                toggleDropdown("branch")
              }
            >

              <span className="dropdown-left">

                <span className="field-icon">
                  <FiBookOpen />
                </span>

                <span className="dropdown-value">
                  {studentData.branch ||
                    "Select Branch"}
                </span>

              </span>

              <FiChevronDown
                className={`dropdown-arrow ${
                  openDropdown === "branch"
                    ? "arrow-up"
                    : ""
                }`}
              />

            </button>

            {openDropdown === "branch" && (
              <div className="custom-dropdown-menu">

                {branchOptions.map(
                  (branchOption) => (
                    <button
                      type="button"
                      key={branchOption}
                      className={`dropdown-option ${
                        studentData.branch ===
                        branchOption
                          ? "option-selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleBranchSelect(
                          branchOption
                        )
                      }
                    >

                      <span>
                        {branchOption}
                      </span>

                      {studentData.branch ===
                        branchOption && (
                        <span className="option-check">
                          ✓
                        </span>
                      )}

                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* =========================
              YEAR DROPDOWN
          ========================= */}

          <div className="custom-dropdown">

            <button
              type="button"
              className={`custom-dropdown-button ${
                openDropdown === "year"
                  ? "dropdown-open"
                  : ""
              } ${
                studentData.year
                  ? "dropdown-selected"
                  : ""
              }`}
              onClick={() =>
                toggleDropdown("year")
              }
            >

              <span className="dropdown-left">

                <span className="field-icon">
                  <FiBookOpen />
                </span>

                <span className="dropdown-value">
                  {studentData.year ||
                    "Select Year"}
                </span>

              </span>

              <FiChevronDown
                className={`dropdown-arrow ${
                  openDropdown === "year"
                    ? "arrow-up"
                    : ""
                }`}
              />

            </button>

            {openDropdown === "year" && (
              <div className="custom-dropdown-menu">

                {yearOptions.map(
                  (yearOption) => (
                    <button
                      type="button"
                      key={yearOption}
                      className={`dropdown-option ${
                        studentData.year ===
                        yearOption
                          ? "option-selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleYearSelect(
                          yearOption
                        )
                      }
                    >

                      <span>
                        {yearOption}
                      </span>

                      {studentData.year ===
                        yearOption && (
                        <span className="option-check">
                          ✓
                        </span>
                      )}

                    </button>
                  )
                )}

              </div>
            )}

          </div>

        </div>

        {/* =========================
            GENDER
        ========================= */}

        <div className="gender-section">

          <div className="gender-title">

            <FiUserCheck />

            <span>
              Select Gender
            </span>

          </div>

          <div className="gender-options">

            {/* MALE */}

            <button
              type="button"
              className={`gender-option ${
                studentData.gender === "Male"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleGenderChange("Male")
              }
            >

              <span className="gender-symbol">
                ♂
              </span>

              <span>
                Male
              </span>

              <span className="gender-check">
                {studentData.gender ===
                "Male"
                  ? "✓"
                  : ""}
              </span>

            </button>

            {/* FEMALE */}

            <button
              type="button"
              className={`gender-option ${
                studentData.gender === "Female"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleGenderChange("Female")
              }
            >

              <span className="gender-symbol">
                ♀
              </span>

              <span>
                Female
              </span>

              <span className="gender-check">
                {studentData.gender ===
                "Female"
                  ? "✓"
                  : ""}
              </span>

            </button>

          </div>

        </div>

        {/* =========================
            PASSWORD
        ========================= */}

        <div className="input-box register-password-box">

          <span className="field-icon">
            <FiLock />
          </span>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            placeholder="Password"
            value={studentData.password}
            onChange={handleChange}
          />

          <button
            type="button"
            className="register-eye-button"
            onClick={() =>
              setShowPassword(
                (previous) => !previous
              )
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >

            {/* HIDDEN = SLASHED EYE
                VISIBLE = OPEN EYE */}

            {showPassword ? (
              <FiEye />
            ) : (
              <FiEyeOff />
            )}

          </button>

        </div>

        {/* =========================
            CONFIRM PASSWORD
        ========================= */}

        <div className="input-box register-password-box">

          <span className="field-icon">
            <FiLock />
          </span>

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            name="confirmPassword"
            placeholder="Confirm Password"
            value={
              studentData.confirmPassword
            }
            onChange={handleChange}
          />

          <button
            type="button"
            className="register-eye-button"
            onClick={() =>
              setShowConfirmPassword(
                (previous) => !previous
              )
            }
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >

            {/* HIDDEN = SLASHED EYE
                VISIBLE = OPEN EYE */}

            {showConfirmPassword ? (
              <FiEye />
            ) : (
              <FiEyeOff />
            )}

          </button>

        </div>

        {/* =========================
            REGISTER BUTTON
        ========================= */}

        <button
          type="button"
          className="register-btn"
          onClick={handleRegister}
        >
          Create Account
          <span>→</span>
        </button>

        {/* =========================
            LOGIN
        ========================= */}

        <p className="login-link">

          Already have an account?{" "}

          <span
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </span>

        </p>

      </div>

      {/* =========================
          TOAST
      ========================= */}

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

export default Register;