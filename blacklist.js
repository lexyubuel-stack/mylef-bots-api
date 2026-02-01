import { BLACKLIST_LIMIT } from "./config.js";

let blacklist = [];

export function addJobId(jobId) {
  if (!blacklist.includes(jobId)) {
    blacklist.push(jobId);
  }
  if (blacklist.length > BLACKLIST_LIMIT) {
    blacklist.splice(0, 10); // borra 10 antiguos
  }
}

export function isBlacklisted(jobId) {
  return blacklist.includes(jobId);
}

export function getBlacklist() {
  return blacklist;
}
