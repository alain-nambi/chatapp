import { z, ZodError } from "zod"; // 📦 Import de Zod, une bibliothèque de validation de schéma
import { logger } from "./logger.js";

// 🛡️ Définition du schéma de validation pour l'inscription
const registerSchema = z.object({
    // 🔤 Validation du nom d'utilisateur : au moins 3 caractères
    username: z.string().min(3, "Username doit contenir au moins 3 caractères"),

    // 📧 Validation de l’email : format valide obligatoire
    email: z.string().email("Email invalide"),

    // 🔒 Validation du mot de passe : au moins 6 caractères
    password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});


// ✅ Middleware de validation exécuté avant l'inscription
export const validateRegister = (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                error: "Données manquantes dans la requête."
            });
        }

        const { username, email, password } = req.body

        const missingFields = [];
        if (!username) missingFields.push("username");
        if (!email) missingFields.push("email");
        if (!password) missingFields.push("password");

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Les champs suivants sont obligatoires : ${missingFields.join(", ")}.`
            });
        }

        // 💡 Tente de valider les données envoyées par l'utilisateur
        // Utilise le schéma registerSchema défini avec Zod
        registerSchema.parse(req.body);

        // ✅ Si la validation réussit, on passe au middleware ou contrôleur suivant
        next();
    } catch (error) {
        // 🛑 Si une erreur est levée lors de la validation
        if (error instanceof ZodError) {
            // 📖 L'erreur Zod contient un message JSON avec toutes les erreurs de validation
            const errors = JSON.parse(error.message);

            // 📝 On ne récupère que la première erreur pour ne renvoyer qu'une seule à la fois
            const firstError = errors[0];

            // 🔧 On reformate l'erreur pour une réponse claire côté client
            const formattedError = {
                field: firstError.path.join('.'), // champ concerné (ex: "username")
                message: firstError.message,      // message d'erreur lisible
                code: firstError.code,            // code d'erreur Zod (ex: "too_small")
            };

            // 🚨 Envoi d'une réponse HTTP 400 (Bad Request) avec une seule erreur formatée
            return res.status(400).json({
                name: error.name,         // "ZodError"
                error: [formattedError], // tableau contenant une seule erreur
            });
        }

        // 🔥 Si erreur inattendue (non liée à Zod), on peut gérer ici ou laisser passer
        return res.status(500).json({
            error: "Erreur interne du serveur",
        });
    }
}
