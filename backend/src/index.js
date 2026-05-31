import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {io,app,server} from "./lib/socket.js";
// const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Vite default port for frontend
  credentials: true, // Allow cookies to be sent with requests
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT;
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

server.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
    connectDB();
})