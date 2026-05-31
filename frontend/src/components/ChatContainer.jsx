import React, { useState, useEffect, useRef } from "react";
import { messageAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

function ChatContainer({ selectedChat }) {
  const { user: currentUser } = useAuth();
  const { sendMessage, onReceiveMessage, isUserOnline } = useSocket();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const fetchedMessages = await messageAPI.getMessages(selectedChat._id);
        setMessages(fetchedMessages || []);
        setError("");
      } catch (err) {
        setError("Failed to load messages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Listen for incoming messages
  useEffect(() => {
    if (!selectedChat?._id || !onReceiveMessage || !currentUser?._id) return;

    const handleReceiveMessage = (messageData) => {
      // Only add message if it's from the current chat
      // Check if the message is between current user and selected chat user
      const isFromSelectedChat =
        (messageData.senderId === selectedChat._id &&
          messageData.receiverId === currentUser._id) ||
        (messageData.senderId === currentUser._id &&
          messageData.receiverId === selectedChat._id);

      if (isFromSelectedChat) {
        setMessages((prev) => [...prev, messageData]);
      }
    };

    const unsubscribe = onReceiveMessage(handleReceiveMessage);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedChat, currentUser, onReceiveMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      return;
    }

    if (!selectedChat?._id) {
      setError("No chat selected");
      return;
    }

    try {
      setError("");
      // Send message via Socket.IO for real-time delivery
      sendMessage(selectedChat._id, messageText);
      
      // Also send via API to persist in database
      const newMessage = await messageAPI.sendMessage(selectedChat._id, {
        text: messageText,
      });

      // Add the new message to the list
      setMessages([...messages, newMessage]);
      setMessageText("");
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to stop the typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

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

  const userOnlineStatus = isUserOnline(selectedChat._id);

  return (
    <div
      className="d-flex flex-column h-100 text-light"
      style={{
        background: "#050816",
      }}
    >
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
              backgroundImage: selectedChat.profilepic
                ? `url(${selectedChat.profilepic})`
                : "linear-gradient(135deg,#7c3aed,#2563eb)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: userOnlineStatus ? "2px solid #10b981" : "2px solid #6b7280",
              position: "relative",
            }}
          ></div>

          <div className="ms-3">
            <h6 className="mb-0">{selectedChat.name}</h6>

            <small
              style={{
                color: userOnlineStatus ? "#10b981" : "#9ca3af",
              }}
            >
              {userOnlineStatus ? "Online" : "Offline"}
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
            disabled
            title="Coming soon"
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
            disabled
            title="Coming soon"
          >
            <i className="bi bi-camera-video"></i>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow-1 p-4 overflow-auto">
        {loading && (
          <div className="text-center">
            <small style={{ color: "#9ca3af" }}>Loading messages...</small>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-sm" style={{ fontSize: "12px" }}>
            {error}
          </div>
        )}

        {messages.length === 0 && !loading && (
          <div className="text-center" style={{ color: "#9ca3af" }}>
            <small>No messages yet. Start the conversation!</small>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`d-flex mb-4 ${
              msg.senderId === currentUser?._id
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              style={{
                background:
                  msg.senderId === currentUser?._id
                    ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                    : "#111827",
                padding: "14px 18px",
                borderRadius: "18px",
                maxWidth: "320px",
                fontSize: "15px",
              }}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="message attachment"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "8px",
                    marginBottom: msg.text ? "8px" : "0",
                  }}
                />
              )}
              {msg.text && <div>{msg.text}</div>}
              <small
                style={{
                  fontSize: "11px",
                  opacity: 0.7,
                  display: "block",
                  marginTop: msg.text ? "4px" : "0",
                }}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="p-3"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "#0b1120",
        }}
      >
        <form onSubmit={handleSendMessage}>
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
              title="Coming soon"
            >
              <i className="bi bi-plus-lg"></i>

              {/* Hidden File Input */}
              <input type="file" hidden multiple disabled />
            </label>

            {/* Emoji Button */}
            <button
              type="button"
              className="btn text-light"
              style={{
                background: "#111827",
                borderRadius: "12px",
                width: "48px",
                height: "48px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              disabled
              title="Coming soon"
            >
              <i className="bi bi-emoji-smile"></i>
            </button>

            {/* Message Input */}
            <input
              type="text"
              placeholder="Type a message"
              className="form-control search-input"
              value={messageText}
              onChange={handleInputChange}
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
              type="submit"
              className="btn btn-primary text-light px-4"
              style={{
                borderRadius: "12px",
                height: "48px",
              }}
              disabled={!messageText.trim()}
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatContainer;
