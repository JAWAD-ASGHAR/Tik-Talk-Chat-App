import { Router } from "express";
import { getMessages } from "../controllers/messagesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const messagesRoutes = Router();

messagesRoutes.post("/get-messages", verifyToken, getMessages);

export default messagesRoutes;