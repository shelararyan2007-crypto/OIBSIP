import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Students from "./pages/Students";
import IssueBook from "./pages/IssueBook";
import ReturnBook from "./pages/ReturnBook";
import Reports from "./pages/Reports";

import StudentDashboard from "./pages/StudentDashboard";
import StudentHistory from "./pages/StudentHistory";
import StudentBooks from "./pages/StudentBooks";
import StudentProfile from "./pages/StudentProfile";
import StudentNotifications from "./pages/StudentNotifications";
import AvailableBooks from "./pages/AvailableBooks";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* =================================================
          DEFAULT
      ================================================= */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />


      {/* =================================================
          AUTH
      ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =================================================
          STUDENT
      ================================================= */}

      <Route
        path="/student-dashboard"
        element={<StudentDashboard />}
      />

      <Route
        path="/student-books"
        element={<StudentBooks />}
      />

      <Route
        path="/available-books"
        element={<AvailableBooks />}
      />

      <Route
        path="/student-history"
        element={<StudentHistory />}
      />

      <Route
        path="/student-profile"
        element={<StudentProfile />}
      />

      <Route
        path="/student-notifications"
        element={<StudentNotifications />}
      />


      {/* =================================================
          ADMIN
      ================================================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/issue-book"
        element={
          <ProtectedRoute>
            <IssueBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/return-book"
        element={
          <ProtectedRoute>
            <ReturnBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />


      {/* =================================================
          FALLBACK
      ================================================= */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

export default App;