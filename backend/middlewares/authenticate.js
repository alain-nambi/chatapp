import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

// Middleware d'authentification : vérifie si l'utilisateur est connecté via le token JWT
export const authenticate = (req, res, next) => {
  // 🔍 Log les cookies de la requête pour le débogage
  // logger.info(req.cookies);

  // 🔐 Récupère le token d'accès depuis les cookies
  const token = req.cookies.accessToken;

  // ❌ Si aucun token n'est présent, l'utilisateur n'est pas authentifié
  if (!token) {
    return res.status(401).json({
      error: "🚫 Token d'authentification manquant. Accès non autorisé.",
    });
  }

  try {
    // ✅ Vérifie et décode le token avec la clé secrète définie dans le fichier .env
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 👤 Attache les infos de l'utilisateur décodées à l'objet `req` pour les routes suivantes
    req.user = user;

    // 🔁 Passe au middleware ou à la route suivante
    next();
  } catch (err) {
    // ❌ En cas d'erreur (ex: token expiré, invalide, modifié), renvoie une erreur 403
    logger.error("JWT verification failed", err);
    return res.status(403).json({ error: "Token invalid or expired" });
  }
};
