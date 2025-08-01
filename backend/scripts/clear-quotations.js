const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'project_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password123',
});

async function clearQuotations() {
  const client = await pool.connect();

  try {
    console.log('🗑️  Starting to clear all quotation data...');

    // Begin transaction
    await client.query('BEGIN');

    // Delete quotation items first (foreign key constraint)
    console.log('📝 Deleting quotation items...');
    const itemsResult = await client.query(`
      DELETE FROM quotation_items
      RETURNING id
    `);
    console.log(`✅ Deleted ${itemsResult.rowCount} quotation items`);

    // Delete quotations
    console.log('📊 Deleting quotations...');
    const quotationsResult = await client.query(`
      DELETE FROM quotations
      RETURNING id, quotation_number
    `);
    console.log(`✅ Deleted ${quotationsResult.rowCount} quotations`);

    // Show deleted quotations
    if (quotationsResult.rows.length > 0) {
      console.log('\n📋 Deleted quotations:');
      quotationsResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.quotation_number} (ID: ${row.id})`);
      });
    }

    // Commit transaction
    await client.query('COMMIT');

    console.log('\n🎉 Successfully cleared all quotation data!');
    console.log(`📊 Summary:`);
    console.log(`   - Quotations: ${quotationsResult.rowCount}`);
    console.log(`   - Quotation Items: ${itemsResult.rowCount}`);

  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('❌ Error clearing quotation data:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
if (require.main === module) {
  clearQuotations()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { clearQuotations };
