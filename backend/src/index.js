import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT;
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

app.listen(PORT,()=>{
    console.log("Server started on port 5001");
    connectDB();
})