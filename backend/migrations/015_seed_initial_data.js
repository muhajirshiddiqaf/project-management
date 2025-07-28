/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Insert default organization
  pgm.sql(`
    INSERT INTO organizations (id, name, slug, domain, subscription_plan, max_users, max_projects)
    VALUES (
      uuid_generate_v4(),
      'Default Organization',
      'default',
      'localhost',
      'starter',
      5,
      10
    )
  `);

  // Insert default service categories
  pgm.sql(`
    INSERT INTO service_categories (organization_id, name, description)
    SELECT
      o.id,
      'Web Development',
      'Custom web application development'
    FROM organizations o WHERE o.slug = 'default'
    UNION ALL
    SELECT
      o.id,
      'Mobile Development',
      'Mobile application development'
    FROM organizations o WHERE o.slug = 'default'
    UNION ALL
    SELECT
      o.id,
      'Consulting',
      'IT consulting services'
    FROM organizations o WHERE o.slug = 'default'
  `);
};

exports.down = pgm => {
  // Remove seeded data
  pgm.sql(`DELETE FROM service_categories WHERE organization_id IN (SELECT id FROM organizations WHERE slug = 'default')`);
  pgm.sql(`DELETE FROM organizations WHERE slug = 'default'`);
};
