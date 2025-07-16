import bcrypt from "bcrypt"
import prisma from "../prisma/client.js";
import handlePrismaError from "../middlewares/prisma_error_handler.js";

const register =  async (req, res) => {
    const { username, email, password } = req.body
    const hash = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data : { username, email, password: hash },
            select: { id: true, username: true, email: true }
        })

        res.status(201).json({ 
            message: `User ${username} succesfully registered.`,
            user: user, 
        });
    } catch (error) {
        handlePrismaError(error, res)
    }
}

export {
    register
}