import express, { Router } from "express"
import { login, register, refresh, logout } from "../controllers/auth_controller.js";
import { validateRegister } from "../utils/user_validation.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegister, register)
authRouter.post("/login", login)
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

export {
    authRouter
}