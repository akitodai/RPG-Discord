import { getUserData, saveUserData } from '../handlers/serHandler.js';
import { embedReply } from '../handlers/embedHandler.js';
import { checkLevelUp } from '../handlers/levelHandler.js';
import woods from '../database/woods.json' with { type: 'json' };

export default {
  name: 'timber',
  async execute(message) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    const now = Date.now();
    const cooldown = 10 * 1000;

    if (now - userData.lastTimber < cooldown) {
      const sisa = Math.ceil((cooldown - (now - userData.lastTimber)) / 1000);
      return embedReply(message, {
        title: '⏳ Cooldown!',
        emoji: '🪓',
        description: `Tunggu **${sisa}s** lagi sebelum menebang lagi!`
      });
    }

    userData.lastTimber = now;

    const wood = woods[Math.floor(Math.random() * woods.length)];
    const chance = Math.random() * 100;

    if (chance > wood.chance) {
      saveUserData(userId, userData);
      return embedReply(message, {
        title: '🌲 Tebang Gagal!',
        emoji: '💨',
        description: `Kamu tidak menemukan **${wood.name}**.`
      });
    }

    const amount = Math.floor(Math.random() * (wood.maxAmount - wood.minAmount + 1)) + wood.minAmount;

    if (!userData.inventory.woods[wood.name]) {
      userData.inventory.woods[wood.name] = 0;
    }
    userData.inventory.woods[wood.name] += amount;

    // Tambah XP & check level
    userData.rpgXP += wood.xp;
    checkLevelUp(userData, message);

    saveUserData(userId, userData);

    embedReply(message, {
      title: '✅ Tebang Sukses!',
      emoji: '🪓',
      description: `Kamu menebang **${amount}x ${wood.name}**!\n📈 XP +${wood.xp}`
    });
  }
};
