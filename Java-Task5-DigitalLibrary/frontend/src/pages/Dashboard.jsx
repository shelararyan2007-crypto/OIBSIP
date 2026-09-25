import { useEffect, useState } from "react";
import {
  BookOpen,
  Library,
  GraduationCap,
  RotateCcw,
  AlertTriangle,
  Clock3,
  UserPlus,
  Plus,
  ArrowRight,
  BookPlus,
  ClipboardPlus,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

function Dashboard() {
  const [data, setData] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    returnedBooks: 0,
    students: 0,
    overdueBooks: 0,
  });

  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // =====================================================
  // ACTIVITY ICON
  // =====================================================

  const getActivityIcon = (type) => {
    switch (type) {
      case "issued":
        return <BookOpen size={18} />;

      case "returned":
        return <RotateCcw size={18} />;

      case "student":
      case "registered":
        return <UserPlus size={18} />;

      case "book":
      case "added":
        return <BookPlus size={18} />;

      default:
        return <Clock3 size={18} />;
    }
  };

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  const loadDashboardData = async () => {
    try {
      const [booksRes, issuesRes, studentsRes] =
        await Promise.all([
          fetch("http://localhost:8080/api/books"),
          fetch("http://localhost:8080/api/issues"),
          fetch("http://localhost:8080/api/students"),
        ]);

      if (
        !booksRes.ok ||
        !issuesRes.ok ||
        !studentsRes.ok
      ) {
        throw new Error(
          "Failed to load dashboard data"
        );
      }

      const [books, issues, students] =
        await Promise.all([
          booksRes.json(),
          issuesRes.json(),
          studentsRes.json(),
        ]);

      // ===================================================
      // ISSUED / RETURNED
      // ===================================================

      const issued = issues.filter(
        (issue) =>
          String(issue.status).toLowerCase() ===
          "issued"
      );

      const returned = issues.filter(
        (issue) =>
          String(issue.status).toLowerCase() ===
          "returned"
      );

      // ===================================================
      // TODAY
      // ===================================================

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      // ===================================================
      // OVERDUE
      // ===================================================

      const overdue = issued.filter((issue) => {
        if (!issue.returnDate) {
          return false;
        }

        const returnDate = new Date(
          issue.returnDate
        );

        returnDate.setHours(0, 0, 0, 0);

        return returnDate < today;
      });

      // ===================================================
      // DASHBOARD COUNTS
      // ===================================================

      setData({
        totalBooks: books.length,

        availableBooks: books.reduce(
          (sum, book) =>
            sum + Number(book.quantity || 0),
          0
        ),

        issuedBooks: issued.length,

        returnedBooks: returned.length,

        students: students.length,

        overdueBooks: overdue.length,
      });

      // =====================================================
      // RECENT ACTIVITIES
      // =====================================================

      const generatedActivities = [];

      // -----------------------------------------------------
      // BOOK ISSUED
      // -----------------------------------------------------

      issued.forEach((issue) => {
        generatedActivities.push({
          id: `issued-${issue.id}`,

          type: "issued",

          title: "Book Issued",

          description: `${
            issue.bookName || "Book"
          } issued to ${
            issue.studentName ||
            `Student #${issue.studentId}`
          }`,

          date: issue.issueDate
            ? new Date(issue.issueDate)
            : new Date(0),
        });
      });

      // -----------------------------------------------------
      // BOOK RETURNED
      // -----------------------------------------------------

      returned.forEach((issue) => {
        generatedActivities.push({
          id: `returned-${issue.id}`,

          type: "returned",

          title: "Book Returned",

          description: `${
            issue.bookName || "Book"
          } returned by ${
            issue.studentName ||
            `Student #${issue.studentId}`
          }`,

          date: issue.actualReturnDate
            ? new Date(issue.actualReturnDate)
            : new Date(
                issue.returnDate || 0
              ),
        });
      });

      // -----------------------------------------------------
      // SAVED ADMIN ACTIVITIES
      // -----------------------------------------------------

      let savedActivities = [];

      try {
        const storedActivities =
          localStorage.getItem(
            "adminActivities"
          );

        savedActivities = JSON.parse(
          storedActivities || "[]"
        );

        if (
          !Array.isArray(
            savedActivities
          )
        ) {
          savedActivities = [];
        }
      } catch (error) {
        console.error(
          "Error reading admin activities:",
          error
        );

        savedActivities = [];
      }

      // -----------------------------------------------------
      // NORMALIZE SAVED ACTIVITIES
      // -----------------------------------------------------

      const normalizedSavedActivities =
        savedActivities
          .filter((activity) => activity)
          .map((activity) => ({
            ...activity,

            type:
              activity.type ||
              "default",

            title:
              activity.title ||
              "Library Activity",

            description:
              activity.description ||
              "",

            date: activity.date
              ? new Date(activity.date)
              : new Date(0),
          }));

      // -----------------------------------------------------
      // COMBINE ACTIVITIES
      // -----------------------------------------------------

      const allActivities = [
        ...normalizedSavedActivities,
        ...generatedActivities,
      ];

      // -----------------------------------------------------
      // REMOVE DUPLICATES
      // -----------------------------------------------------

      const uniqueActivities = Array.from(
        new Map(
          allActivities.map(
            (activity) => [
              activity.id,
              activity,
            ]
          )
        ).values()
      );

      // -----------------------------------------------------
      // REMOVE INVALID DATES
      // -----------------------------------------------------

      const validActivities =
        uniqueActivities.filter(
          (activity) =>
            activity.date &&
            !isNaN(
              activity.date.getTime()
            )
        );

      // -----------------------------------------------------
      // SORT NEWEST FIRST
      // -----------------------------------------------------

      validActivities.sort(
        (a, b) =>
          b.date.getTime() -
          a.date.getTime()
      );

      // -----------------------------------------------------
      // SHOW ONLY 4
      // -----------------------------------------------------

      setActivities(
        validActivities.slice(0, 4)
      );

      // =====================================================
      // ALERTS
      // =====================================================

      const newAlerts = [];

      // -----------------------------------------------------
      // OVERDUE
      // -----------------------------------------------------

      if (overdue.length > 0) {
        newAlerts.push({
          type: "danger",

          icon: (
            <AlertTriangle size={18} />
          ),

          text: `${overdue.length} overdue ${
            overdue.length === 1
              ? "book"
              : "books"
          }`,
        });
      }

      // -----------------------------------------------------
      // DUE TODAY
      // -----------------------------------------------------

      const dueToday = issued.filter(
        (issue) => {
          if (!issue.returnDate) {
            return false;
          }

          const returnDate = new Date(
            issue.returnDate
          );

          returnDate.setHours(0, 0, 0, 0);

          return (
            returnDate.getTime() ===
            today.getTime()
          );
        }
      );

      if (dueToday.length > 0) {
        newAlerts.push({
          type: "warning",

          icon: (
            <Clock3 size={18} />
          ),

          text: `${dueToday.length} ${
            dueToday.length === 1
              ? "book is"
              : "books are"
          } due today`,
        });
      }

      // -----------------------------------------------------
      // LOW STOCK
      // -----------------------------------------------------

      const lowStockBooks =
        books.filter((book) => {
          const quantity = Number(
            book.quantity || 0
          );

          return (
            quantity > 0 &&
            quantity <= 2
          );
        });

      if (lowStockBooks.length > 0) {
        newAlerts.push({
          type: "info",

          icon: (
            <BookOpen size={18} />
          ),

          text: `${lowStockBooks.length} ${
            lowStockBooks.length === 1
              ? "book has"
              : "books have"
          } low stock`,
        });
      }

      // -----------------------------------------------------
      // NO ALERTS
      // -----------------------------------------------------

      if (newAlerts.length === 0) {
        newAlerts.push({
          type: "success",

          icon: (
            <BookOpen size={18} />
          ),

          text:
            "No alerts. Everything looks good.",
        });
      }

      setAlerts(newAlerts);
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    }
  };

  // =====================================================
  // INITIAL LOAD + EVENTS
  // =====================================================

  useEffect(() => {
    loadDashboardData();

    window.addEventListener(
      "focus",
      loadDashboardData
    );

    window.addEventListener(
      "adminDashboardUpdated",
      loadDashboardData
    );

    return () => {
      window.removeEventListener(
        "focus",
        loadDashboardData
      );

      window.removeEventListener(
        "adminDashboardUpdated",
        loadDashboardData
      );
    };
  }, []);

  // =====================================================
  // STATISTIC CARDS
  // =====================================================

  const cards = [
    {
      icon: <Library size={25} />,
      title: "Total Books",
      value: data.totalBooks,
      description: "Books in library",
      className: "blue",
    },

    {
      icon: <BookOpen size={25} />,
      title: "Available Books",
      value: data.availableBooks,
      description: "Books available",
      className: "green",
    },

    {
      icon: <BookOpen size={25} />,
      title: "Issued Books",
      value: data.issuedBooks,
      description: "Currently issued",
      className: "purple",
    },

    {
      icon: <RotateCcw size={25} />,
      title: "Returned Books",
      value: data.returnedBooks,
      description: "Books returned",
      className: "orange",
    },

    {
      icon: <GraduationCap size={25} />,
      title: "Students",
      value: data.students,
      description: "Registered students",
      className: "pink",
    },

    {
      icon: <AlertTriangle size={25} />,
      title: "Overdue Books",
      value: data.overdueBooks,
      description: "Past due date",
      className: "red",
    },
  ];

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    window.location.href = path;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (
      !date ||
      isNaN(date.getTime())
    ) {
      return "";
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="dashboard-container">

      <Sidebar />

      <main className="main-content">

        <Topbar title="Dashboard" />

        {/* WELCOME */}

        <section className="dashboard-heading">

          <p className="dashboard-label">
            Admin Portal
          </p>

          <h1>
            Welcome back, <span>Admin</span> 👋
          </h1>

          <p className="dashboard-subtitle">
            Here's what's happening in your library.
          </p>

        </section>

        {/* STATISTICS */}

        <section className="cards">

          {cards.map((card) => (
            <div
              className={`card ${card.className}`}
              key={card.title}
            >

              <div className="card-icon">
                {card.icon}
              </div>

              <div className="card-content">

                <p>
                  {card.title}
                </p>

                <h2>
                  {card.value}
                </h2>

                <span>
                  {card.description}
                </span>

              </div>

            </div>
          ))}

        </section>

        {/* LOWER SECTION */}

        <section className="dashboard-lower">

          {/* RECENT ACTIVITIES */}

          <div className="dashboard-panel activities-panel">

            <div className="panel-header">

              <div className="panel-title">

                <Clock3 size={20} />

                <h2>
                  Recent Activities
                </h2>

              </div>

              <p>
                Latest library activities
              </p>

            </div>

            <div className="activity-list">

              {activities.length === 0 ? (

                <div className="empty-activity">

                  <Clock3 size={30} />

                  <p>
                    No recent activities
                  </p>

                </div>

              ) : (

                activities.map(
                  (activity) => (

                    <div
                      className="activity-item"
                      key={activity.id}
                    >

                      <div
                        className={`activity-icon ${
                          activity.type
                        }`}
                      >

                        {getActivityIcon(
                          activity.type
                        )}

                      </div>

                      <div className="activity-info">

                        <strong>
                          {activity.title}
                        </strong>

                        <span>
                          {activity.description}
                        </span>

                      </div>

                      <div className="activity-date">

                        {formatDate(
                          activity.date
                        )}

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>

          {/* QUICK ACTIONS */}

          <div className="dashboard-panel quick-panel">

            <div className="panel-header">

              <div className="panel-title">

                <Plus size={20} />

                <h2>
                  Quick Actions
                </h2>

              </div>

              <p>
                Common librarian actions
              </p>

            </div>

            <div className="quick-actions">

              {/* ADD STUDENT */}

              <button
                className="quick-action"
                onClick={() =>
                  goTo("/students")
                }
              >

                <div className="quick-icon blue">
                  <UserPlus size={22} />
                </div>

                <div>

                  <strong>
                    Add Student
                  </strong>

                  <span>
                    Register new student
                  </span>

                </div>

                <ArrowRight size={18} />

              </button>

              {/* ADD BOOK */}

              <button
                className="quick-action"
                onClick={() =>
                  goTo("/books")
                }
              >

                <div className="quick-icon green">
                  <BookPlus size={22} />
                </div>

                <div>

                  <strong>
                    Add Book
                  </strong>

                  <span>
                    Add book to library
                  </span>

                </div>

                <ArrowRight size={18} />

              </button>

              {/* ISSUE BOOK */}

              <button
                className="quick-action"
                onClick={() =>
                  goTo("/issue-book")
                }
              >

                <div className="quick-icon purple">
                  <ClipboardPlus size={22} />
                </div>

                <div>

                  <strong>
                    Issue Book
                  </strong>

                  <span>
                    Issue book to student
                  </span>

                </div>

                <ArrowRight size={18} />

              </button>

              {/* RETURN BOOK */}

              <button
                className="quick-action"
                onClick={() =>
                  goTo("/return-book")
                }
              >

                <div className="quick-icon orange">
                  <RotateCcw size={22} />
                </div>

                <div>

                  <strong>
                    Return Book
                  </strong>

                  <span>
                    Process book return
                  </span>

                </div>

                <ArrowRight size={18} />

              </button>

            </div>

          </div>

        </section>

        {/* ALERTS */}

        <section className="dashboard-panel alerts-panel">

          <div className="panel-header alerts-header">

            <div className="panel-title">

              <AlertTriangle size={20} />

              <h2>
                Alerts
              </h2>

            </div>

            <p>
              Things that may need your attention
            </p>

          </div>

          <div className="alerts-list">

            {alerts.map(
              (alert, index) => (

                <div
                  className={`alert-item ${alert.type}`}
                  key={`${alert.type}-${index}`}
                >

                  <div className="alert-icon">
                    {alert.icon}
                  </div>

                  <span>
                    {alert.text}
                  </span>

                </div>

              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;