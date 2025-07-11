import fs from 'fs';
import path from 'path';

export function logEvent(serverId, userId, command, detail) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const time = now.toLocaleString(); // Lokal time untuk jam

  const logMsg = `[${time}] [Server: ${serverId}] [User: ${userId}] [Command: ${command}] ${detail}\n`;

  const logsDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logsDir, `log-${date}.log`);

  // Pastikan folder logs ada
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  fs.appendFileSync(logFile, logMsg, 'utf8');
}
