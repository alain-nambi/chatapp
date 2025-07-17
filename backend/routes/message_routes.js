import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message_controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { checkRecipientExists } from "../middlewares/check_recipient_exists.js";

const messageRouter = Router();

messageRouter.post("/send", authenticate, checkRecipientExists,  sendMessage);
messageRouter.get("/:recipientId", authenticate, checkRecipientExists, getMessages);

export default messageRouter;
