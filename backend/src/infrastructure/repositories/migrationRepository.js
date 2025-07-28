const { queries } = require('../database/queries');

class MigrationRepository {
  constructor(db) {
    this.db = db;
  }

  // === MIGRATION MANAGEMENT ===

  async createMigration(migrationData) {
    try {
      const { rows } = await this.db.query(queries.migration.createMigration, [
        migrationData.name,
        migrationData.description,
        migrationData.version,
        migrationData.type,
        migrationData.sql_up,
        migrationData.sql_down,
        migrationData.dependencies,
        migrationData.is_reversible,
        migrationData.batch_size,
        migrationData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create migration');
    }
  }

  async getMigrations(filters = {}, pagination = {}) {
    try {
      const { status, type, version, start_date, end_date } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.migration.getMigrations;
      let params = [limit, offset];

      // Add filters
      let whereConditions = [];
      let paramIndex = 3;

      if (status) {
        whereConditions.push(`m.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      if (type) {
        whereConditions.push(`m.type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }

      if (version) {
        whereConditions.push(`m.version = $${paramIndex}`);
        params.push(version);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`m.created_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`m.created_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY', 'WHERE ' + whereConditions.join(' AND ') + ' ORDER BY');
      }

      // Add sorting
      query = query.replace('ORDER BY m.created_at DESC', `ORDER BY m.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get migrations');
    }
  }

  async countMigrations(filters = {}) {
    try {
      const { status, type, version, start_date, end_date } = filters;

      let query = queries.migration.countMigrations;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (status) {
        whereConditions.push(`m.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      if (type) {
        whereConditions.push(`m.type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }

      if (version) {
        whereConditions.push(`m.version = $${paramIndex}`);
        params.push(version);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`m.created_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`m.created_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('FROM migrations m', 'FROM migrations m WHERE ' + whereConditions.join(' AND '));
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count migrations');
    }
  }

  async getMigrationById(id) {
    try {
      const { rows } = await this.db.query(queries.migration.getMigrationById, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get migration by ID');
    }
  }

  async updateMigration(id, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      setClause.push('updated_at = NOW()');
      values.push(id);

      const query = `
        UPDATE migrations
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update migration');
    }
  }

  async deleteMigration(id) {
    try {
      const { rows } = await this.db.query(queries.migration.deleteMigration, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to delete migration');
    }
  }

  // === MIGRATION EXECUTION ===

  async runMigration(executionData) {
    try {
      const { rows } = await this.db.query(queries.migration.runMigration, [
        executionData.id,
        executionData.force,
        executionData.dry_run,
        executionData.rollback_on_failure,
        executionData.timeout_seconds,
        executionData.executed_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to run migration');
    }
  }

  async runMigrations(executionData) {
    try {
      const { rows } = await this.db.query(queries.migration.runMigrations, [
        executionData.version,
        executionData.type,
        executionData.force,
        executionData.dry_run,
        executionData.rollback_on_failure,
        executionData.timeout_seconds,
        executionData.batch_size,
        executionData.executed_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to run migrations');
    }
  }

  async rollbackMigration(rollbackData) {
    try {
      const { rows } = await this.db.query(queries.migration.rollbackMigration, [
        rollbackData.id,
        rollbackData.force,
        rollbackData.dry_run,
        rollbackData.timeout_seconds,
        rollbackData.executed_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to rollback migration');
    }
  }

  async rollbackMigrations(rollbackData) {
    try {
      const { rows } = await this.db.query(queries.migration.rollbackMigrations, [
        rollbackData.version,
        rollbackData.type,
        rollbackData.force,
        rollbackData.dry_run,
        rollbackData.timeout_seconds,
        rollbackData.limit,
        rollbackData.executed_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to rollback migrations');
    }
  }

  // === MIGRATION STATUS ===

  async getMigrationStatus(filters) {
    try {
      const { id, version } = filters;

      let query = queries.migration.getMigrationStatus;
      let params = [];

      if (id) {
        query = query.replace('WHERE 1=1', 'WHERE m.id = $1');
        params.push(id);
      } else if (version) {
        query = query.replace('WHERE 1=1', 'WHERE m.version = $1');
        params.push(version);
      }

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get migration status');
    }
  }

  async getMigrationHistory(filters = {}, pagination = {}) {
    try {
      const { status, type, version, start_date, end_date } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.migration.getMigrationHistory;
      let params = [limit, offset];

      // Add filters
      let whereConditions = [];
      let paramIndex = 3;

      if (status) {
        whereConditions.push(`mh.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      if (type) {
        whereConditions.push(`mh.type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }

      if (version) {
        whereConditions.push(`mh.version = $${paramIndex}`);
        params.push(version);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`mh.executed_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`mh.executed_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY', 'WHERE ' + whereConditions.join(' AND ') + ' ORDER BY');
      }

      // Add sorting
      query = query.replace('ORDER BY mh.executed_at DESC', `ORDER BY mh.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get migration history');
    }
  }

  async countMigrationHistory(filters = {}) {
    try {
      const { status, type, version, start_date, end_date } = filters;

      let query = queries.migration.countMigrationHistory;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (status) {
        whereConditions.push(`mh.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      if (type) {
        whereConditions.push(`mh.type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }

      if (version) {
        whereConditions.push(`mh.version = $${paramIndex}`);
        params.push(version);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`mh.executed_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`mh.executed_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('FROM migration_history mh', 'FROM migration_history mh WHERE ' + whereConditions.join(' AND '));
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count migration history');
    }
  }

  // === SEEDING OPERATIONS ===

  async createSeed(seedData) {
    try {
      const { rows } = await this.db.query(queries.migration.createSeed, [
        seedData.name,
        seedData.description,
        seedData.table_name,
        seedData.data,
        seedData.conditions,
        seedData.update_existing,
        seedData.batch_size,
        seedData.dependencies,
        seedData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create seed');
    }
  }

  async getSeeds(filters = {}, pagination = {}) {
    try {
      const { table_name, status, start_date, end_date } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.migration.getSeeds;
      let params = [limit, offset];

      // Add filters
      let whereConditions = [];
      let paramIndex = 3;

      if (table_name) {
        whereConditions.push(`s.table_name = $${paramIndex}`);
        params.push(table_name);
        paramIndex++;
      }

      if (status) {
        whereConditions.push(`s.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`s.created_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`s.created_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY', 'WHERE ' + whereConditions.join(' AND ') + ' ORDER BY');
      }

      // Add sorting
      query = query.replace('ORDER BY s.created_at DESC', `ORDER BY s.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get seeds');
    }
  }

  async countSeeds(filters = {}) {
    try {
      const { table_name, status, start_date, end_date } = filters;

      let query = queries.migration.countSeeds;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (table_name) {
        whereConditions.push(`s.table_name = $${paramIndex}`);
        params.push(table_name);
        paramIndex++;
      }

      if (status) {
        whereConditions.push(`s.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`s.created_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`s.created_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('FROM seeds s', 'FROM seeds s WHERE ' + whereConditions.join(' AND '));
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count seeds');
    }
  }

  async getSeedById(id) {
    try {
      const { rows } = await this.db.query(queries.migration.getSeedById, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get seed by ID');
    }
  }

  async updateSeed(id, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      setClause.push('updated_at = NOW()');
      values.push(id);

      const query = `
        UPDATE seeds
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update seed');
    }
  }

  async deleteSeed(id) {
    try {
      const { rows } = await this.db.query(queries.migration.deleteSeed, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to delete seed');
    }
  }

  // === SEED EXECUTION ===

  async runSeed(executionData) {
    try {
      const { rows } = await this.db.query(queries.migration.runSeed, [
        executionData.id,
        executionData.force,
        executionData.dry_run,
        executionData.update_existing,
        executionData.timeout_seconds,
        executionData.executed_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to run seed');
    }
  }

  async runSeeds(executionData) {
    try {
      const { rows } = await this.db.query(queries.migration.runSeeds, [
        executionData.table_name,
        executionData.force,
        executionData.dry_run,
        executionData.update_existing,
        executionData.timeout_seconds,
        executionData.batch_size,
        executionData.executed_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to run seeds');
    }
  }

  // === VERSIONING ===

  async getMigrationVersions(filters) {
    try {
      const { include_completed, include_failed, sort_order } = filters;

      const { rows } = await this.db.query(queries.migration.getMigrationVersions, [
        include_completed,
        include_failed,
        sort_order
      ]);
      return rows;
    } catch (error) {
      throw new Error('Failed to get migration versions');
    }
  }

  async createVersion(versionData) {
    try {
      const { rows } = await this.db.query(queries.migration.createVersion, [
        versionData.version,
        versionData.description,
        versionData.release_notes,
        versionData.is_major,
        versionData.is_breaking,
        versionData.dependencies,
        versionData.migrations,
        versionData.seeds,
        versionData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create version');
    }
  }

  async getVersionById(id) {
    try {
      const { rows } = await this.db.query(queries.migration.getVersionById, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get version by ID');
    }
  }

  async updateVersion(id, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      setClause.push('updated_at = NOW()');
      values.push(id);

      const query = `
        UPDATE migration_versions
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update version');
    }
  }

  async deleteVersion(id) {
    try {
      const { rows } = await this.db.query(queries.migration.deleteVersion, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to delete version');
    }
  }

  // === DEPENDENCY MANAGEMENT ===

  async getDependencies(filters) {
    try {
      const { migration_id, seed_id, version_id, type } = filters;

      let query = queries.migration.getDependencies;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (migration_id) {
        whereConditions.push(`d.source_id = $${paramIndex} AND d.source_type = 'migration'`);
        params.push(migration_id);
        paramIndex++;
      }

      if (seed_id) {
        whereConditions.push(`d.source_id = $${paramIndex} AND d.source_type = 'seed'`);
        params.push(seed_id);
        paramIndex++;
      }

      if (version_id) {
        whereConditions.push(`d.source_id = $${paramIndex} AND d.source_type = 'version'`);
        params.push(version_id);
        paramIndex++;
      }

      if (type) {
        whereConditions.push(`d.source_type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY', 'WHERE ' + whereConditions.join(' OR ') + ' ORDER BY');
      }

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get dependencies');
    }
  }

  async addDependency(dependencyData) {
    try {
      const { rows } = await this.db.query(queries.migration.addDependency, [
        dependencyData.source_id,
        dependencyData.source_type,
        dependencyData.target_id,
        dependencyData.target_type,
        dependencyData.dependency_type,
        dependencyData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to add dependency');
    }
  }

  async removeDependency(dependencyData) {
    try {
      const { rows } = await this.db.query(queries.migration.removeDependency, [
        dependencyData.source_id,
        dependencyData.source_type,
        dependencyData.target_id,
        dependencyData.target_type
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to remove dependency');
    }
  }

  // === VALIDATION & TESTING ===

  async validateMigration(validationData) {
    try {
      const { rows } = await this.db.query(queries.migration.validateMigration, [
        validationData.id,
        validationData.check_syntax,
        validationData.check_dependencies,
        validationData.check_conflicts,
        validationData.dry_run
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to validate migration');
    }
  }

  async validateSeed(validationData) {
    try {
      const { rows } = await this.db.query(queries.migration.validateSeed, [
        validationData.id,
        validationData.check_schema,
        validationData.check_constraints,
        validationData.check_data_types,
        validationData.dry_run
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to validate seed');
    }
  }

  async testMigration(testData) {
    try {
      const { rows } = await this.db.query(queries.migration.testMigration, [
        testData.id,
        testData.test_environment,
        testData.backup_before_test,
        testData.restore_after_test,
        testData.timeout_seconds,
        testData.tested_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to test migration');
    }
  }

  async testSeed(testData) {
    try {
      const { rows } = await this.db.query(queries.migration.testSeed, [
        testData.id,
        testData.test_environment,
        testData.backup_before_test,
        testData.restore_after_test,
        testData.timeout_seconds,
        testData.tested_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to test seed');
    }
  }

  // === EXPORT & IMPORT ===

  async exportMigration(exportData) {
    try {
      const { rows } = await this.db.query(queries.migration.exportMigration, [
        exportData.id,
        exportData.format,
        exportData.include_dependencies,
        exportData.include_metadata
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to export migration');
    }
  }

  async exportSeed(exportData) {
    try {
      const { rows } = await this.db.query(queries.migration.exportSeed, [
        exportData.id,
        exportData.format,
        exportData.include_metadata
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to export seed');
    }
  }

  async importMigration(importData) {
    try {
      const { rows } = await this.db.query(queries.migration.importMigration, [
        importData.file,
        importData.format,
        importData.validate_before_import,
        importData.overwrite_existing,
        importData.imported_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to import migration');
    }
  }

  async importSeed(importData) {
    try {
      const { rows } = await this.db.query(queries.migration.importSeed, [
        importData.file,
        importData.format,
        importData.validate_before_import,
        importData.overwrite_existing,
        importData.imported_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to import seed');
    }
  }

  // === BULK OPERATIONS ===

  async bulkCreateMigrations(bulkData) {
    try {
      const { rows } = await this.db.query(queries.migration.bulkCreateMigrations, [
        bulkData.migrations,
        bulkData.validate_before_create,
        bulkData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create migrations');
    }
  }

  async bulkCreateSeeds(bulkData) {
    try {
      const { rows } = await this.db.query(queries.migration.bulkCreateSeeds, [
        bulkData.seeds,
        bulkData.validate_before_create,
        bulkData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create seeds');
    }
  }

  // === STATISTICS & REPORTING ===

  async getMigrationStatistics(statisticsData) {
    try {
      const { rows } = await this.db.query(queries.migration.getMigrationStatistics, [
        statisticsData.period,
        statisticsData.type,
        statisticsData.include_details
      ]);
      return rows;
    } catch (error) {
      throw new Error('Failed to get migration statistics');
    }
  }

  async getSeedStatistics(statisticsData) {
    try {
      const { rows } = await this.db.query(queries.migration.getSeedStatistics, [
        statisticsData.period,
        statisticsData.table_name,
        statisticsData.include_details
      ]);
      return rows;
    } catch (error) {
      throw new Error('Failed to get seed statistics');
    }
  }

  async generateMigrationReport(reportData) {
    try {
      const { rows } = await this.db.query(queries.migration.generateMigrationReport, [
        reportData.start_date,
        reportData.end_date,
        reportData.type,
        reportData.format,
        reportData.include_details
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to generate migration report');
    }
  }

  async generateSeedReport(reportData) {
    try {
      const { rows } = await this.db.query(queries.migration.generateSeedReport, [
        reportData.start_date,
        reportData.end_date,
        reportData.table_name,
        reportData.format,
        reportData.include_details
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to generate seed report');
    }
  }

  // === AUDIT LOGGING ===

  async createAuditLog(auditData) {
    try {
      const { rows } = await this.db.query(queries.migration.createAuditLog, [
        auditData.user_id,
        auditData.action,
        auditData.resource,
        auditData.resource_id,
        auditData.details,
        auditData.ip_address,
        auditData.user_agent
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create audit log');
    }
  }
}

module.exports = MigrationRepository;
