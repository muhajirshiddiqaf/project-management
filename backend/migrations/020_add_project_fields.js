/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Add new fields to projects table
  pgm.addColumns('projects', {
    category: {
      type: 'VARCHAR(100)',
      notNull: false,
      default: 'other'
    },
    currency: {
      type: 'VARCHAR(3)',
      notNull: false,
      default: 'IDR'
    },
    tags: {
      type: 'TEXT[]',
      notNull: false,
      default: '{}'
    }
  });

  // Add index for category
  pgm.createIndex('projects', 'category');
};

exports.down = pgm => {
  // Remove index
  pgm.dropIndex('projects', 'category');

  // Remove columns
  pgm.dropColumns('projects', ['category', 'currency', 'tags']);
};
