import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT as unknown as number,
  
});

export default pool;
