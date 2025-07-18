import prisma from "../prisma/client.js";

export const checkRecipientExists = async (req, res, next) => {
    const recipientId = req.params?.recipientId || req.body?.recipientId;

    if (!recipientId) {
        return res.status(400).json({
            success: false,
            message: "L'ID du destinataire est requis.",
        });
    }

    const recipient = await prisma.user.findUnique({
        where: { id: String(recipientId) },
    });

    if (!recipient) {
        return res.status(404).json({
            success: false,
            message: "Le destinataire n'existe pas."
        })
    }

    next()
};
