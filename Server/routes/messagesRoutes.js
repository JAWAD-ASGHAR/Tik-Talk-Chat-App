import { Router } from "express";
import { getMessages, uploadFile } from "../controllers/messagesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const messagesRoutes = Router();
const upload = multer({dest: "uploads/files"});

messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/upload-file", verifyToken, upload.single("file") ,uploadFile);

export default messagesRoutes;