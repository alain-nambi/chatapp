// 📦 Importation des modules nécessaires
import express from 'express';        // Framework web pour créer le serveur HTTP
import dotenv from 'dotenv';          // Pour charger les variables d'environnement depuis un fichier .env
import cors from 'cors';              // Pour permettre les requêtes cross-origin (CORS)
import { connectRedis } from './utils/redis.js';  // Fonction personnalisée pour se connecter à Redis

// 🌍 Charge les variables d'environnement depuis le fichier .env
dotenv.config();

// ⚙️ Initialise l'application Express
const app = express();

// 🔐 Middleware pour autoriser les requêtes CORS (utile si le frontend est sur un autre domaine ou port)
app.use(cors());

// 🧠 Middleware pour lire le corps des requêtes JSON
app.use(express.json());

// 🧠 Middleware pour lire les données des formulaires (url-encoded)
app.use(express.urlencoded({ extended: true }));

// ✅ Route d'accueil simple pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Hello from Node.js in Docker!');
});

// ❤️ Route de "health check" pour vérifier si le serveur est en ligne
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is running smoothly',
        date: new Date().toISOString()  // Retourne la date actuelle
    });
});

// 🔁 Route de test pour vérifier la connexion à Redis
app.get('/redis', async (req, res) => {
    try {
        // Connexion à Redis
        const client = await connectRedis();

        // Enregistrement d'une clé "key" avec la valeur "value"
        await client.set('key', 'value');

        // Lecture de la clé depuis Redis
        const value = await client.get('key');

        // Répond avec la valeur obtenue
        res.status(200).json({ value });
    } catch (error) {
        // En cas d'erreur (ex: Redis hors ligne)
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 🚀 Export de l'application Express pour qu'elle soit utilisée dans server.js
export default app;
