import prisma from "../prisma/client.js";
import { logger } from "../utils/logger.js";

export const sendMessage = async (req, res) => {
  // 🧾 Vérifie la présence du corps de la requête
  if (!req.body) {
    return res
      .status(400)
      .json({ error: "Données manquantes dans la requête." });
  }

  // 📝 Extraction des champs de la requête
  const { recipientId, content } = req.body;
  const senderId = req.user?.id;

  // 📋 Validation des champs obligatoires
  const missing = [];
  if (!recipientId) missing.push("recipientId");
  if (!content) missing.push("content");
  if (!senderId) missing.push("senderId");

  if (missing.length > 0) {
    return res.status(400).json({
      error: `Champs manquants : ${missing.join(", ")}`,
    });
  }

  try {
    // 💾 Création du message
    const message = await prisma.message.create({
      data: {
        senderId: String(senderId),
        recipientId: String(recipientId),
        content: String(content),
      },
      select: { content: true },
    });

    // ✅ Réponse réussie
    return res.status(201).json({
      success: true,
      message: "✅ Message envoyé avec succès.",
      data: message,
    });
  } catch (error) {
    // 🚨 Gestion des erreurs
    logger.error(`❗ Send message Error : ${error}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'envoi du message.",
    });
  }
};

export const getMessages = async (req, res) => {
  // 🧾 Récupère l'ID du destinataire depuis les paramètres de l'URL
  const { recipientId } = req.params;

  const senderId = req.user?.id;

  // 🔒 Vérifie que l'utilisateur est bien authentifié
  if (!senderId) {
    return res.status(401).json({
      success: false,
      error: "Utilisateur non authentifié.",
    });
  }

  // 🧪 Vérifie que l'ID du destinataire est bien présent
  if (!recipientId) {
    return res.status(400).json({
      success: false,
      error: "L'ID du destinataire est requis.",
    });
  }

  try {
    // 💬 Récupère les messages entre l'utilisateur courant et le destinataire
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      },
      orderBy: { createdAt: "asc" }, // 📅 Trie du plus ancien au plus récent
    });

    // ✅ Réponse avec la liste des messages
    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    // 🛑 Log en cas d'erreur serveur
    logger.error(`❗ Erreur lors de la récupération des messages : ${error}`);
    return res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors de la récupération des messages.",
    });
  }
};
