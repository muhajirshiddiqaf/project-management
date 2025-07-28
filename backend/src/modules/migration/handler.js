const Boom = require('@hapi/boom');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');
const xlsx = require('xlsx');

class MigrationHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.createMigration = this.createMigration.bind(this);
    this.getMigrations = this.getMigrations.bind(this);
    this.getMigrationById = this.getMigrationById.bind(this);
    this.updateMigration = this.updateMigration.bind(this);
    this.deleteMigration = this.deleteMigration.bind(this);
    this.runMigration = this.runMigration.bind(this);
    this.runMigrations = this.runMigrations.bind(this);
    this.rollbackMigration = this.rollbackMigration.bind(this);
    this.rollbackMigrations = this.rollbackMigrations.bind(this);
    this.getMigrationStatus = this.getMigrationStatus.bind(this);
    this.getMigrationHistory = this.getMigrationHistory.bind(this);
    this.createSeed = this.createSeed.bind(this);
    this.getSeeds = this.getSeeds.bind(this);
    this.getSeedById = this.getSeedById.bind(this);
    this.updateSeed = this.updateSeed.bind(this);
    this.deleteSeed = this.deleteSeed.bind(this);
    this.runSeed = this.runSeed.bind(this);
    this.runSeeds = this.runSeeds.bind(this);
    this.getMigrationVersions = this.getMigrationVersions.bind(this);
    this.createVersion = this.createVersion.bind(this);
    this.getVersionById = this.getVersionById.bind(this);
    this.updateVersion = this.updateVersion.bind(this);
    this.deleteVersion = this.deleteVersion.bind(this);
    this.getDependencies = this.getDependencies.bind(this);
    this.addDependency = this.addDependency.bind(this);
    this.removeDependency = this.removeDependency.bind(this);
    this.validateMigration = this.validateMigration.bind(this);
    this.validateSeed = this.validateSeed.bind(this);
    this.testMigration = this.testMigration.bind(this);
    this.testSeed = this.testSeed.bind(this);
    this.exportMigration = this.exportMigration.bind(this);
    this.exportSeed = this.exportSeed.bind(this);
    this.importMigration = this.importMigration.bind(this);
    this.importSeed = this.importSeed.bind(this);
    this.bulkCreateMigrations = this.bulkCreateMigrations.bind(this);
    this.bulkCreateSeeds = this.bulkCreateSeeds.bind(this);
    this.getMigrationStatistics = this.getMigrationStatistics.bind(this);
    this.getSeedStatistics = this.getSeedStatistics.bind(this);
    this.generateMigrationReport = this.generateMigrationReport.bind(this);
    this.generateSeedReport = this.generateSeedReport.bind(this);
  }

  // === MIGRATION MANAGEMENT ===

  async createMigration(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const migrationData = request.payload;

      const migration = await this._service.createMigration({
        ...migrationData,
        created_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'create',
        resource: 'migration',
        resource_id: migration.id,
        details: { name: migrationData.name, type: migrationData.type, version: migrationData.version },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migration created successfully',
        data: migration
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create migration');
    }
  }

  async getMigrations(request, h) {
    try {
      const { page, limit, status, type, version, start_date, end_date, sort_by, sort_order } = request.query;

      const filters = { status, type, version, start_date, end_date };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [migrations, total] = await Promise.all([
        this._service.getMigrations(filters, pagination),
        this._service.countMigrations(filters)
      ]);

      return h.response({
        success: true,
        data: {
          migrations,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get migrations');
    }
  }

  async getMigrationById(request, h) {
    try {
      const { id } = request.params;

      const migration = await this._service.getMigrationById(id);
      if (!migration) {
        throw Boom.notFound('Migration not found');
      }

      return h.response({
        success: true,
        data: migration
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get migration');
    }
  }

  async updateMigration(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const updateData = request.payload;

      const migration = await this._service.updateMigration(id, updateData);
      if (!migration) {
        throw Boom.notFound('Migration not found');
      }

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'update',
        resource: 'migration',
        resource_id: id,
        details: { updated_fields: Object.keys(updateData) },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migration updated successfully',
        data: migration
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update migration');
    }
  }

  async deleteMigration(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;

      const migration = await this._service.deleteMigration(id);
      if (!migration) {
        throw Boom.notFound('Migration not found');
      }

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'delete',
        resource: 'migration',
        resource_id: id,
        details: { migration_name: migration.name },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migration deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete migration');
    }
  }

  // === MIGRATION EXECUTION ===

  async runMigration(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const { force, dry_run, rollback_on_failure, timeout_seconds } = request.payload;

      const result = await this._service.runMigration({
        id,
        force,
        dry_run,
        rollback_on_failure,
        timeout_seconds,
        executed_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'execute',
        resource: 'migration',
        resource_id: id,
        details: { force, dry_run, rollback_on_failure, timeout_seconds },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migration executed successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to run migration');
    }
  }

  async runMigrations(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { version, type, force, dry_run, rollback_on_failure, timeout_seconds, batch_size } = request.payload;

      const result = await this._service.runMigrations({
        version,
        type,
        force,
        dry_run,
        rollback_on_failure,
        timeout_seconds,
        batch_size,
        executed_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'execute_bulk',
        resource: 'migration',
        resource_id: 'bulk',
        details: { version, type, force, dry_run, count: result.executed_count },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migrations executed successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to run migrations');
    }
  }

  async rollbackMigration(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const { force, dry_run, timeout_seconds } = request.payload;

      const result = await this._service.rollbackMigration({
        id,
        force,
        dry_run,
        timeout_seconds,
        executed_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'rollback',
        resource: 'migration',
        resource_id: id,
        details: { force, dry_run, timeout_seconds },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migration rolled back successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to rollback migration');
    }
  }

  async rollbackMigrations(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { version, type, force, dry_run, timeout_seconds, limit } = request.payload;

      const result = await this._service.rollbackMigrations({
        version,
        type,
        force,
        dry_run,
        timeout_seconds,
        limit,
        executed_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'rollback_bulk',
        resource: 'migration',
        resource_id: 'bulk',
        details: { version, type, force, dry_run, count: result.rolled_back_count },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migrations rolled back successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to rollback migrations');
    }
  }

  // === MIGRATION STATUS ===

  async getMigrationStatus(request, h) {
    try {
      const { id, version } = request.query;

      const status = await this._service.getMigrationStatus({ id, version });

      return h.response({
        success: true,
        data: status
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get migration status');
    }
  }

  async getMigrationHistory(request, h) {
    try {
      const { page, limit, status, type, version, start_date, end_date, sort_by, sort_order } = request.query;

      const filters = { status, type, version, start_date, end_date };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [history, total] = await Promise.all([
        this._service.getMigrationHistory(filters, pagination),
        this._service.countMigrationHistory(filters)
      ]);

      return h.response({
        success: true,
        data: {
          history,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get migration history');
    }
  }

  // === SEEDING OPERATIONS ===

  async createSeed(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const seedData = request.payload;

      const seed = await this._service.createSeed({
        ...seedData,
        created_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'create',
        resource: 'seed',
        resource_id: seed.id,
        details: { name: seedData.name, table_name: seedData.table_name },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Seed created successfully',
        data: seed
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create seed');
    }
  }

  async getSeeds(request, h) {
    try {
      const { page, limit, table_name, status, start_date, end_date, sort_by, sort_order } = request.query;

      const filters = { table_name, status, start_date, end_date };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [seeds, total] = await Promise.all([
        this._service.getSeeds(filters, pagination),
        this._service.countSeeds(filters)
      ]);

      return h.response({
        success: true,
        data: {
          seeds,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get seeds');
    }
  }

  async getSeedById(request, h) {
    try {
      const { id } = request.params;

      const seed = await this._service.getSeedById(id);
      if (!seed) {
        throw Boom.notFound('Seed not found');
      }

      return h.response({
        success: true,
        data: seed
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get seed');
    }
  }

  async updateSeed(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const updateData = request.payload;

      const seed = await this._service.updateSeed(id, updateData);
      if (!seed) {
        throw Boom.notFound('Seed not found');
      }

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'update',
        resource: 'seed',
        resource_id: id,
        details: { updated_fields: Object.keys(updateData) },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Seed updated successfully',
        data: seed
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update seed');
    }
  }

  async deleteSeed(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;

      const seed = await this._service.deleteSeed(id);
      if (!seed) {
        throw Boom.notFound('Seed not found');
      }

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'delete',
        resource: 'seed',
        resource_id: id,
        details: { seed_name: seed.name },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Seed deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete seed');
    }
  }

  // === SEED EXECUTION ===

  async runSeed(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const { force, dry_run, update_existing, timeout_seconds } = request.payload;

      const result = await this._service.runSeed({
        id,
        force,
        dry_run,
        update_existing,
        timeout_seconds,
        executed_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'execute',
        resource: 'seed',
        resource_id: id,
        details: { force, dry_run, update_existing, timeout_seconds },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Seed executed successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to run seed');
    }
  }

  async runSeeds(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { table_name, force, dry_run, update_existing, timeout_seconds, batch_size } = request.payload;

      const result = await this._service.runSeeds({
        table_name,
        force,
        dry_run,
        update_existing,
        timeout_seconds,
        batch_size,
        executed_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'execute_bulk',
        resource: 'seed',
        resource_id: 'bulk',
        details: { table_name, force, dry_run, count: result.executed_count },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Seeds executed successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to run seeds');
    }
  }

  // === VERSIONING ===

  async getMigrationVersions(request, h) {
    try {
      const { include_completed, include_failed, sort_order } = request.query;

      const versions = await this._service.getMigrationVersions({
        include_completed,
        include_failed,
        sort_order
      });

      return h.response({
        success: true,
        data: versions
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get migration versions');
    }
  }

  async createVersion(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const versionData = request.payload;

      const version = await this._service.createVersion({
        ...versionData,
        created_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'create',
        resource: 'version',
        resource_id: version.id,
        details: { version: versionData.version, is_major: versionData.is_major },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Version created successfully',
        data: version
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create version');
    }
  }

  async getVersionById(request, h) {
    try {
      const { id } = request.params;

      const version = await this._service.getVersionById(id);
      if (!version) {
        throw Boom.notFound('Version not found');
      }

      return h.response({
        success: true,
        data: version
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get version');
    }
  }

  async updateVersion(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const updateData = request.payload;

      const version = await this._service.updateVersion(id, updateData);
      if (!version) {
        throw Boom.notFound('Version not found');
      }

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'update',
        resource: 'version',
        resource_id: id,
        details: { updated_fields: Object.keys(updateData) },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Version updated successfully',
        data: version
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update version');
    }
  }

  async deleteVersion(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;

      const version = await this._service.deleteVersion(id);
      if (!version) {
        throw Boom.notFound('Version not found');
      }

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'delete',
        resource: 'version',
        resource_id: id,
        details: { version_number: version.version },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Version deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete version');
    }
  }

  // === DEPENDENCY MANAGEMENT ===

  async getDependencies(request, h) {
    try {
      const { migration_id, seed_id, version_id, type } = request.query;

      const dependencies = await this._service.getDependencies({
        migration_id,
        seed_id,
        version_id,
        type
      });

      return h.response({
        success: true,
        data: dependencies
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get dependencies');
    }
  }

  async addDependency(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const dependencyData = request.payload;

      const dependency = await this._service.addDependency({
        ...dependencyData,
        created_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'add_dependency',
        resource: 'dependency',
        resource_id: dependency.id,
        details: {
          source_type: dependencyData.source_type,
          target_type: dependencyData.target_type,
          dependency_type: dependencyData.dependency_type
        },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Dependency added successfully',
        data: dependency
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to add dependency');
    }
  }

  async removeDependency(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { source_id, source_type, target_id, target_type } = request.payload;

      const dependency = await this._service.removeDependency({
        source_id,
        source_type,
        target_id,
        target_type
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'remove_dependency',
        resource: 'dependency',
        resource_id: dependency.id,
        details: { source_type, target_type },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Dependency removed successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to remove dependency');
    }
  }

  // === VALIDATION & TESTING ===

  async validateMigration(request, h) {
    try {
      const { id } = request.params;
      const { check_syntax, check_dependencies, check_conflicts, dry_run } = request.payload;

      const result = await this._service.validateMigration({
        id,
        check_syntax,
        check_dependencies,
        check_conflicts,
        dry_run
      });

      return h.response({
        success: true,
        message: 'Migration validation completed',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to validate migration');
    }
  }

  async validateSeed(request, h) {
    try {
      const { id } = request.params;
      const { check_schema, check_constraints, check_data_types, dry_run } = request.payload;

      const result = await this._service.validateSeed({
        id,
        check_schema,
        check_constraints,
        check_data_types,
        dry_run
      });

      return h.response({
        success: true,
        message: 'Seed validation completed',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to validate seed');
    }
  }

  async testMigration(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const { test_environment, backup_before_test, restore_after_test, timeout_seconds } = request.payload;

      const result = await this._service.testMigration({
        id,
        test_environment,
        backup_before_test,
        restore_after_test,
        timeout_seconds,
        tested_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'test',
        resource: 'migration',
        resource_id: id,
        details: { test_environment, backup_before_test, restore_after_test },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migration test completed',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to test migration');
    }
  }

  async testSeed(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;
      const { test_environment, backup_before_test, restore_after_test, timeout_seconds } = request.payload;

      const result = await this._service.testSeed({
        id,
        test_environment,
        backup_before_test,
        restore_after_test,
        timeout_seconds,
        tested_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'test',
        resource: 'seed',
        resource_id: id,
        details: { test_environment, backup_before_test, restore_after_test },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Seed test completed',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to test seed');
    }
  }

  // === EXPORT & IMPORT ===

  async exportMigration(request, h) {
    try {
      const { id } = request.params;
      const { format, include_dependencies, include_metadata } = request.query;

      const exportData = await this._service.exportMigration({
        id,
        format,
        include_dependencies,
        include_metadata
      });

      const fileName = `migration-${exportData.name}-${Date.now()}.${format}`;

      return h.response(exportData.content)
        .header('Content-Type', exportData.contentType)
        .header('Content-Disposition', `attachment; filename="${fileName}"`);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to export migration');
    }
  }

  async exportSeed(request, h) {
    try {
      const { id } = request.params;
      const { format, include_metadata } = request.query;

      const exportData = await this._service.exportSeed({
        id,
        format,
        include_metadata
      });

      const fileName = `seed-${exportData.name}-${Date.now()}.${format}`;

      return h.response(exportData.content)
        .header('Content-Type', exportData.contentType)
        .header('Content-Disposition', `attachment; filename="${fileName}"`);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to export seed');
    }
  }

  async importMigration(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { file, format, validate_before_import, overwrite_existing } = request.payload;

      const result = await this._service.importMigration({
        file,
        format,
        validate_before_import,
        overwrite_existing,
        imported_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'import',
        resource: 'migration',
        resource_id: result.id,
        details: { format, validate_before_import, overwrite_existing },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migration imported successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to import migration');
    }
  }

  async importSeed(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { file, format, validate_before_import, overwrite_existing } = request.payload;

      const result = await this._service.importSeed({
        file,
        format,
        validate_before_import,
        overwrite_existing,
        imported_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'import',
        resource: 'seed',
        resource_id: result.id,
        details: { format, validate_before_import, overwrite_existing },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Seed imported successfully',
        data: result
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to import seed');
    }
  }

  // === BULK OPERATIONS ===

  async bulkCreateMigrations(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { migrations, validate_before_create } = request.payload;

      const result = await this._service.bulkCreateMigrations({
        migrations,
        validate_before_create,
        created_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'bulk_create',
        resource: 'migration',
        resource_id: 'bulk',
        details: { count: migrations.length, validate_before_create },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Migrations created successfully',
        data: result
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create migrations');
    }
  }

  async bulkCreateSeeds(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { seeds, validate_before_create } = request.payload;

      const result = await this._service.bulkCreateSeeds({
        seeds,
        validate_before_create,
        created_by: userId
      });

      // Log activity
      await this._service.createAuditLog({
        user_id: userId,
        action: 'bulk_create',
        resource: 'seed',
        resource_id: 'bulk',
        details: { count: seeds.length, validate_before_create },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Seeds created successfully',
        data: result
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create seeds');
    }
  }

  // === STATISTICS & REPORTING ===

  async getMigrationStatistics(request, h) {
    try {
      const { period, type, include_details } = request.query;

      const statistics = await this._service.getMigrationStatistics({
        period,
        type,
        include_details
      });

      return h.response({
        success: true,
        data: statistics
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get migration statistics');
    }
  }

  async getSeedStatistics(request, h) {
    try {
      const { period, table_name, include_details } = request.query;

      const statistics = await this._service.getSeedStatistics({
        period,
        table_name,
        include_details
      });

      return h.response({
        success: true,
        data: statistics
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get seed statistics');
    }
  }

  async generateMigrationReport(request, h) {
    try {
      const { start_date, end_date, type, format, include_details } = request.query;

      const report = await this._service.generateMigrationReport({
        start_date,
        end_date,
        type,
        format,
        include_details
      });

      const fileName = `migration-report-${Date.now()}.${format}`;

      return h.response(report.content)
        .header('Content-Type', report.contentType)
        .header('Content-Disposition', `attachment; filename="${fileName}"`);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to generate migration report');
    }
  }

  async generateSeedReport(request, h) {
    try {
      const { start_date, end_date, table_name, format, include_details } = request.query;

      const report = await this._service.generateSeedReport({
        start_date,
        end_date,
        table_name,
        format,
        include_details
      });

      const fileName = `seed-report-${Date.now()}.${format}`;

      return h.response(report.content)
        .header('Content-Type', report.contentType)
        .header('Content-Disposition', `attachment; filename="${fileName}"`);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to generate seed report');
    }
  }
}

module.exports = MigrationHandler;
