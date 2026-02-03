import bcrypt from 'bcrypt';
import { createConnectionPool } from "~/server/pool";

export default defineEventHandler(async (event) => {
    try {
        const { s: sessionKey }: { s: string } = getQuery(event);

        if (!sessionKey) {
            throw createError({
                statusCode: 401,
                statusMessage: "Session key required",
            });
        }

        const body = await readBody<{ username: string; password: string }>(event);
        const { username, password } = body;

        if (!username || !password) {
            throw createError({
                statusCode: 400,
                statusMessage: "Username and password are required",
            });
        }

        // zo worden wachtwoorden normaal gesproken gehashed opgeslagen.
        // const hashedPassword = bcrypt.hashSync(password, 10);

        const db = await createConnectionPool(sessionKey);
        const query = `
            SELECT 
                id,
                username,
                password
            FROM docenten
            WHERE username = $1
        `;
        const params = [username];
        const result = await db.query(query, params);


        if (result.rowCount === 0) {
            throw createError({
                statusCode: 401,
                statusMessage: "Invalid username or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, result.rows[0].password);

        if (!isPasswordValid) {
            throw createError({
                statusCode: 401,
                statusMessage: "Invalid username or password",
            });
        }

        const docent = result.rows[0];
        
        return {
            id: docent.id,
            username: docent.username,
        };
    } catch (error: any) {
        console.error("Error during docent login:", error);

        if (error?.statusCode) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: "Failed to login docent",
        });
    }
});
