import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message_controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const messageRouter = Router();

messageRouter.post("/send", authenticate, sendMessage);
messageRouter.get("/:recipientId", authenticate, getMessages);

export default messageRouter;
