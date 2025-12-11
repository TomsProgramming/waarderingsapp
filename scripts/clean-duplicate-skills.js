// Script to clean duplicate skills from the database
import pg from "pg";
const { Pool } = pg;

// Database connection - update these values to match your database
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "waarderingsapp", // Update this
  user: "postgres", // Update this
  password: "your_password", // Update this
});

async function cleanDuplicateSkills() {
  try {
    // First, check for duplicates
    const checkQuery = `
      SELECT name, COUNT(*) as count
      FROM skills
      GROUP BY name
      HAVING COUNT(*) > 1
    `;

    const duplicates = await pool.query(checkQuery);

    if (duplicates.rows.length === 0) {
      console.log("✓ No duplicate skills found!");
      return;
    }

    console.log("Found duplicates:");
    duplicates.rows.forEach((row) => {
      console.log(`  - ${row.name}: ${row.count} entries`);
    });

    // Delete duplicates, keeping only the first one for each name
    const deleteQuery = `
      DELETE FROM skills
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM skills
        GROUP BY name
      )
      RETURNING id, name
    `;

    const result = await pool.query(deleteQuery);

    console.log(`\n✓ Removed ${result.rows.length} duplicate skills:`);
    result.rows.forEach((row) => {
      console.log(`  - ${row.name} (id: ${row.id})`);
    });

    // Verify the result
    const verifyQuery = `SELECT COUNT(*) as total FROM skills`;
    const verify = await pool.query(verifyQuery);
    console.log(`\n✓ Total skills remaining: ${verify.rows[0].total}`);
  } catch (error) {
    console.error("Error cleaning duplicates:", error);
  } finally {
    await pool.end();
  }
}

cleanDuplicateSkills();
