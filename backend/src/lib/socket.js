import { Server } from "socket.io";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

// Store online users
const userSocketMap = {}; // userId -> socketId

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
});

// Middleware to authenticate Socket.IO connections
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return next(new Error("User not found"));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
    } catch (error) {
        console.log("Socket authentication error:", error.message);
        next(new Error("Authentication failed"));
    }
});

io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.userId}`);
    
    // Store the socket-user mapping
    userSocketMap[socket.userId] = socket.id;
    
    // Broadcast online users to all connected clients
    io.emit("onlineUsers", Object.keys(userSocketMap));

    // Handle incoming messages
    socket.on("sendMessage", async (data) => {
        try {
            const { receiverId, text, image } = data;
            
            // Get the receiver's socket ID
            const receiverSocketId = userSocketMap[receiverId];
            
            // Prepare message object
            const messageData = {
                senderId: socket.userId,
                receiverId,
                text,
                image,
                timestamp: new Date()
            };

            // Send message to receiver if they're online
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", messageData);
            }
            
            // Send confirmation to sender
            socket.emit("messageSent", {
                ...messageData,
                _id: Date.now() // Temporary ID until DB confirms
            });

        } catch (error) {
            console.log("Error in sendMessage:", error.message);
            socket.emit("messageError", { message: "Failed to send message" });
        }
    });

    // Handle typing indicator
    socket.on("userTyping", (receiverId) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userIsTyping", {
                senderId: socket.userId
            });
        }
    });

    // Handle stop typing
    socket.on("userStoppedTyping", (receiverId) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStoppedTyping", {
                senderId: socket.userId
            });
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.userId}`);
        
        // Remove user from online map
        delete userSocketMap[socket.userId];
        
        // Broadcast updated online users
        io.emit("onlineUsers", Object.keys(userSocketMap));
    });
});

// Helper function to get online users
export const getOnlineUsers = () => {
    return Object.keys(userSocketMap);
};

// Helper function to get socket ID for a user
export const getSocketIdForUser = (userId) => {
    return userSocketMap[userId];
};

export { io, app, server };