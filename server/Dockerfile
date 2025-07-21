FROM node:18-alpine

# Installer pnpm (global)
RUN yarn global add pnpm nodemon

# Créer le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers pour installer les dépendances
COPY package*.json ./

# Installer les dépendances du projet
RUN pnpm install

# Copier le reste du code
COPY . .

# Lancer l'application en mode développement
CMD ["nodemon"]

