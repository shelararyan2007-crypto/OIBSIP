import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  BookOpen,
  Hash,
  ShieldCheck,
  Pencil,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import StudentSidebar from "../components/StudentSidebar";
import Toast from "../components/Toast";
import "../styles/studentProfile.css";

function StudentProfile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  // =========================
  // MODAL STATES
  // =========================

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // =========================
  // EMAIL
  // =========================

  const [newEmail, setNewEmail] = useState("");

  // =========================
  // PASSWORD
  // =========================

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  // LOAD STUDENT
  // =========================

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");

    if (savedStudent) {
      const studentData = JSON.parse(savedStudent);

      setStudent(studentData);
      setNewEmail(studentData.email || "");
    }
  }, []);

  // =========================
  // UPDATE EMAIL
  // =========================

  const handleUpdateEmail = async () => {
    if (!student) return;

    const email = newEmail.trim();

    if (!email) {
      showToast("Email cannot be empty");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/students/${student.id}/email`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to update email"
        );
      }

      const updatedStudent = await response.json();

      // Update localStorage
      localStorage.setItem(
        "student",
        JSON.stringify(updatedStudent)
      );

      // Update screen
      setStudent(updatedStudent);

      // Close popup
      setShowEmailModal(false);

      showToast(
        "Email updated successfully!",
        "success"
      );
    } catch (error) {
      console.error("Email update error:", error);

      showToast(
        error.message || "Failed to update email"
      );
    }
  };

  // =========================
  // UPDATE PASSWORD
  // =========================

  const handleUpdatePassword = async () => {
    if (!student) return;

    if (!newPassword) {
      showToast("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      showToast(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (!confirmPassword) {
      showToast("Please confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/students/${student.id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to update password"
        );
      }

      const updatedStudent = await response.json();

      // Update localStorage
      localStorage.setItem(
        "student",
        JSON.stringify(updatedStudent)
      );

      // Update student state
      setStudent(updatedStudent);

      // Clear fields
      setNewPassword("");
      setConfirmPassword("");

      // Close popup
      setShowPasswordModal(false);

      showToast(
        "Password updated successfully!",
        "success"
      );
    } catch (error) {
      console.error(
        "Password update error:",
        error
      );

      showToast(
        error.message ||
          "Failed to update password"
      );
    }
  };

  // =========================
  // CLOSE PASSWORD MODAL
  // =========================

  const closePasswordModal = () => {
    setShowPasswordModal(false);

    setNewPassword("");
    setConfirmPassword("");

    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // =========================
  // CLOSE EMAIL MODAL
  // =========================

  const closeEmailModal = () => {
    setShowEmailModal(false);

    if (student) {
      setNewEmail(student.email || "");
    }
  };

  // =========================
  // NO STUDENT
  // =========================

  if (!student) {
    return (
      <div className="student-dashboard">
        <StudentSidebar activePage="Profile" />

        <main className="student-main">
          <div className="profile-loading">
            Loading profile...
          </div>
        </main>
      </div>
    );
  }

  const studentName = student.name || "Student";

  return (
    <div className="student-dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <StudentSidebar activePage="Profile" />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="student-main">

        {/* =========================
            HEADER
        ========================= */}

        <div className="profile-page-header">

          <div className="profile-header-left">

            <p className="profile-small-title">
              Student Portal
            </p>

            <h1>My Profile</h1>

            <p className="profile-description">
              Manage your personal information and
              account security.
            </p>

          </div>

          <button
            className="dashboard-back-button"
            onClick={() =>
              navigate("/student-dashboard")
            }
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

        </div>

        {/* =========================
            PROFILE HERO
        ========================= */}

        <section className="profile-hero">

          <div className="profile-avatar-large">
            {studentName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-hero-info">

            <h2>{studentName}</h2>

            <p>
              Student ID: {student.id}
            </p>

            <span className="student-role">
              Student
            </span>

          </div>

        </section>

        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>

              <h3>Personal Information</h3>

              <p>
                Your registered library account
                information
              </p>

            </div>

            <User
              size={25}
              strokeWidth={1.8}
            />

          </div>

          <div className="profile-divider"></div>

          <div className="profile-info-grid">

            {/* STUDENT ID */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <Hash size={21} />
              </div>

              <div>
                <span>Student ID</span>

                <strong>
                  {student.id}
                </strong>
              </div>

            </div>

            {/* FULL NAME */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <User size={21} />
              </div>

              <div>
                <span>Full Name</span>

                <strong>
                  {student.name}
                </strong>
              </div>

            </div>

            {/* EMAIL */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <Mail size={21} />
              </div>

              <div className="profile-email-content">

                <span>Email Address</span>

                <strong>
                  {student.email}
                </strong>

              </div>

              <button
                className="change-button"
                onClick={() =>
                  setShowEmailModal(true)
                }
              >
                <Pencil size={15} />
                Change
              </button>

            </div>

            {/* GENDER */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <User size={21} />
              </div>

              <div>

                <span>Gender</span>

                <strong>
                  {student.gender || "-"}
                </strong>

              </div>

            </div>

            {/* BRANCH */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <BookOpen size={21} />
              </div>

              <div>

                <span>Branch</span>

                <strong>
                  {student.branch ||
                    student.course ||
                    "-"}
                </strong>

              </div>

            </div>

            {/* YEAR */}

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <BookOpen size={21} />
              </div>

              <div>

                <span>Year</span>

                <strong>
                  {student.year || "-"}
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            ACCOUNT SECURITY
        ========================= */}

        <section className="profile-card security-card">

          <div className="profile-card-header">

            <div>

              <h3>Account Security</h3>

              <p>
                Keep your library account secure
              </p>

            </div>

            <ShieldCheck
              size={25}
              strokeWidth={1.8}
            />

          </div>

          <div className="profile-divider"></div>

          <div className="security-row">

            <div className="security-icon">
              <Lock size={21} />
            </div>

            <div className="security-info">

              <span>Password</span>

              <strong>
                ••••••••
              </strong>

            </div>

            <button
              className="change-button"
              onClick={() =>
                setShowPasswordModal(true)
              }
            >
              <Pencil size={15} />
              Change Password
            </button>

          </div>

        </section>

        {/* =========================
            EMAIL MODAL
        ========================= */}

        {showEmailModal && (

          <div className="profile-modal-overlay">

            <div className="profile-modal">

              <button
                className="modal-close-button"
                onClick={closeEmailModal}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="modal-icon email-modal-icon">
                <Mail size={25} />
              </div>

              <h2>Change Email</h2>

              <p className="modal-description">
                Update the email address associated
                with your library account.
              </p>

              <label>
                New Email Address
              </label>

              <div className="modal-input-wrapper">

                <Mail size={19} />

                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) =>
                    setNewEmail(e.target.value)
                  }
                  placeholder="Enter new email"
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={closeEmailModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="modal-save-button"
                  onClick={handleUpdateEmail}
                >
                  <CheckCircle2 size={17} />
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        )}

        {/* =========================
            PASSWORD MODAL
        ========================= */}

        {showPasswordModal && (

          <div className="profile-modal-overlay">

            <div className="profile-modal password-modal">

              <button
                className="modal-close-button"
                onClick={closePasswordModal}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="modal-icon password-modal-icon">
                <Lock size={25} />
              </div>

              <h2>Change Password</h2>

              <p className="modal-description">
                Create a new password for your
                library account.
              </p>

              {/* NEW PASSWORD */}

              <label>
                New Password
              </label>

              <div className="modal-input-wrapper">

                <Lock size={19} />

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  className="password-eye-button"
                  onClick={() =>
                    setShowNewPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showNewPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showNewPassword ? (
                    <Eye size={19} />
                  ) : (
                    <EyeOff size={19} />
                  )}
                </button>

              </div>

              {/* CONFIRM PASSWORD */}

              <label>
                Confirm Password
              </label>

              <div className="modal-input-wrapper">

                <Lock size={19} />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  className="password-eye-button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <Eye size={19} />
                  ) : (
                    <EyeOff size={19} />
                  )}
                </button>

              </div>

              <p className="password-hint">
                Password must contain at least
                6 characters.
              </p>

              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={closePasswordModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="modal-save-button"
                  onClick={handleUpdatePassword}
                >
                  <CheckCircle2 size={17} />
                  Update Password
                </button>

              </div>

            </div>

          </div>

        )}

      </main>

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

export default StudentProfile;