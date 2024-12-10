import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const databaseUrl = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());
app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use('/uploads/files', express.static('uploads/files'));
app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/channels', channelRoutes)
app.use('/api/messages', messagesRoutes)

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})   

setupSocket(server)

mongoose.connect(databaseUrl).then(() => [
    console.log("Connected to database"),
]).catch((error) => [
    console.log(error.message),
])