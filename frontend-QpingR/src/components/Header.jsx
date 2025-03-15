import React, { useState, useEffect } from "react";
import "../styles/Header.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Header = ({ user, setUser, setIsModalOpen }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (!window.google) {
      console.error("Google One Tap SDK not loaded.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          console.log("Google Login Response:", response);

          if (!response.credential) {
            throw new Error("Google authentication token is missing.");
          }

          const res = await fetch("http://localhost:5001/api/auth/google-one-tap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ credential: response.credential }),
          });

          if (!res.ok) {
            throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
          }

          const data = await res.json();
          setUser(data.user);
          console.log("Google Login Success:", data);
        } catch (error) {
          console.error("Error sending token to backend:", error);
        }
      },
    });

    window.google.accounts.id.prompt();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
      }

      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header>
      <div className="container">
        <nav className={`nav-left ${isNavOpen ? "mobile-active" : ""}`}>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#features">Features</a>
          <a href="#partners">Partners</a>
          <a href="#testimonials">Testimonials</a>
        </nav>

        <div className="logo">Vybes</div>

        <nav className={`nav-right ${isNavOpen ? "mobile-active" : ""}`}>
          {user ? (
            <div className="profile-section">
              <img
                src={user.picture}
                alt="Profile"
                className="profile-pic"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29";
                }}
              />
              <span className="user-name">Hi, {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <span>Waiting for Google Login...</span>
          )}
        </nav>

        <button
          className="hamburger"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;