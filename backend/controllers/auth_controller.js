import bcrypt from "bcrypt"
import prisma from "../prisma/client.js";

const register =  async (req, res) => {
    const { username, email, password } = req.body
    const hash = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data : { username, email, password: hash },
            select: { id: true, username: true, email: true }
        })

        res.status(201).json({ user });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export {
    register
}