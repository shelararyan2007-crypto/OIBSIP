import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  LayoutDashboard,
  History,
  Bell,
  User,
  LogOut,
} from "lucide-react";

import "../styles/studentSidebar.css";

function StudentSidebar({ activePage }) {

  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);

  // =========================================================
  // GET NOTIFICATION COUNT
  // =========================================================

  const fetchNotificationCount = () => {

    try {

      const savedNotifications = JSON.parse(
        localStorage.getItem("studentNotifications") || "[]"
      );

      if (!Array.isArray(savedNotifications)) {
        setNotificationCount(0);
        return;
      }

      const unreadCount = savedNotifications.filter(
        (notification) => !notification.read
      ).length;

      setNotificationCount(unreadCount);

    } catch (error) {

      console.error(
        "Notification count error:",
        error
      );

      setNotificationCount(0);
    }
  };

  // =========================================================
  // LOAD + WATCH NOTIFICATIONS
  // =========================================================

  useEffect(() => {

    fetchNotificationCount();

    // Check for changes every second
    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 1000);

    return () => {
      clearInterval(interval);
    };

  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem("studentLoggedIn");
    localStorage.removeItem("student");

    navigate("/login");
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (path) => {
    navigate(path);
  };

  // =========================================================
  // UI
  // =========================================================

  return (

    <aside className="student-sidebar">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="student-sidebar-logo">

        <div className="student-sidebar-logo-icon">
          <BookOpen size={25} />
        </div>

        <div className="student-sidebar-logo-text">

          <h2>
            LIBRARY
          </h2>

          <span>
            STUDENT PORTAL
          </span>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="student-sidebar-nav">

        {/* DASHBOARD */}

        <button
          type="button"
          className={
            activePage === "Dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            handleNavigation(
              "/student-dashboard"
            )
          }
        >

          <LayoutDashboard size={19} />

          <span>
            Dashboard
          </span>

        </button>


        {/* AVAILABLE BOOKS */}

        <button
          type="button"
          className={
            activePage === "Available Books"
              ? "active"
              : ""
          }
          onClick={() =>
            handleNavigation(
              "/student-books"
            )
          }
        >

          <BookOpen size={19} />

          <span>
            Available Books
          </span>

        </button>


        {/* HISTORY */}

        <button
          type="button"
          className={
            activePage === "History"
              ? "active"
              : ""
          }
          onClick={() =>
            handleNavigation(
              "/student-history"
            )
          }
        >

          <History size={19} />

          <span>
            History
          </span>

        </button>


        {/* NOTIFICATIONS */}

        <button
          type="button"
          className={
            activePage === "Notifications"
              ? "active"
              : ""
          }
          onClick={() =>
            handleNavigation(
              "/student-notifications"
            )
          }
        >

          <Bell size={19} />

          <span>
            Notifications
          </span>

          {/* NOTIFICATION COUNT */}

          {notificationCount > 0 && (

            <span className="student-notification-badge">

              {notificationCount > 99
                ? "99+"
                : notificationCount}

            </span>

          )}

        </button>


        {/* PROFILE */}

        <button
          type="button"
          className={
            activePage === "Profile"
              ? "active"
              : ""
          }
          onClick={() =>
            handleNavigation(
              "/student-profile"
            )
          }
        >

          <User size={19} />

          <span>
            Profile
          </span>

        </button>

      </nav>


      {/* =====================================================
          SIDEBAR BOTTOM
      ===================================================== */}

      <div className="student-sidebar-bottom">

        <button
          type="button"
          className="student-sidebar-logout"
          onClick={handleLogout}
        >

          <LogOut size={19} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>

  );
}

export default StudentSidebar;