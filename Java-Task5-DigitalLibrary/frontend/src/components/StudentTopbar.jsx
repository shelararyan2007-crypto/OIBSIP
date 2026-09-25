import { Bell } from "lucide-react";

import "../styles/studentTopbar.css";

function StudentTopbar({ title = "Dashboard" }) {

  const student = JSON.parse(
    localStorage.getItem("student")
  );

  const studentName =
    student?.name || "Student";

  const firstLetter =
    studentName
      .charAt(0)
      .toUpperCase();

  const openNotifications = () => {
    window.location.href =
      "/student-notifications";
  };

  return (
    <header className="student-topbar">

      {/* =================================================
          LEFT
      ================================================= */}

      <div className="student-topbar-left">

        <p className="student-portal-label">
          Student Portal
        </p>

        <h1>
          {title}
        </h1>

      </div>


      {/* =================================================
          RIGHT
      ================================================= */}

      <div className="student-topbar-right">

        {/* Notification */}

        <button
          className="student-notification-button"
          onClick={openNotifications}
          title="Notifications"
        >

          <Bell
            size={20}
            strokeWidth={1.8}
          />

          <span className="student-notification-dot">
          </span>

        </button>


        {/* Profile */}

        <div className="student-profile-box">

          <div className="student-avatar">
            {firstLetter}
          </div>

          <div className="student-profile-info">

            <h4>
              {studentName}
            </h4>

            <p>
              Student
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default StudentTopbar;