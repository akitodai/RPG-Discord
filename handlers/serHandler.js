import fs from 'fs';
import path from 'path';

const usersDir = './database/users';

if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

export function getUserData(userId) {
  const userPath = path.join(usersDir, `${userId}.json`);

  if (!fs.existsSync(userPath)) {
    const defaultData = {
      gold: 0,
      rpgXP: 0,
      level: 1,
      nextXP: 100,
      baseAtk: 10,
      atk: 10,
      baseMaxHP: 100,
      maxHP: 100,
      hp: 100,
      chatXP: 0,
      bank: 0,
      equipped: { weapon: null, armor: null },
      inventory: {
        ores: {},
        woods: {},
        items: {},
        equipment: {}
      },
      lastMine: 0,
      lastTimber: 0,
      lastWork: {},
      lastHunt: 0
    };
    fs.writeFileSync(userPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }

  const raw = fs.readFileSync(userPath, 'utf-8');
  const data = JSON.parse(raw);

  // Fallback patch jika field lama kosong
  if (!data.baseAtk) data.baseAtk = 10;
  if (!data.baseMaxHP) data.baseMaxHP = 100;
  if (!data.atk) data.atk = data.baseAtk;
  if (!data.maxHP) data.maxHP = data.baseMaxHP;
  if (!data.hp) data.hp = data.maxHP;
  if (!data.level) data.level = 1;
  if (!data.nextXP) data.nextXP = 100;

  return data;
}

export function saveUserData(userId, userData) {
  const userPath = path.join(usersDir, `${userId}.json`);
  fs.writeFileSync(userPath, JSON.stringify(userData, null, 2));
}
