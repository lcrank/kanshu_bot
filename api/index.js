const express = require("express");
const { createBot } = require("../bot");

const app = express();
app.use(express.json());

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = createBot(token);

const WEBHOOK_PATH = "/api/webhook";
const webhookUrl =
  process.env.WEBHOOK_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}${WEBHOOK_PATH}`
    : null);

if (webhookUrl) {
  bot.setWebHook(webhookUrl).catch((err) => {
    console.error("Failed to set webhook:", err.message);
  });
}

app.post(WEBHOOK_PATH, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.all("*", (_req, res) => {
  res.status(200).send("Bot is running");
});

module.exports = app;
