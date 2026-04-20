import mysql from 'mysql2/promise'
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise'

let pool: Pool | null = null

function getPool(): Pool {
  if (pool) return pool
  const config = useRuntimeConfig()
  pool = mysql.createPool({
    host: config.dbHost,
    port: Number(config.dbPort),
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    // Forceer autocommit + sessie-timezone zodat elke connectie dezelfde tijd ziet.
    timezone: 'Z'
  })
  // Zorg dat iedere connectie uit de pool met autocommit=1 start.
  pool.on('connection', (conn) => {
    conn.query('SET autocommit = 1')
  })
  return pool
}

export async function query<T extends RowDataPacket[] | ResultSetHeader>(
  sql: string,
  params: unknown[] = []
): Promise<T> {
  const [rows] = await getPool().execute(sql, params)
  return rows as T
}

export type { RowDataPacket, ResultSetHeader }
