import "../assets/Header.css";
import { Link, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

function Header() {
  const location = useLocation();
  const auth = getAuth();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const fullName = localStorage.getItem("user") || "";
  const firstName = fullName.trim().split(/\s+/)[0] || "Name";
  const profilePic = localStorage.getItem("profile");
  const isAdmin = localStorage.getItem("admin") === "true";

  const SignOut = async () => {
    try {
      await signOut(auth);
      window.location = "/";
    } catch (error) {
      console.error(error);
    }
  };

  // close dropdown on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // close dropdown on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (location.pathname === "/") return null;

  return (
    <div className="header">
      <div className="container">
        <Link className="image-link" to="/home">
          <img
            className="built-img"
            alt="built logo"
            src="https://built-illinois.org/built-logo.png"
          />
        </Link>

        <Link to="/leaderboard">
          <h2 className="header-button">Leaderboard</h2>
        </Link>
        <Link to="/events">
          <h2 className="header-button">Events</h2>
        </Link>
        <Link to="/checkin">
          <h2 className="header-button">Check-In</h2>
        </Link>

        {/* Profile dropdown */}
        <div className="user-section" ref={menuRef}>
          <button
            type="button"
            className="user-trigger"
            onClick={() => setOpen((p) => !p)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <img
              className="user-profile"
              alt="user-profile"
              src={profilePic || "https://via.placeholder.com/64"}
            />
            <span className="user-name">{firstName}</span>
            <span className={`caret ${open ? "open" : ""}`}>▾</span>
          </button>

          {open && (
            <div className="user-dropdown" role="menu">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="dropdown-item"
                  onClick={() => setOpen(false)}
                >
                    Admin
                </Link>
              )}
              
              <button className="logout-btn" role="menuitem" onClick={SignOut}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
