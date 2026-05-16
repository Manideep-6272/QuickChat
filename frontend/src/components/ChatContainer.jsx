import React from "react";

function ChatContainer({ selectedChat }) {
  const messages = [
    {
      id: 1,
      text: "Hello bro",
      sender: false,
    },
    {
      id: 2,
      text: "Hey",
      sender: true,
    },
  ];

  if (!selectedChat) {
    return (
      <div
        className="d-flex flex-column h-100 text-light align-items-center justify-content-center"
        style={{
          background: "#050816",
        }}
      >
        <h3 style={{ color: "#9ca3af" }}>Select a chat to start messaging</h3>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column h-100 text-light"
      style={{
        background: "#050816",
      }}
    >
      {/* Header */}

      {/* Header */}

      <div
        className="d-flex align-items-center justify-content-between p-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "#0b1120",
        }}
      >
        {/* Left Side */}
        <div className="d-flex align-items-center">
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#7c3aed,#2563eb)",
            }}
          ></div>

          <div className="ms-3">
            <h6 className="mb-0">{selectedChat.name}</h6>

            <small
              style={{
                color: selectedChat.online ? "#22c55e" : "#9ca3af",
              }}
            >
              {selectedChat.online ? "Online" : "Offline"}
            </small>
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="d-flex align-items-center gap-3">
          {/* Audio Call */}
          <button
            className="btn text-light"
            style={{
              background: "#111827",
              borderRadius: "12px",
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <i className="bi bi-telephone"></i>
          </button>

          {/* Video Call */}
          <button
            className="btn text-light"
            style={{
              background: "#111827",
              borderRadius: "12px",
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <i className="bi bi-camera-video"></i>
          </button>
        </div>
      </div>

      {/* Messages */}

      <div className="flex-grow-1 p-4 overflow-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex mb-4 ${
              msg.sender ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              style={{
                background: msg.sender
                  ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                  : "#111827",
                padding: "14px 18px",
                borderRadius: "18px",
                maxWidth: "320px",
                fontSize: "15px",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}

      {/* Input */}

      <div
        className="p-3"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "#0b1120",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          {/* Plus Button */}
          <label
            className="btn text-light d-flex align-items-center justify-content-center"
            style={{
              background: "#111827",
              borderRadius: "12px",
              width: "48px",
              height: "48px",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
            }}
          >
            <i className="bi bi-plus-lg"></i>

            {/* Hidden File Input */}
            <input type="file" hidden multiple />
          </label>

          {/* Emoji Button */}
          <button
            className="btn text-light"
            style={{
              background: "#111827",
              borderRadius: "12px",
              width: "48px",
              height: "48px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <i className="bi bi-emoji-smile"></i>
          </button>

          {/* Message Input */}
          <input
            type="text"
            placeholder="Type a message"
            className="form-control search-input"
            style={{
              background: "#111827",
              border: "none",
              color: "white",
              borderRadius: "14px",
              padding: "14px",
            }}
          />

          {/* Send Button */}
          <button
            className="btn btn-primary text-light px-4"
            style={{
              borderRadius: "12px",
              height: "48px",
            }}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
