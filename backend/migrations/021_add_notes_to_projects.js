/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Add notes column to projects table
  pgm.addColumn('projects', {
    notes: { type: 'text' }
  });
};

exports.down = pgm => {
  // Remove notes column from projects table
  pgm.dropColumn('projects', 'notes');
};
