/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Add missing fields to quotations table
  pgm.addColumns('quotations', {
    reference: { type: 'varchar(255)' },
    due_date: { type: 'date' }
  });

  // Add indexes for new fields
  pgm.createIndex('quotations', 'reference');
  pgm.createIndex('quotations', 'due_date');
};

exports.down = pgm => {
  // Remove indexes
  pgm.dropIndex('quotations', 'reference');
  pgm.dropIndex('quotations', 'due_date');

  // Remove columns
  pgm.dropColumns('quotations', ['reference', 'due_date']);
};
