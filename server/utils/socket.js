import { Server } from "socket.io";

// 🔐 On garde une table des utilisateurs connectés avec leur socket.id
// Format : Map(socket.id => userId)
const users = new Map();

export const initSocketIO = (server) => {
    // 🔌 On crée un serveur Socket.IO basé sur le serveur HTTP existant
    const io = new Server(server, {
        cors: {
            origin: "*", // autorise toutes les origines (frontend)
        },
    });

    // 🟢 Quand un client se connecte
    io.on("connection", (socket) => {
        console.log("✅ New client connected :", socket.id);

        // 📌 Quand l'utilisateur s'enregistre avec son ID (ex : user1, user2)
        socket.on("register", (userId) => {
            users.set(socket.id, userId); // on enregistre le lien socket.id <-> userId
            console.log(`📌 User registered: ${userId} => ${socket.id}`);
        });

        // 📩 Quand un utilisateur envoie un message
        socket.on("message", ({ from, to, text }) => {
            console.log(`📨 Message from ${from} to ${to} : ${text}`);

            // 🔍 Trouver le socket.id du destinataire `to`
            // On parcourt tous les couples [socketId, userId]
            // On cherche le socketId dont le userId === to
            const recipientSocketId = [...users.entries()].find(
                ([, userId]) => userId === to
            )?.[0]; // Si trouvé, on prend le socketId (clé)

            if (recipientSocketId) {
                // 📤 Si le destinataire est connecté, on lui envoie le message
                io.to(recipientSocketId).emit("receive-message", {
                    from,      // qui a envoyé
                    text,      // le contenu
                    timestamp: new Date().toISOString(), // l'heure d'envoi
                });
                console.log(`✅ Message sent to ${to}`);
            } else {
                // ❌ Si l'utilisateur n'est pas connecté
                console.log(`❌ Recipient ${to} not found`);
            }
        });

        // 🔴 Quand un client se déconnecte
        socket.on("disconnect", () => {
            console.log("❎ Client disconnected :", socket.id);
            users.delete(socket.id); // on retire son entrée de la Map
        });
    });
};
