import express from "express";
import authRouter from "./authRoutes.js";
import messageRouter from "./messageRoutes.js";
import ChatSessionRouter from "./chatSessionRoutes.js";

const rooRouter = express.Router();

rooRouter.use('/auth',authRouter)
rooRouter.use('/messages',messageRouter)
rooRouter.use('/chatSession',ChatSessionRouter)

export default rooRouter;