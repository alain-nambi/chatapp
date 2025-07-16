# ChatApp avec Node.js, Prisma & JWT

**Auteur : Alain Nambii**

---

## Description

Ce projet est une application de messagerie en temps réel (ChatApp) sécurisée, développée avec Node.js.  
Elle intègre un système complet d'authentification utilisateur via Prisma ORM et JSON Web Tokens (JWT), ainsi que la gestion des conversations en temps réel.

Fonctionnalités principales : inscription, connexion, rafraîchissement de token, déconnexion, gestion des utilisateurs, conversations privées et en groupe, envoi et réception des messages en temps réel.

---

## Étapes du projet

1. **Création de la base de données avec Prisma**  
   - Modélisation des utilisateurs (User), conversations (Chat), messages (Message)  
   - Migration de la base de données

2. **Inscription (Register)**  
   - Hashage du mot de passe avec bcrypt  
   - Création d’un utilisateur avec validation des contraintes (email unique, etc)  
   - Gestion des erreurs Prisma spécifiques

3. **Connexion (Login)**  
   - Vérification des identifiants utilisateur  
   - Génération des tokens JWT (access token & refresh token)  
   - Stockage sécurisé des tokens dans des cookies HTTP-only

4. **Middleware d’authentification**  
   - Validation des tokens d’accès pour sécuriser les routes privées

5. **Rafraîchissement de token (Refresh Token)**  
   - Validation et génération d’un nouveau token d’accès via le refresh token

6. **Déconnexion (Logout)**  
   - Suppression des cookies d’authentification

7. **Gestion des contacts et conversations**  
   - Ajout/suppression de contacts  
   - Création de conversations privées ou de groupe  
   - Ajout et suppression de membres dans une conversation de groupe

8. **Envoi et réception des messages en temps réel**  
   - Intégration de WebSocket (ex: Socket.io) pour communication bidirectionnelle  
   - Gestion de la réception et de l’affichage instantané des messages  
   - Gestion des notifications de nouveaux messages

9. **Historique des messages**  
   - Chargement paginé des anciens messages  
   - Marquage des messages comme lus/non lus

10. **Gestion des erreurs et validation**  
    - Validation des données avec Zod  
    - Gestion des erreurs Prisma et serveur

---


## Librairies utilisées

- **[Prisma](https://www.prisma.io/)** : ORM moderne pour gérer la base de données avec facilité et sécurité  
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** : Pour le hachage sécurisé des mots de passe  
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** : Création et vérification des tokens JWT  
- **[cookie-parser](https://www.npmjs.com/package/cookie-parser)** : Gestion des cookies dans Express.js  
- **[zod](https://github.com/colinhacks/zod)** : Validation et parsing des données en JavaScript  
- **[express](https://expressjs.com/)** : Framework web Node.js  
- **[socket.io](https://socket.io/)** : Communication en temps réel WebSocket  
- **[winston/pino](https://github.com/winstonjs/winston) (optionnel)** : Pour un logging structuré et performant

---

## Conseils de sécurité

- Stocker les tokens JWT dans des cookies HTTP-only pour éviter les attaques XSS  
- Utiliser une clé secrète robuste et la stocker dans un fichier `.env`  
- Définir une courte durée de vie pour le token d’accès (ex: 15 minutes)  
- Utiliser un refresh token pour prolonger la session sans demander à l’utilisateur de se reconnecter  
- Toujours valider et nettoyer les données utilisateur avec Zod ou une autre librairie de validation côté serveur  
- Sécuriser les WebSockets avec authentification par token JWT


## Structure recommandée
```
/controllers # Logique métier des routes
/middlewares # Middleware d’authentification, gestion d’erreurs, validation
/routes # Définition des routes API
/services # Services pour la génération des tokens, interaction avec Prisma
/utils # Helpers et fonctions utilitaires (ex: gestion des erreurs Prisma)
/validators # Schémas Zod pour valider les entrées utilisateurs
```


---

## Comment démarrer

1. Cloner le dépôt  
2. Installer les dépendances  

```
npm install
```

3. Configurer le fichier `.env` avec :  
- `DATABASE_URL` (connexion à la base de données)  
- `JWT_ACCESS_SECRET` et `JWT_REFRESH_SECRET`  
- `NODE_ENV` (production ou development)  
4. Lancer les migrations Prisma  

```
npx prisma migrate dev
```

5. Démarrer le serveur (development)
```
nodemon index.js
```


---

## Auteur

Alain Nambii

---

## Licence

MIT © Alain Nambii

---