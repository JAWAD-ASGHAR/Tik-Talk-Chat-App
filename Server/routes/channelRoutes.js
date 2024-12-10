import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/channelController.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);
channelRoutes.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);

export default channelRoutes;