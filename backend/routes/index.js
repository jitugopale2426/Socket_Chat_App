import express from "express";
import authRouter from "./authRoutes.js";
import messageRouter from "./messageRoutes.js";

const rooRouter = express.Router();

rooRouter.use('/auth',authRouter)
rooRouter.use('/messages',messageRouter)

export default rooRouter;