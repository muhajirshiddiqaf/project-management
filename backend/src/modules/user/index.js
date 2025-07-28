const userRoutes = require('./routes');
const userHandler = require('./handler');
const UserRepository = require('../../infrastructure/repositories/userRepository');

const userModule = {
  name: 'user',
  register: async function (server, options) {
    const db = server.app.db;
    const userRepository = new UserRepository(db);
    userHandler.setUserRepository(userRepository);
    server.route(userRoutes);
  }
};

module.exports = userModule;
