import React from "react";
import logo from "../assets/favicon.svg";
import { useNavigate } from "react-router-dom";
function SideBar({ selectedChat, onSelectChat }) {
  const navigate = useNavigate();
  const chats = [
    {
      id: 1,
      name: "Rahul",
      message: "Hey bro",
      online: true,
    },
    {
      id: 2,
      name: "Kiran",
      message: "Call me",
      online: false,
    },
  ];

  return (
    <div
      className="h-100 p-3 text-light fs-6"
      style={{
        background: "#0b1120",
        borderRight: "1px solid rgba(255,255,255,0.1)",
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
              <button
                className="dropdown-item text-light"
                style={{ background: "transparent" }}
                onClick={() => navigate("/newchat")}
              >
                New Chat
              </button>
            </li>
            <li>
              <hr className="dropdown-divider text-secondary" />
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                style={{ background: "transparent" }}
                onClick={() => navigate("/logout")}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search chats"
        className="form-control mb-4 search-input"
        style={{
          background: "#111827",
          border: "none",
          color: "white",
          padding: "12px",
          borderRadius: "12px",
        }}
      />
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className="d-flex align-items-center p-3 mb-3"
          style={{
            background: selectedChat?.id === chat.id ? "#1f2937" : "#111827",
            borderRadius: "16px",
            cursor: "pointer",
            // transition: "0.3s",
            border:
              selectedChat?.id === chat.id
                ? "1px solid #8b5cf6"
                : "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="position-relative">
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#7c3aed,#2563eb)",
              }}
            ></div>
            {chat.online && (
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  position: "absolute",
                  bottom: "3px",
                  right: "3px",
                  border: "2px solid #111827",
                }}
              ></div>
            )}
          </div>
          <div className="ms-3">
            <h6 className="mb-1 fw-semibold">{chat.name}</h6>
            <small
              style={{
                color: "#9ca3af",
              }}
            >
              {chat.message}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
export default SideBar;
