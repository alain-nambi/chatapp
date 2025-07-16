import bcrypt from "bcrypt"
import prisma from "../prisma/client.js";
import handlePrismaError from "../middlewares/prisma_error_handler.js";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = "1d"

const register = async (req, res) => {
    const { username, email, password } = req.body
    const hash = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { username, email, password: hash },
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exist in database
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password."
            })
        }

        // Check if password is the same as in database
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                error: "Invalid email or password."
            })
        }

        // Generate a JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: `User ${user.username} successfully signed in.`,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token
        })
    } catch (error) {
        handlePrismaError(error, res)
    }


}

export {
    register,
    login
}