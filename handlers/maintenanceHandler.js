import fs from 'fs';

const path = './database/maintenance.json';

export function setMaintenance(status) {
  fs.writeFileSync(path, JSON.stringify({ status }), 'utf-8');
}

export function isMaintenance() {
  if (!fs.existsSync(path)) return false;
  const { status } = JSON.parse(fs.readFileSync(path, 'utf-8'));
  return status;
}
