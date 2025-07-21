'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Créer un utilisateur
    await queryInterface.bulkInsert('Users', [{
      username: 'demo_user',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Récupérer l'utilisateur créé
    const [user] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE username = 'demo_user' LIMIT 1;`
    );

    const userId = user[0].id;

    // Créer des messages liés à cet utilisateur
    await queryInterface.bulkInsert('Messages', [
      {
        text: 'Bonjour, ceci est un message.',
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Voici un deuxième message.',
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Messages', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
