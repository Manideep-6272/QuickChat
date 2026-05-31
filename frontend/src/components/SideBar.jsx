import React, { useState, useEffect } from "react";
import logo from "../assets/favicon.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { messageAPI } from "../lib/api";

function SideBar({ selectedChat, onSelectChat }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { onlineUsers, isUserOnline } = useSocket();
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users list on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await messageAPI.getUsers();
        setChats(users);
        setFilteredChats(users);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter chats based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        (chat.bio && chat.bio.toLowerCase().includes(query))
    );
    setFilteredChats(filtered);
  }, [searchQuery, chats]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Still navigate to login even if logout fails
      navigate("/login");
    }
  };

  return (
    <div
      className="p-3 text-light fs-6 d-flex flex-column"
      style={{
        background: "#0b1120",
        borderRight: "1px solid rgba(255,255,255,0.1)",
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Logo + Title */}
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="logo"
            style={{ height: "40px", width: "40px" }}
          />

          <h3
            className="mb-0 fw-bold ms-3"
            style={{
              color: "#8b5cf6",
            }}
          >
            QuickChat
          </h3>
        </div>
        {/* Three Dots Menu */}
        <div className="dropdown">
          <button
            className="btn text-light"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "22px",
            }}
          >
            ⋮
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            }}
          >
            <li>
              <button 
                className="dropdown-item text-light"
                style={{ background: "transparent" }}
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <hr className="dropdown-divider text-secondary" />
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                style={{ background: "transparent" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Welcome Message */}
      {user && (
        <div className="mb-3 p-2" style={{ background: "#111827", borderRadius: "8px" }}>
          <small style={{ color: "#9ca3af" }}>Welcome, <strong>{user.name}</strong></small>
        </div>
      )}

      <input
        type="text"
        placeholder="Search chats"
        className="form-control mb-4 search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          background: "#111827",
          border: "none",
          color: "white",
          padding: "12px",
          borderRadius: "12px",
        }}
      />

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-sm mb-3" style={{ fontSize: "12px" }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center">
          <small style={{ color: "#9ca3af" }}>Loading chats...</small>
        </div>
      )}

      {/* Users List */}
      <div className="" style={{
        flex: '1 1 auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: '0',
        paddingRight: '4px',
      }}>
        {!loading && filteredChats.length === 0 && (
          <div className="text-center" style={{ color: "#9ca3af" }}>
            <small>{searchQuery ? "No users found" : "No users available"}</small>
          </div>
        )}

        {filteredChats.map((chat) => {
          const isOnline = isUserOnline(chat._id);
          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className="d-flex align-items-center p-3 mb-3"
              style={{
                background: selectedChat?._id === chat._id ? "#1f2937" : "#111827",
                borderRadius: "16px",
                cursor: "pointer",
                border:
                  selectedChat?._id === chat._id
                    ? "1px solid #8b5cf6"
                    : "1px solid rgba(255,255,255,0.05)",
                flexShrink: 0
              }}
            >
              <div className="position-relative">
                <div
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                    backgroundImage: chat.profilepic ? `url(${chat.profilepic})` : "linear-gradient(135deg,#7c3aed,#2563eb)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: isOnline ? "2px solid #10b981" : "2px solid #6b7280",
                  }}
                ></div>
                {/* Online Status Indicator */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: isOnline ? "#10b981" : "#6b7280",
                    border: "2px solid #0b1120",
                  }}
                ></div>
              </div>
              <div className="ms-3 flex-grow-1 min-width-0">
                <h6 className="mb-1 fw-semibold">{chat.name}</h6>
                <small
                  style={{
                    color: isOnline ? "#10b981" : "#9ca3af",
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {isOnline ? "Online" : "Offline"}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;