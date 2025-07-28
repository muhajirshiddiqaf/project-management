const migrationHandler = require('./handler');
const migrationValidator = require('./validator');
const { roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === MIGRATION MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/migrations',
    handler: migrationHandler.createMigration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:create']) }
      ],
      validate: {
        payload: migrationValidator.createMigration
      },
      tags: ['migration', 'management']
    }
  },
  {
    method: 'GET',
    path: '/migrations',
    handler: migrationHandler.getMigrations,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        query: migrationValidator.getMigrations
      },
      tags: ['migration', 'management']
    }
  },
  {
    method: 'GET',
    path: '/migrations/{id}',
    handler: migrationHandler.getMigrationById,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        params: migrationValidator.getMigrationById
      },
      tags: ['migration', 'management']
    }
  },
  {
    method: 'PUT',
    path: '/migrations/{id}',
    handler: migrationHandler.updateMigration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:update']) }
      ],
      validate: {
        params: migrationValidator.getMigrationById,
        payload: migrationValidator.updateMigration
      },
      tags: ['migration', 'management']
    }
  },
  {
    method: 'DELETE',
    path: '/migrations/{id}',
    handler: migrationHandler.deleteMigration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:delete']) }
      ],
      validate: {
        params: migrationValidator.deleteMigration
      },
      tags: ['migration', 'management']
    }
  },

  // === MIGRATION EXECUTION ROUTES ===
  {
    method: 'POST',
    path: '/migrations/{id}/run',
    handler: migrationHandler.runMigration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:execute']) }
      ],
      validate: {
        params: migrationValidator.getMigrationById,
        payload: migrationValidator.runMigration
      },
      tags: ['migration', 'execution']
    }
  },
  {
    method: 'POST',
    path: '/migrations/run',
    handler: migrationHandler.runMigrations,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:execute']) }
      ],
      validate: {
        payload: migrationValidator.runMigrations
      },
      tags: ['migration', 'execution']
    }
  },
  {
    method: 'POST',
    path: '/migrations/{id}/rollback',
    handler: migrationHandler.rollbackMigration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:rollback']) }
      ],
      validate: {
        params: migrationValidator.getMigrationById,
        payload: migrationValidator.rollbackMigration
      },
      tags: ['migration', 'execution']
    }
  },
  {
    method: 'POST',
    path: '/migrations/rollback',
    handler: migrationHandler.rollbackMigrations,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:rollback']) }
      ],
      validate: {
        payload: migrationValidator.rollbackMigrations
      },
      tags: ['migration', 'execution']
    }
  },

  // === MIGRATION STATUS ROUTES ===
  {
    method: 'GET',
    path: '/migrations/status',
    handler: migrationHandler.getMigrationStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        query: migrationValidator.getMigrationStatus
      },
      tags: ['migration', 'status']
    }
  },
  {
    method: 'GET',
    path: '/migrations/history',
    handler: migrationHandler.getMigrationHistory,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        query: migrationValidator.getMigrationHistory
      },
      tags: ['migration', 'history']
    }
  },

  // === SEEDING OPERATIONS ROUTES ===
  {
    method: 'POST',
    path: '/seeds',
    handler: migrationHandler.createSeed,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:create']) }
      ],
      validate: {
        payload: migrationValidator.createSeed
      },
      tags: ['seed', 'management']
    }
  },
  {
    method: 'GET',
    path: '/seeds',
    handler: migrationHandler.getSeeds,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:read']) }
      ],
      validate: {
        query: migrationValidator.getSeeds
      },
      tags: ['seed', 'management']
    }
  },
  {
    method: 'GET',
    path: '/seeds/{id}',
    handler: migrationHandler.getSeedById,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:read']) }
      ],
      validate: {
        params: migrationValidator.getSeedById
      },
      tags: ['seed', 'management']
    }
  },
  {
    method: 'PUT',
    path: '/seeds/{id}',
    handler: migrationHandler.updateSeed,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:update']) }
      ],
      validate: {
        params: migrationValidator.getSeedById,
        payload: migrationValidator.updateSeed
      },
      tags: ['seed', 'management']
    }
  },
  {
    method: 'DELETE',
    path: '/seeds/{id}',
    handler: migrationHandler.deleteSeed,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:delete']) }
      ],
      validate: {
        params: migrationValidator.deleteSeed
      },
      tags: ['seed', 'management']
    }
  },

  // === SEED EXECUTION ROUTES ===
  {
    method: 'POST',
    path: '/seeds/{id}/run',
    handler: migrationHandler.runSeed,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:execute']) }
      ],
      validate: {
        params: migrationValidator.getSeedById,
        payload: migrationValidator.runSeed
      },
      tags: ['seed', 'execution']
    }
  },
  {
    method: 'POST',
    path: '/seeds/run',
    handler: migrationHandler.runSeeds,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:execute']) }
      ],
      validate: {
        payload: migrationValidator.runSeeds
      },
      tags: ['seed', 'execution']
    }
  },

  // === VERSIONING ROUTES ===
  {
    method: 'GET',
    path: '/migrations/versions',
    handler: migrationHandler.getMigrationVersions,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['version:read']) }
      ],
      validate: {
        query: migrationValidator.getMigrationVersions
      },
      tags: ['migration', 'versioning']
    }
  },
  {
    method: 'POST',
    path: '/migrations/versions',
    handler: migrationHandler.createVersion,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['version:create']) }
      ],
      validate: {
        payload: migrationValidator.createVersion
      },
      tags: ['migration', 'versioning']
    }
  },
  {
    method: 'GET',
    path: '/migrations/versions/{id}',
    handler: migrationHandler.getVersionById,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['version:read']) }
      ],
      validate: {
        params: migrationValidator.getVersionById
      },
      tags: ['migration', 'versioning']
    }
  },
  {
    method: 'PUT',
    path: '/migrations/versions/{id}',
    handler: migrationHandler.updateVersion,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['version:update']) }
      ],
      validate: {
        params: migrationValidator.getVersionById,
        payload: migrationValidator.updateVersion
      },
      tags: ['migration', 'versioning']
    }
  },
  {
    method: 'DELETE',
    path: '/migrations/versions/{id}',
    handler: migrationHandler.deleteVersion,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['version:delete']) }
      ],
      validate: {
        params: migrationValidator.deleteVersion
      },
      tags: ['migration', 'versioning']
    }
  },

  // === DEPENDENCY MANAGEMENT ROUTES ===
  {
    method: 'GET',
    path: '/migrations/dependencies',
    handler: migrationHandler.getDependencies,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['dependency:read']) }
      ],
      validate: {
        query: migrationValidator.getDependencies
      },
      tags: ['migration', 'dependencies']
    }
  },
  {
    method: 'POST',
    path: '/migrations/dependencies',
    handler: migrationHandler.addDependency,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['dependency:create']) }
      ],
      validate: {
        payload: migrationValidator.addDependency
      },
      tags: ['migration', 'dependencies']
    }
  },
  {
    method: 'DELETE',
    path: '/migrations/dependencies',
    handler: migrationHandler.removeDependency,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['dependency:delete']) }
      ],
      validate: {
        payload: migrationValidator.removeDependency
      },
      tags: ['migration', 'dependencies']
    }
  },

  // === VALIDATION & TESTING ROUTES ===
  {
    method: 'POST',
    path: '/migrations/{id}/validate',
    handler: migrationHandler.validateMigration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:validate']) }
      ],
      validate: {
        params: migrationValidator.getMigrationById,
        payload: migrationValidator.validateMigration
      },
      tags: ['migration', 'validation']
    }
  },
  {
    method: 'POST',
    path: '/seeds/{id}/validate',
    handler: migrationHandler.validateSeed,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:validate']) }
      ],
      validate: {
        params: migrationValidator.getSeedById,
        payload: migrationValidator.validateSeed
      },
      tags: ['seed', 'validation']
    }
  },
  {
    method: 'POST',
    path: '/migrations/{id}/test',
    handler: migrationHandler.testMigration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:test']) }
      ],
      validate: {
        params: migrationValidator.getMigrationById,
        payload: migrationValidator.testMigration
      },
      tags: ['migration', 'testing']
    }
  },
  {
    method: 'POST',
    path: '/seeds/{id}/test',
    handler: migrationHandler.testSeed,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:test']) }
      ],
      validate: {
        params: migrationValidator.getSeedById,
        payload: migrationValidator.testSeed
      },
      tags: ['seed', 'testing']
    }
  },

  // === EXPORT & IMPORT ROUTES ===
  {
    method: 'GET',
    path: '/migrations/{id}/export',
    handler: migrationHandler.exportMigration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:export']) }
      ],
      validate: {
        params: migrationValidator.getMigrationById,
        query: migrationValidator.exportMigration
      },
      tags: ['migration', 'export']
    }
  },
  {
    method: 'GET',
    path: '/seeds/{id}/export',
    handler: migrationHandler.exportSeed,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:export']) }
      ],
      validate: {
        params: migrationValidator.getSeedById,
        query: migrationValidator.exportSeed
      },
      tags: ['seed', 'export']
    }
  },
  {
    method: 'POST',
    path: '/migrations/import',
    handler: migrationHandler.importMigration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:import']) }
      ],
      validate: {
        payload: migrationValidator.importMigration
      },
      tags: ['migration', 'import']
    }
  },
  {
    method: 'POST',
    path: '/seeds/import',
    handler: migrationHandler.importSeed,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:import']) }
      ],
      validate: {
        payload: migrationValidator.importSeed
      },
      tags: ['seed', 'import']
    }
  },

  // === BULK OPERATIONS ROUTES ===
  {
    method: 'POST',
    path: '/migrations/bulk',
    handler: migrationHandler.bulkCreateMigrations,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:create']) }
      ],
      validate: {
        payload: migrationValidator.bulkCreateMigrations
      },
      tags: ['migration', 'bulk']
    }
  },
  {
    method: 'POST',
    path: '/seeds/bulk',
    handler: migrationHandler.bulkCreateSeeds,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:create']) }
      ],
      validate: {
        payload: migrationValidator.bulkCreateSeeds
      },
      tags: ['seed', 'bulk']
    }
  },

  // === STATISTICS & REPORTING ROUTES ===
  {
    method: 'GET',
    path: '/migrations/statistics',
    handler: migrationHandler.getMigrationStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        query: migrationValidator.getMigrationStatistics
      },
      tags: ['migration', 'statistics']
    }
  },
  {
    method: 'GET',
    path: '/seeds/statistics',
    handler: migrationHandler.getSeedStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:read']) }
      ],
      validate: {
        query: migrationValidator.getSeedStatistics
      },
      tags: ['seed', 'statistics']
    }
  },
  {
    method: 'GET',
    path: '/migrations/report',
    handler: migrationHandler.generateMigrationReport,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['migration:report']) }
      ],
      validate: {
        query: migrationValidator.generateMigrationReport
      },
      tags: ['migration', 'reporting']
    }
  },
  {
    method: 'GET',
    path: '/seeds/report',
    handler: migrationHandler.generateSeedReport,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['seed:report']) }
      ],
      validate: {
        query: migrationValidator.generateSeedReport
      },
      tags: ['seed', 'reporting']
    }
  }
];

module.exports = routes;
