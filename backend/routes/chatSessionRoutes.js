import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getOrCreateChatSession } from "../controllers/chatSessionController.js";

const ChatSessionRouter = express.Router();

ChatSessionRouter.post('/get-or-create',authMiddleware,getOrCreateChatSession)

export default ChatSessionRouter;