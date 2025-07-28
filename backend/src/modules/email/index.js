const emailRoutes = require('./routes');
const emailHandler = require('./handler');
const EmailRepository = require('../../infrastructure/repositories/emailRepository');

const emailModule = {
  name: 'email',
  register: async function (server, options) {
    const db = server.app.db;
    const emailRepository = new EmailRepository(db);
    emailHandler.setEmailRepository(emailRepository);
    server.route(emailRoutes);
  }
};

module.exports = emailModule;
