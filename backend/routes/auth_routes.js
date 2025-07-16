import express, { Router } from "express"
import { login, register, refresh, logout } from "../controllers/auth_controller.js";

const authRouter = express.Router();

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

export {
    authRouter
}