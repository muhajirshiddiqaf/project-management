const routes = (handler, auth) => [
  // === MIGRATION MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/migrations',
    handler: handler.createMigration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:create']) }
      ],
      validate: {
        payload: auth.createMigration
      },
      tags: ['migration', 'management']
    }
  },
  {
    method: 'GET',
    path: '/migrations',
    handler: handler.getMigrations,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        query: auth.getMigrations
      },
      tags: ['migration', 'management']
    }
  },
  {
    method: 'GET',
    path: '/migrations/{id}',
    handler: handler.getMigrationById,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        params: auth.getMigrationById
      },
      tags: ['migration', 'management']
    }
  },
  {
    method: 'PUT',
    path: '/migrations/{id}',
    handler: handler.updateMigration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:update']) }
      ],
      validate: {
        params: auth.getMigrationById,
        payload: auth.updateMigration
      },
      tags: ['migration', 'management']
    }
  },
  {
    method: 'DELETE',
    path: '/migrations/{id}',
    handler: handler.deleteMigration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:delete']) }
      ],
      validate: {
        params: auth.deleteMigration
      },
      tags: ['migration', 'management']
    }
  },

  // === MIGRATION EXECUTION ROUTES ===
  {
    method: 'POST',
    path: '/migrations/{id}/run',
    handler: handler.runMigration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:execute']) }
      ],
      validate: {
        params: auth.getMigrationById,
        payload: auth.runMigration
      },
      tags: ['migration', 'execution']
    }
  },
  {
    method: 'POST',
    path: '/migrations/run',
    handler: handler.runMigrations,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:execute']) }
      ],
      validate: {
        payload: auth.runMigrations
      },
      tags: ['migration', 'execution']
    }
  },
  {
    method: 'POST',
    path: '/migrations/{id}/rollback',
    handler: handler.rollbackMigration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:rollback']) }
      ],
      validate: {
        params: auth.getMigrationById,
        payload: auth.rollbackMigration
      },
      tags: ['migration', 'execution']
    }
  },
  {
    method: 'POST',
    path: '/migrations/rollback',
    handler: handler.rollbackMigrations,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:rollback']) }
      ],
      validate: {
        payload: auth.rollbackMigrations
      },
      tags: ['migration', 'execution']
    }
  },

  // === MIGRATION STATUS ROUTES ===
  {
    method: 'GET',
    path: '/migrations/status',
    handler: handler.getMigrationStatus,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        query: auth.getMigrationStatus
      },
      tags: ['migration', 'status']
    }
  },
  {
    method: 'GET',
    path: '/migrations/history',
    handler: handler.getMigrationHistory,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        query: auth.getMigrationHistory
      },
      tags: ['migration', 'history']
    }
  },

  // === SEEDING OPERATIONS ROUTES ===
  {
    method: 'POST',
    path: '/seeds',
    handler: handler.createSeed,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:create']) }
      ],
      validate: {
        payload: auth.createSeed
      },
      tags: ['seed', 'management']
    }
  },
  {
    method: 'GET',
    path: '/seeds',
    handler: handler.getSeeds,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:read']) }
      ],
      validate: {
        query: auth.getSeeds
      },
      tags: ['seed', 'management']
    }
  },
  {
    method: 'GET',
    path: '/seeds/{id}',
    handler: handler.getSeedById,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:read']) }
      ],
      validate: {
        params: auth.getSeedById
      },
      tags: ['seed', 'management']
    }
  },
  {
    method: 'PUT',
    path: '/seeds/{id}',
    handler: handler.updateSeed,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:update']) }
      ],
      validate: {
        params: auth.getSeedById,
        payload: auth.updateSeed
      },
      tags: ['seed', 'management']
    }
  },
  {
    method: 'DELETE',
    path: '/seeds/{id}',
    handler: handler.deleteSeed,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:delete']) }
      ],
      validate: {
        params: auth.deleteSeed
      },
      tags: ['seed', 'management']
    }
  },

  // === SEED EXECUTION ROUTES ===
  {
    method: 'POST',
    path: '/seeds/{id}/run',
    handler: handler.runSeed,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:execute']) }
      ],
      validate: {
        params: auth.getSeedById,
        payload: auth.runSeed
      },
      tags: ['seed', 'execution']
    }
  },
  {
    method: 'POST',
    path: '/seeds/run',
    handler: handler.runSeeds,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:execute']) }
      ],
      validate: {
        payload: auth.runSeeds
      },
      tags: ['seed', 'execution']
    }
  },

  // === VERSIONING ROUTES ===
  {
    method: 'GET',
    path: '/migrations/versions',
    handler: handler.getMigrationVersions,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['version:read']) }
      ],
      validate: {
        query: auth.getMigrationVersions
      },
      tags: ['migration', 'versioning']
    }
  },
  {
    method: 'POST',
    path: '/migrations/versions',
    handler: handler.createVersion,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['version:create']) }
      ],
      validate: {
        payload: auth.createVersion
      },
      tags: ['migration', 'versioning']
    }
  },
  {
    method: 'GET',
    path: '/migrations/versions/{id}',
    handler: handler.getVersionById,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['version:read']) }
      ],
      validate: {
        params: auth.getVersionById
      },
      tags: ['migration', 'versioning']
    }
  },
  {
    method: 'PUT',
    path: '/migrations/versions/{id}',
    handler: handler.updateVersion,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['version:update']) }
      ],
      validate: {
        params: auth.getVersionById,
        payload: auth.updateVersion
      },
      tags: ['migration', 'versioning']
    }
  },
  {
    method: 'DELETE',
    path: '/migrations/versions/{id}',
    handler: handler.deleteVersion,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['version:delete']) }
      ],
      validate: {
        params: auth.deleteVersion
      },
      tags: ['migration', 'versioning']
    }
  },

  // === DEPENDENCY MANAGEMENT ROUTES ===
  {
    method: 'GET',
    path: '/migrations/dependencies',
    handler: handler.getDependencies,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['dependency:read']) }
      ],
      validate: {
        query: auth.getDependencies
      },
      tags: ['migration', 'dependencies']
    }
  },
  {
    method: 'POST',
    path: '/migrations/dependencies',
    handler: handler.addDependency,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['dependency:create']) }
      ],
      validate: {
        payload: auth.addDependency
      },
      tags: ['migration', 'dependencies']
    }
  },
  {
    method: 'DELETE',
    path: '/migrations/dependencies',
    handler: handler.removeDependency,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['dependency:delete']) }
      ],
      validate: {
        payload: auth.removeDependency
      },
      tags: ['migration', 'dependencies']
    }
  },

  // === VALIDATION & TESTING ROUTES ===
  {
    method: 'POST',
    path: '/migrations/{id}/validate',
    handler: handler.validateMigration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:validate']) }
      ],
      validate: {
        params: auth.getMigrationById,
        payload: auth.validateMigration
      },
      tags: ['migration', 'validation']
    }
  },
  {
    method: 'POST',
    path: '/seeds/{id}/validate',
    handler: handler.validateSeed,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:validate']) }
      ],
      validate: {
        params: auth.getSeedById,
        payload: auth.validateSeed
      },
      tags: ['seed', 'validation']
    }
  },
  {
    method: 'POST',
    path: '/migrations/{id}/test',
    handler: handler.testMigration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:test']) }
      ],
      validate: {
        params: auth.getMigrationById,
        payload: auth.testMigration
      },
      tags: ['migration', 'testing']
    }
  },
  {
    method: 'POST',
    path: '/seeds/{id}/test',
    handler: handler.testSeed,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:test']) }
      ],
      validate: {
        params: auth.getSeedById,
        payload: auth.testSeed
      },
      tags: ['seed', 'testing']
    }
  },

  // === EXPORT & IMPORT ROUTES ===
  {
    method: 'GET',
    path: '/migrations/{id}/export',
    handler: handler.exportMigration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:export']) }
      ],
      validate: {
        params: auth.getMigrationById,
        query: auth.exportMigration
      },
      tags: ['migration', 'export']
    }
  },
  {
    method: 'GET',
    path: '/seeds/{id}/export',
    handler: handler.exportSeed,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:export']) }
      ],
      validate: {
        params: auth.getSeedById,
        query: auth.exportSeed
      },
      tags: ['seed', 'export']
    }
  },
  {
    method: 'POST',
    path: '/migrations/import',
    handler: handler.importMigration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:import']) }
      ],
      validate: {
        payload: auth.importMigration
      },
      tags: ['migration', 'import']
    }
  },
  {
    method: 'POST',
    path: '/seeds/import',
    handler: handler.importSeed,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:import']) }
      ],
      validate: {
        payload: auth.importSeed
      },
      tags: ['seed', 'import']
    }
  },

  // === BULK OPERATIONS ROUTES ===
  {
    method: 'POST',
    path: '/migrations/bulk',
    handler: handler.bulkCreateMigrations,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:create']) }
      ],
      validate: {
        payload: auth.bulkCreateMigrations
      },
      tags: ['migration', 'bulk']
    }
  },
  {
    method: 'POST',
    path: '/seeds/bulk',
    handler: handler.bulkCreateSeeds,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:create']) }
      ],
      validate: {
        payload: auth.bulkCreateSeeds
      },
      tags: ['seed', 'bulk']
    }
  },

  // === STATISTICS & REPORTING ROUTES ===
  {
    method: 'GET',
    path: '/migrations/statistics',
    handler: handler.getMigrationStatistics,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:read']) }
      ],
      validate: {
        query: auth.getMigrationStatistics
      },
      tags: ['migration', 'statistics']
    }
  },
  {
    method: 'GET',
    path: '/seeds/statistics',
    handler: handler.getSeedStatistics,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:read']) }
      ],
      validate: {
        query: auth.getSeedStatistics
      },
      tags: ['seed', 'statistics']
    }
  },
  {
    method: 'GET',
    path: '/migrations/report',
    handler: handler.generateMigrationReport,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['migration:report']) }
      ],
      validate: {
        query: auth.generateMigrationReport
      },
      tags: ['migration', 'reporting']
    }
  },
  {
    method: 'GET',
    path: '/seeds/report',
    handler: handler.generateSeedReport,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['seed:report']) }
      ],
      validate: {
        query: auth.generateSeedReport
      },
      tags: ['seed', 'reporting']
    }
  }
];

module.exports = routes;
