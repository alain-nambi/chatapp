// 📦 Importe la fonction createServer depuis le module http natif de Node.js
import { createServer } from 'http';

// 📥 Importe l'application Express que tu as définie dans app.js
import app from './app.js';

// 🔌 Importe ta logique Socket.IO personnalisée
import { initSocketIO } from './utils/socket.js';

// 🌐 Définit le port sur lequel ton serveur va écouter
// Si la variable d'environnement NODE_PORT existe, on l’utilise ; sinon, le port 3000 est utilisé par défaut
const PORT = process.env.NODE_PORT || 3000;

// 🏗️ Crée un serveur HTTP basé sur ton application Express
const server = createServer(app);

// ⚡ Initialise Socket.IO en attachant le serveur HTTP
initSocketIO(server);

// 🚀 Démarre le serveur et écoute les requêtes sur le port défini
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
