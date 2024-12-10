import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createChannel, getUserChannels } from "../controllers/channelController.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);

export default channelRoutes;