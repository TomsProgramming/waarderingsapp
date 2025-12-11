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

    const studentId = event.context.params?.id;

    if (!studentId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Student ID required",
      });
    }

    const db = await createConnectionPool(sessionKey);

    if (method === "GET") {
      // Get all skills for a student (using DISTINCT to avoid duplicates)
      const result = await db.query(
        `
                SELECT DISTINCT ON (s.name)
                    s.id,
                    s.name,
                    s.description,
                    s.category,
                    ss.level,
                    ss.assessed_at
                FROM skills s
                LEFT JOIN student_skills ss ON s.id = ss.skill_id AND ss.student_id = $1
                ORDER BY s.name, s.id
            `,
        [Number(studentId)]
      );

      return result.rows.map((skill) => ({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        category: skill.category,
        level: skill.level || null,
        assessedAt: skill.assessed_at,
      }));
    }

    if (method === "POST") {
      // Update/set skill level for student
      const body = await readBody(event);
      const { skillId, level } = body;

      if (!skillId || !level || level < 1 || level > 5) {
        throw createError({
          statusCode: 400,
          statusMessage: "Skill ID and level (1-5) are required",
        });
      }

      const result = await db.query(
        `
                INSERT INTO student_skills (student_id, skill_id, level)
                VALUES ($1, $2, $3)
                ON CONFLICT (student_id, skill_id)
                DO UPDATE SET level = $3, assessed_at = CURRENT_TIMESTAMP
                RETURNING id, assessed_at
            `,
        [Number(studentId), skillId, level]
      );

      return {
        id: result.rows[0].id,
        assessedAt: result.rows[0].assessed_at,
        message: "Skill level updated successfully",
      };
    }

    throw createError({
      statusCode: 405,
      statusMessage: "Method not allowed",
    });
  } catch (error: any) {
    console.error("Error handling student skills:", error);

    if (error?.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to handle student skills",
    });
  }
});
