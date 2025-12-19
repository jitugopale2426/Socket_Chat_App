import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getMessagesController, sendMessageController } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post('/sendMessage',authMiddleware,sendMessageController)
messageRouter.get('/getMessages/:chatSessionId',authMiddleware,getMessagesController)

export default messageRouter;