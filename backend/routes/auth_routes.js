import express from "express"
import { register } from "../controllers/auth_controller.js";

const authRouter = express.Router();

authRouter.post("/register", register)

export {
    authRouter
}