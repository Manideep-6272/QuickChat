import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    // Get JWT token from cookies
    const getCookie = (name) => {
      try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      } catch (error) {
        console.error("Error reading cookie:", error);
      }
      return null;
    };

    const token = getCookie("jwt");

    if (!token) {
      console.log("No JWT token found in cookies");
      return;
    }

    console.log("Initializing Socket.IO connection with JWT token");
    
    // Initialize Socket.IO connection
    const socketURL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";
    
    const newSocket = io(socketURL, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✓ Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("✗ Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("onlineUsers", (users) => {
      console.log("Online users update:", users);
      // Filter out current user from online users and convert to array
      const filteredUsers = Array.isArray(users) 
        ? users.filter((id) => id !== user._id)
        : [];
      setOnlineUsers(filteredUsers);
    });

    newSocket.on("error", (error) => {
      console.error("✗ Socket error:", error);
    });

    newSocket.on("connect_error", (error) => {
      console.error("✗ Socket connection error:", error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [isAuthenticated, user]);

  const sendMessage = (receiverId, text, image = null) => {
    if (socket && socket.connected) {
      socket.emit("sendMessage", {
        receiverId,
        text,
        image,
      });
    } else {
      console.warn("Socket is not connected");
    }
  };

  const notifyTyping = (receiverId) => {
    if (socket && socket.connected) {
      socket.emit("userTyping", receiverId);
    }
  };

  const notifyStoppedTyping = (receiverId) => {
    if (socket && socket.connected) {
      socket.emit("userStoppedTyping", receiverId);
    }
  };

  const onReceiveMessage = (callback) => {
    if (socket) {
      socket.on("receiveMessage", callback);
      
      return () => {
        socket.off("receiveMessage", callback);
      };
    }
  };

  const onMessageSent = (callback) => {
    if (socket) {
      socket.on("messageSent", callback);
      
      return () => {
        socket.off("messageSent", callback);
      };
    }
  };

  const onUserTyping = (callback) => {
    if (socket) {
      socket.on("userIsTyping", callback);
      
      return () => {
        socket.off("userIsTyping", callback);
      };
    }
  };

  const onUserStoppedTyping = (callback) => {
    if (socket) {
      socket.on("userStoppedTyping", callback);
      
      return () => {
        socket.off("userStoppedTyping", callback);
      };
    }
  };

  const onMessageError = (callback) => {
    if (socket) {
      socket.on("messageError", callback);
      
      return () => {
        socket.off("messageError", callback);
      };
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    notifyTyping,
    notifyStoppedTyping,
    onReceiveMessage,
    onMessageSent,
    onUserTyping,
    onUserStoppedTyping,
    onMessageError,
    isUserOnline,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
