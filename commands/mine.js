import { getUserData, saveUserData } from '../handlers/serHandler.js';
import { embedReply } from '../handlers/embedHandler.js';
import { checkLevelUp } from '../handlers/levelHandler.js';
import ores from '../database/ores.json' with { type: 'json' };

export default {
  name: 'mine',
  async execute(message) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    const now = Date.now();
    const cooldown = 10 * 1000;

    if (now - userData.lastMine < cooldown) {
      const sisa = Math.ceil((cooldown - (now - userData.lastMine)) / 1000);
      return embedReply(message, {
        title: '⏳ Cooldown!',
        emoji: '⛏️',
        description: `Tunggu **${sisa}s** lagi sebelum mining lagi!`
      });
    }

    userData.lastMine = now;

    const ore = ores[Math.floor(Math.random() * ores.length)];
    const chance = Math.random() * 100;

    if (chance > ore.chance) {
      saveUserData(userId, userData);
      return embedReply(message, {
        title: '🪨 Gagal Mining!',
        emoji: '💨',
        description: `Kamu tidak menemukan **${ore.name}**.`
      });
    }

    const amount = Math.floor(Math.random() * (ore.maxAmount - ore.minAmount + 1)) + ore.minAmount;

    if (!userData.inventory.ores) {
      userData.inventory.ores = {};
    }

    userData.inventory.ores[ore.name] = (userData.inventory.ores[ore.name] || 0) + amount;

    // Tambah XP & check level up
    userData.rpgXP += ore.xp;
    checkLevelUp(userData, message);

    saveUserData(userId, userData);

    embedReply(message, {
      title: '✅ Mining Sukses!',
      emoji: '⛏️',
      description: `Kamu menemukan **${amount}x ${ore.name}**!\n📈 XP +${ore.xp}`
    });
  }
};
