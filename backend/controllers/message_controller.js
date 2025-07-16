import prisma from "../prisma/client.js";
import { logger } from "../utils/logger.js";

export const sendMessage = async (req, res) => {
    // 🔍 Vérifie que le corps de la requête existe
    if (!req.body) {
        return res.status(400).json({
            error: "Données manquantes dans la requête.",
        });
    }

    // 📝 Extraction des champs nécessaires
    const { recipientId, content } = req.body;
    const senderId = String(req.user?.id); // sécurise l'accès à l'id utilisateur

    // 🔎 Collecte des champs manquants
    const missingFields = [];
    if (!recipientId) missingFields.push("recipientId");
    if (!content) missingFields.push("content");
    if (!senderId) missingFields.push("senderId");

    // 🚫 Retourne une erreur si des champs sont manquants
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `Les champs suivants sont obligatoires : ${missingFields.join(", ")}.`,
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: String(recipientId) }
        })

        logger.info(user)

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Le destinataire n'existe pas",
            });
        }

        // 💾 Création du message dans la base de données
        const message = await prisma.message.create({
            data: {
                senderId: String(senderId),
                recipientId: String(recipientId), // conversion en string pour Prisma
                content: String(content),
            },
            select: { content: true }
        });

        // ✅ Réponse réussie avec les données du message créé
        return res.status(201).json({
            success: true,
            message: "Message envoyé avec succès.",
            data: message,
        });
    } catch (error) {
        // 🛑 Log et retour d'erreur serveur
        logger.error(`Send message Error : ${error}`);
        return res.status(500).json({
            success: false,
            error: "Erreur lors de l'envoi du message.",
        });
    }
};


export const getMessages = async (req, res) => {
    const { recipientId } = req.params;
    const senderId = req.user.id;

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId, recipientId },
                    { senderId: recipientId, recipientId: senderId },
                ],
            },
            orderBy: { createdAt: "asc" },
        });

        res.status(200).json({ messages });
    } catch (error) {
        logger.error(`Get Messages Error : ${error}`);
        res.status(500).json({
            error: `Erreur lors de la récupération du messages.`,
        });
    }
};
