const express = require("express");
const { Pool } = require("pg");
const { createClient } = require("redis");

const app = express();
const port = Number(process.env.APP_PORT || 3000);

const pgPool = new Pool({
  host: process.env.POSTGRES_HOST || "db",
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER || "cp2",
  password: process.env.POSTGRES_PASSWORD || "cp2pass",
  database: process.env.POSTGRES_DB || "cp2db"
});

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "redis"}:${Number(process.env.REDIS_PORT || 6379)}`
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error.message);
});

app.get("/health", async (_req, res) => {
  try {
    await pgPool.query("SELECT 1");
    const pong = await redisClient.ping();

    return res.status(200).json({
      status: "ok",
      services: {
        postgres: "up",
        redis: pong === "PONG" ? "up" : "down"
      }
    });
  } catch (error) {
    return res.status(503).json({
      status: "error",
      message: error.message
    });
  }
});

app.get("/", async (_req, res) => {
  try {
    const counter = await redisClient.incr("visits");
    const insertQuery = "INSERT INTO access_log(total_visits) VALUES ($1) RETURNING created_at";
    const result = await pgPool.query(insertQuery, [counter]);

    return res.status(200).json({
      message: "Checkpoint 2 - Stack em execucao",
      visits: counter,
      loggedAt: result.rows[0].created_at
    });
  } catch (error) {
    return res.status(500).json({
      error: "Falha ao processar requisicao",
      details: error.message
    });
  }
});

async function bootstrap() {
  await redisClient.connect();

  app.listen(port, () => {
    console.log(`API online na porta ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Erro ao iniciar aplicacao:", error.message);
  process.exit(1);
});
