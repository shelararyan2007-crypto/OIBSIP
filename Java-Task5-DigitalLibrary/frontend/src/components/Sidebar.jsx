import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookMarked,
  RotateCcw,
  BarChart3,
  LogOut,
} from "lucide-react";
import "../styles/sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      name: "Books",
      path: "/books",
      icon: <BookOpen />,
    },
    {
      name: "Students",
      path: "/students",
      icon: <Users />,
    },
    {
      name: "Issue Book",
      path: "/issue-book",
      icon: <BookMarked />,
    },
    {
      name: "Return Book",
      path: "/return-book",
      icon: <RotateCcw />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <BookOpen size={25} />
        </div>

        <div>
          <h2>LIBRARY</h2>
          <span>ADMIN PORTAL</span>
        </div>
      </div>

      {/* MENU */}
      <nav className="sidebar-nav">

        <p className="sidebar-section-title">
          MAIN MENU
        </p>

        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <span className="sidebar-link-icon">
              {item.icon}
            </span>

            <span className="sidebar-link-text">
              {item.name}
            </span>
          </Link>
        ))}

      </nav>

      {/* LOGOUT */}
      <div className="sidebar-bottom">

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={21} />

          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;