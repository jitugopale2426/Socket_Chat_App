import express from "express";
import { getUserController, LoginController, RegisterController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post('/register',RegisterController)
authRouter.post('/login',LoginController)
authRouter.get('/getUser',authMiddleware,getUserController)

export default authRouter;