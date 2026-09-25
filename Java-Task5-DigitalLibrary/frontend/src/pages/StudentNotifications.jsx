import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  BookOpen,
  CheckCircle,
  Check,
} from "lucide-react";

import StudentSidebar from "../components/StudentSidebar";
import "../styles/studentNotifications.css";

function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);

  const student = JSON.parse(
    localStorage.getItem("student") || "null"
  );

  // ==========================================
  // LOAD STUDENT-SPECIFIC NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("studentNotifications") || "[]"
    );

    // Show only notifications belonging to this student
    const studentNotifications = savedNotifications.filter(
      (notification) =>
        Number(notification.studentId) === Number(student?.id)
    );

    setNotifications(studentNotifications);
  }, [student?.id]);

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const markAllAsRead = () => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("studentNotifications") || "[]"
    );

    const updatedAllNotifications = savedNotifications.map(
      (notification) =>
        Number(notification.studentId) === Number(student?.id)
          ? { ...notification, read: true }
          : notification
    );

    localStorage.setItem(
      "studentNotifications",
      JSON.stringify(updatedAllNotifications)
    );

    const updatedStudentNotifications =
      updatedAllNotifications.filter(
        (notification) =>
          Number(notification.studentId) === Number(student?.id)
      );

    setNotifications(updatedStudentNotifications);

    window.dispatchEvent(
      new Event("studentNotificationsUpdated")
    );
  };

  // ==========================================
  // MARK SINGLE NOTIFICATION AS READ
  // ==========================================

  const markAsRead = (id) => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("studentNotifications") || "[]"
    );

    const updatedAllNotifications = savedNotifications.map(
      (notification) =>
        notification.id === id &&
        Number(notification.studentId) === Number(student?.id)
          ? { ...notification, read: true }
          : notification
    );

    localStorage.setItem(
      "studentNotifications",
      JSON.stringify(updatedAllNotifications)
    );

    const updatedStudentNotifications =
      updatedAllNotifications.filter(
        (notification) =>
          Number(notification.studentId) === Number(student?.id)
      );

    setNotifications(updatedStudentNotifications);

    window.dispatchEvent(
      new Event("studentNotificationsUpdated")
    );
  };

  // ==========================================
  // NOTIFICATION ICON
  // ==========================================

  const getNotificationIcon = (type) => {
    if (type === "due") {
      return <CalendarDays size={19} />;
    }

    if (type === "issued") {
      return <BookOpen size={19} />;
    }

    if (type === "returned") {
      return <CheckCircle size={19} />;
    }

    return <Bell size={19} />;
  };

  // ==========================================
  // NOTIFICATION COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="student-dashboard">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <StudentSidebar
        activePage="Notifications"
        notificationCount={unreadCount}
      />

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="student-main">

        {/* ====================================
            TOP BAR
        ==================================== */}

        <div className="student-notification-topbar">

          <div>
            <p>Student Portal</p>
            <h1>Notifications</h1>
          </div>

          {/* STUDENT PROFILE */}

          <div className="student-notification-profile">

            <div className="student-notification-avatar">
              {student?.name
                ?.charAt(0)
                .toUpperCase() || "S"}
            </div>

            <div>
              <h4>
                {student?.name || "Student"}
              </h4>

              <span>Student</span>
            </div>

          </div>

        </div>

        {/* ====================================
            NOTIFICATION HEADER
        ==================================== */}

        <div className="notification-header">

          <div className="notification-heading">

            <div className="notification-heading-icon">
              <Bell size={21} />
            </div>

            <div>
              <h2>Library Notifications</h2>

              <p>
                Stay updated with your library activities.
              </p>
            </div>

          </div>

          {/* MARK ALL AS READ */}

          {unreadCount > 0 && (
            <button
              className="mark-all-read-btn"
              onClick={markAllAsRead}
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}

        </div>

        {/* ====================================
            NOTIFICATIONS CARD
        ==================================== */}

        <div className="notifications-card">

          {notifications.length > 0 ? (

            notifications.map((notification) => (

              <div
                key={notification.id}
                className={`notification-item ${
                  notification.read
                    ? "notification-read"
                    : "notification-unread"
                }`}
              >

                {/* ICON */}

                <div
                  className={`notification-icon ${
                    notification.type
                  }`}
                >
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                {/* CONTENT */}

                <div className="notification-content">

                  <div className="notification-title-row">

                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="unread-dot"></span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <span className="notification-date">
                    {notification.date}
                  </span>

                </div>

                {/* READ BUTTON */}

                {!notification.read && (
                  <button
                    className="notification-read-btn"
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                    title="Mark as read"
                  >
                    <Check size={15} />
                  </button>
                )}

              </div>

            ))

          ) : (

            <div className="notification-empty">

              <div className="notification-empty-icon">
                <Bell size={30} />
              </div>

              <h3>No notifications</h3>

              <p>
                You're all caught up!
              </p>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default StudentNotifications;