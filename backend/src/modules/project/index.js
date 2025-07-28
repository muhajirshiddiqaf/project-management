const ProjectHandler = require('./handler');
const routes = require('./routes');

const project = async (server, { service, validator, auth }) => {
  const projectHandler = new ProjectHandler(service, validator);
  server.route(routes(projectHandler, auth));
};

module.exports = {
  name: 'project',
  version: '1.0.0',
  register: project
};
