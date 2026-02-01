import fetch from "node-fetch";
import { WEBHOOK_URL, SPECIAL_BRAINROTS, BRAINROT_MIN_VALUE } from "./config.js";

export async function sendNormalEmbed(botName, jobId, pets, playerCount, placeId) {
  const embed = {
    title: "Mylef Highlights",
    color: 0x87ceeb, // azul cielo
    fields: [
      { name: "Nombre de brainrot", value: pets[0]?.name || "Desconocido" },
      { name: "Dinero que genera", value: pets[0]?.pricePerSecond || "N/A" },
      { name: "Otros brainrots", value: pets.map(p => `${p.name} (${p.pricePerSecond})`).join("\n") || "None" },
      { name: "Players", value: `${playerCount}/8 :bust_in_silhouette:` },
      { name: "Unirse", value: `[Unirse al server](https://www.roblox.com/games/${placeId}?jobId=${jobId})` }
    ],
    timestamp: new Date().toISOString()
  };

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] })
  });
}

export async function sendBrainrotEmbed(botName, jobId, pets, playerCount, placeId) {
  const embed = {
    title: "☘️ Mylef Highlights ☘️",
    color: 0x90ee90, // verde clarito
    fields: [
      { name: "Brainrot", value: pets[0]?.name || "Desconocido" },
      { name: "Dinero que genera/s", value: pets[0]?.pricePerSecond || "N/A" },
      { name: "Otros brainrots", value: pets.map(p => `${p.name} (${p.pricePerSecond})`).join("\n") || "None" },
      { name: "Players", value: `${playerCount}/8 👤` },
      { name: "Unirse al servidor", value: `[Unirse al server](https://www.roblox.com/games/${placeId}?jobId=${jobId})` },
      { name: "JobId", value: jobId }
    ],
    timestamp: new Date().toISOString()
  };

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: `@everyone ${pets[0]?.name} detectado`, embeds: [embed] })
  });
}

export async function sendToWebhook(botName, jobId, pets, playerCount, placeId) {
  if (!pets || pets.length === 0) return;

  const mainPet = pets[0];
  const priceValue = mainPet.value || parsePrice(mainPet.pricePerSecond);

  if (priceValue >= BRAINROT_MIN_VALUE) {
    if (SPECIAL_BRAINROTS[mainPet.name]) {
      await sendBrainrotEmbed(botName, jobId, pets, playerCount, placeId);
    } else if (priceValue >= 1e8) { // 100m+
      await sendBrainrotEmbed(botName, jobId, pets, playerCount, placeId);
    } else {
      await sendNormalEmbed(botName, jobId, pets, playerCount, placeId);
    }
  }
}

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  if (priceStr.includes("B")) return num * 1e9;
  if (priceStr.includes("M")) return num * 1e6;
  if (priceStr.includes("K")) return num * 1e3;
  return num;
}
