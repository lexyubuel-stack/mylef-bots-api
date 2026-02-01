import express from "express";
import bodyParser from "body-parser";
import { addJobId, isBlacklisted } from "./blacklist.js";
import { sendToWebhook } from "./webhook.js";

const app = express();
app.use(bodyParser.json());

// Endpoint para recibir reportes de los bots
app.post("/report", async (req, res) => {
  const { botUsername, jobId, placeId, pets, playerCount } = req.body;

  if (!botUsername || !jobId || !placeId) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  if (isBlacklisted(jobId)) {
    return res.status(200).json({ status: "ignored", reason: "JobId en blacklist" });
  }

  addJobId(jobId);

  await sendToWebhook(botUsername, jobId, pets || [], playerCount || 0, placeId);

  res.json({ status: "ok", blacklisted: true });
});

// Endpoint para pedir un servidor nuevo
app.post("/nextServer", (req, res) => {
  const { availableServers } = req.body;

  if (!availableServers || !Array.isArray(availableServers)) {
    return res.status(400).json({ error: "Debes mandar un array de servidores disponibles" });
  }

  const validServers = availableServers.filter(s => !isBlacklisted(s));

  if (validServers.length === 0) {
    return res.status(200).json({ status: "no_servers", message: "Todos los servidores están en blacklist" });
  }

  const chosen = validServers[Math.floor(Math.random() * validServers.length)];
  addJobId(chosen);

  res.json({ status: "ok", serverId: chosen });
});

app.listen(3000, () => {
  console.log("ServerHop API corriendo en puerto 3000");
});
