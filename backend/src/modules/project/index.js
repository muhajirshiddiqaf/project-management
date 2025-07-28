const projectRoutes = require('./routes');
const projectHandler = require('./handler');
const ProjectRepository = require('../../infrastructure/repositories/projectRepository');

const projectModule = {
  name: 'project',
  register: async function (server, options) {
    // Get database connection
    const db = server.app.db;

    // Create repository instance
    const projectRepository = new ProjectRepository(db);

    // Inject repository into handler
    projectHandler.setProjectRepository(projectRepository);

    // Register routes
    server.route(projectRoutes);
  }
};

module.exports = projectModule;
