#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password123@localhost:5432/project_management',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function clearQuotations() {
  const client = await pool.connect();

  try {
    console.log('🗑️  Starting to clear all quotation data...');

    // Begin transaction
    await client.query('BEGIN');

    // Delete quotation approval requests first (foreign key constraint)
    console.log('📋 Deleting quotation approval requests...');
    const approvalResult = await client.query(`
      DELETE FROM quotation_approval_requests
      RETURNING id
    `);
    console.log(`✅ Deleted ${approvalResult.rowCount} approval requests`);

    // Delete quotation items
    console.log('📝 Deleting quotation items...');
    const itemsResult = await client.query(`
      DELETE FROM quotation_items
      RETURNING id
    `);
    console.log(`✅ Deleted ${itemsResult.rowCount} quotation items`);

    // Delete quotation templates
    console.log('📄 Deleting quotation templates...');
    const templatesResult = await client.query(`
      DELETE FROM quotation_templates
      RETURNING id
    `);
    console.log(`✅ Deleted ${templatesResult.rowCount} quotation templates`);

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
      quotationsResult.rows.forEach(row => {
        console.log(`   - ${row.quotation_number} (ID: ${row.id})`);
      });
    }

    // Commit transaction
    await client.query('COMMIT');

    console.log('\n🎉 Successfully cleared all quotation data!');
    console.log(`📊 Summary:`);
    console.log(`   - Quotations: ${quotationsResult.rowCount}`);
    console.log(`   - Quotation Items: ${itemsResult.rowCount}`);
    console.log(`   - Quotation Templates: ${templatesResult.rowCount}`);
    console.log(`   - Approval Requests: ${approvalResult.rowCount}`);

  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('❌ Error clearing quotation data:', error);
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
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { clearQuotations };
