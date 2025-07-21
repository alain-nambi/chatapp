# 📘 Documentation Sequelize – Projet Node.js

Ce projet utilise **Sequelize** avec son **CLI** pour gérer :

- les **modèles** (`models`)
- les **migrations** de base de données
- les **seeders** de données

---

## 📦 Installation du CLI Sequelize

```bash
npm install --save sequelize
npm install --save-dev sequelize-cli
```



## 🔧 Génération de modèles

```bash
npx sequelize-cli model:generate --name User --attributes username:string
npx sequelize-cli model:generate --name Message --attributes text:string,userId:integer
```


## 🔁 Migrations
```bash
# Exécuter toutes les migrations
npx sequelize-cli db:migrate

# Annuler la dernière migration
npx sequelize-cli db:migrate:undo

# Annuler toutes les migrations
npx sequelize-cli db:migrate:undo:all
```

## 🌱 Seeders

```bash
# Générer un fichier de seed
npx sequelize-cli seed:generate --name demo-user-message

# Exécuter tous les seeders
npx sequelize-cli db:seed:all

# Annuler tous les seeders
npx sequelize-cli db:seed:undo:all
```

## 🛠️ Autres

```bash
# Vérifier la version du CLI et des dépendances
npx sequelize-cli --version
```