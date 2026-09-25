import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Bell, User, X } from "lucide-react";

import adminConfig from "../config/adminConfig";
import "../styles/topbar.css";
import "../styles/adminProfile.css";

function Topbar({ title }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const closeProfile = () => {
    setShowProfile(false);
    setShowPassword(false);
  };

  return (
    <>
      <header className="top-bar">
        {/* LEFT SIDE */}
        <div className="topbar-title">
          <h1>{title}</h1>
          <p>Library Management System</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="topbar-right">
          {/* Notifications */}
          <button
            className="notification-button"
            title="Notifications"
            type="button"
          >
            <Bell size={21} />
            <span className="notification-dot"></span>
          </button>

          {/* Admin Profile */}
          <button
            className="admin-profile"
            onClick={() => setShowProfile(true)}
            type="button"
          >
            <div className="profile-icon">
              <User size={20} />
            </div>

            <div className="admin-text">
              <span>Welcome,</span>
              <strong>Admin</strong>
            </div>
          </button>
        </div>
      </header>

      {/* ADMIN PROFILE MODAL */}
      {showProfile && (
        <div
          className="admin-profile-overlay"
          onClick={closeProfile}
        >
          <div
            className="admin-profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="profile-modal-close"
              type="button"
              onClick={closeProfile}
              aria-label="Close profile"
            >
              <X size={20} />
            </button>

            {/* Profile Icon */}
            <div className="admin-profile-modal-icon">
              <User size={30} />
            </div>

            <h2>Admin Profile</h2>

            <p className="profile-subtitle">
              Manage your administrator account
            </p>

            {/* Username */}
            <div className="profile-detail">
              <label>Username</label>

              <input
                type="text"
                value={adminConfig.username}
                readOnly
                className="profile-detail-input"
              />
            </div>

            {/* Password */}
            <div className="profile-detail">
              <label>Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminConfig.password}
                  readOnly
                  className="profile-detail-input"
                />

                <button
                  type="button"
                  className="password-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="profile-actions">
              <button
                className="profile-forgot-btn"
                type="button"
                onClick={() =>
                  alert(
                    `Your admin username is: ${adminConfig.username}`
                  )
                }
              >
                Forgot Username?
              </button>

              <button
                className="profile-forgot-btn"
                type="button"
                onClick={() =>
                  alert(
                    "For security, please contact the system administrator to reset the password."
                  )
                }
              >
                Forgot Password?
              </button>
            </div>

            {/* Close */}
            <button
              className="profile-close-btn"
              type="button"
              onClick={closeProfile}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Topbar;