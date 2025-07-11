import { getUserData, saveUserData } from '../handlers/serHandler.js';
import { embedReply } from '../handlers/embedHandler.js';
import { checkLevelUp } from '../handlers/levelHandler.js';

// Daftar job
const jobs = [
  { name: 'Office Clerk', min: 100, max: 200, chance: 90, cooldown: 5 * 60 * 1000, xp: 20 },
  { name: 'Delivery Driver', min: 200, max: 400, chance: 70, cooldown: 7 * 60 * 1000, xp: 35 },
  { name: 'Chef', min: 400, max: 600, chance: 50, cooldown: 9 * 60 * 1000, xp: 50 },
  { name: 'Architect', min: 600, max: 900, chance: 30, cooldown: 12 * 60 * 1000, xp: 70 },
  { name: 'CEO Assistant', min: 1000, max: 1500, chance: 10, cooldown: 15 * 60 * 1000, xp: 100 }
];

export default {
  name: 'work',
  async execute(message) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const now = Date.now();

    // Pakai lastWork GLOBAL, bukan per-job
    if (!userData.lastWork) userData.lastWork = 0;

    // Gunakan cooldown terbesar (15 menit)
    const maxCooldown = 15 * 60 * 1000;

    if (now - userData.lastWork < maxCooldown) {
      const sisa = Math.ceil((maxCooldown - (now - userData.lastWork)) / 1000);
      const menit = Math.floor(sisa / 60);
      const detik = sisa % 60;
      return embedReply(message, {
        title: '⏳ Cooldown!',
        emoji: '⏳',
        description: `Tunggu **${menit}m ${detik}s** lagi sebelum kamu bisa kerja lagi!`
      });
    }

    // Set lastWork GLOBAL
    userData.lastWork = now;

    const roll = Math.random() * 100;
    if (roll > job.chance) {
      saveUserData(userId, userData);
      return embedReply(message, {
        title: '😢 Gagal!',
        emoji: '😢',
        description: `Kamu gagal mendapat kerjaan **${job.name}**.`
      });
    }

    const pay = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
    userData.gold += pay;

    // Tambah XP & check level up
    userData.rpgXP += job.xp;
    checkLevelUp(userData, message);

    saveUserData(userId, userData);

    embedReply(message, {
      title: '💼 Kerja Berhasil!',
      emoji: '💼',
      description: `Kamu kerja sebagai **${job.name}** dan dapat **${pay} gold**!\n📈 XP +${job.xp}`
    });
  }
};
