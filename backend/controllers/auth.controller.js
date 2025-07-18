import bcrypt from "bcrypt"
import prisma from "../prisma/client.js";
import handlePrismaError from "../middlewares/prisma_error_handler.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../security/auth_service.js";


export const register = async (req, res) => {
    // 📝 Récupération des données de la requête (formulaire d'inscription)
    const { username, email, password } = req.body;

    // 🔐 Hashage du mot de passe avec bcrypt pour le stocker de façon sécurisée
    const hash = await bcrypt.hash(password, 10);

    try {
        // 📦 Création d'un nouvel utilisateur dans la base de données
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hash, // le mot de passe hashé est stocké
            },
            select: {
                id: true,
                username: true,
                email: true, // on exclut le mot de passe de la réponse
            },
        });

        // ✅ Réponse avec message de succès et les infos essentielles de l'utilisateur
        res.status(201).json({
            message: `User ${username} successfully registered.`,
            user: user,
        });
    } catch (error) {
        // ⚠️ Gestion des erreurs liées à Prisma (ex: email déjà utilisé, etc.)
        handlePrismaError(error, res);
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🔍 Recherche de l'utilisateur dans la base de données à partir de l'email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // ❌ Si aucun utilisateur trouvé avec cet email, retourner une erreur
        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        // 🔐 Vérification du mot de passe avec le hash enregistré en base
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        // ✅ Si tout est bon, créer un payload à inclure dans les tokens JWT
        const payload = { id: user.id, email: user.email };

        // 🎫 Génération du token d'accès (valide quelques minutes)
        const accessToken = generateAccessToken(payload);

        // 🔁 Génération du refresh token (valide plusieurs jours)
        const refreshToken = generateRefreshToken(payload);

        // 🍪 Envoi du token d'accès dans un cookie sécurisé (HTTP-only pour éviter le XSS)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // ⚠️ HTTPS requis en production
            sameSite: 'Strict', // Protection contre les attaques CSRF
            maxAge: 1000 * 60 * 60 * 24 // 1 jour
        });

        // 🍪 Envoi du refresh token dans un autre cookie sécurisé
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
        });

        // 📦 Réponse JSON avec message de succès + données utilisateur
        res.status(200).json({
            message: `User ${user.username} successfully signed in.`,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        });

    } catch (error) {
        // 🛑 Gestion des erreurs Prisma ou autres erreurs inattendues
        handlePrismaError(error, res);
    }
};


export const refresh = (req, res) => {
    // 🔍 Extraction du refresh token depuis les cookies
    const token = req.cookies.refreshToken;
    
    // ❌ Si aucun refresh token n’est présent, refuser l'accès
    if (!token) {
        return res.status(401).json({ error: "No refresh token provided." });
    }

    try {
        // ✅ Vérification de la validité du refresh token
        const decoded = verifyRefreshToken(token);

        // 🔄 Génération d’un nouveau token d’accès (access token) avec les infos utilisateur
        const newAccessToken = generateAccessToken({
            id: decoded.id,
            email: decoded.email
        });

        // 🍪 Envoi du nouveau token d’accès dans un cookie sécurisé
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 15 // 15 minutes
        });

        // 📦 Envoi d’une réponse de succès
        res.status(200).json({ message: "Access token refreshed" });

    } catch (error) {
        // 🛑 Si le token est invalide ou expiré, renvoyer une erreur
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};


export const logout = (_req, res) => {
    // 🧹 Supprimer le cookie du token d’accès (accessToken)
    res.clearCookie("accessToken");

    // 🧹 Supprimer le cookie du token de rafraîchissement (refreshToken)
    res.clearCookie("refreshToken");

    // ✅ Répondre avec un message de confirmation
    res.status(200).json({ message: "Logged out successfully" });
};
