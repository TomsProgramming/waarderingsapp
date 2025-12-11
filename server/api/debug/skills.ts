import { createConnectionPool } from "~/server/pool";

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  try {
    const { s: sessionKey }: { s: string } = getQuery(event);

    if (!sessionKey) {
      throw createError({
        statusCode: 401,
        statusMessage: "Session key required",
      });
    }

    const db = await createConnectionPool(sessionKey);

    if (method === "GET") {
      // Get all skills with count
      const result = await db.query(`
        SELECT 
          id,
          name,
          description,
          category,
          COUNT(*) OVER (PARTITION BY name) as duplicate_count
        FROM skills
        ORDER BY name, id
      `);

      return {
        totalSkills: result.rows.length,
        skills: result.rows,
      };
    }

    if (method === "DELETE") {
      // Delete duplicate skills, keeping only the first one for each name
      const deleteDuplicates = await db.query(`
        DELETE FROM skills
        WHERE id NOT IN (
          SELECT MIN(id)
          FROM skills
          GROUP BY name
        )
        RETURNING id, name
      `);

      return {
        message: "Duplicate skills removed",
        deletedCount: deleteDuplicates.rows.length,
        deletedSkills: deleteDuplicates.rows,
      };
    }

    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    });
  } catch (error: any) {
    console.error("Error handling skills debug:", error);

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to handle skills debug",
    });
  }
});
