import { embedReply } from './embedHandler.js';

export function checkLevelUp(userData, message) {
  let leveledUp = false;

  while (userData.rpgXP >= userData.nextXP) {
    userData.rpgXP -= userData.nextXP;
    userData.level += 1;

    // Hitung target XP baru: naik 25% kelipatan
    userData.nextXP = Math.ceil(userData.nextXP * 1.25);

    // Naikkan Max HP juga 25% kelipatan
    userData.maxHP = Math.ceil(userData.maxHP * 1.25);

    // Pulihkan HP ke Max
    userData.hp = userData.maxHP;

    leveledUp = true;

    // Tambahan reward? Contoh:
    const bonusGold = 100 * userData.level;
    userData.gold += bonusGold;

    embedReply(message, {
      title: `🎉 Level Up!`,
      emoji: '🚀',
      description: `Selamat <@${message.author.id}>!  
Kamu naik ke **Level ${userData.level}**  
❤️ Max HP sekarang: ${userData.maxHP}  
💰 Bonus Gold: ${bonusGold}  
🆙 XP Next Level: ${userData.nextXP}`
    });
  }

  return leveledUp;
}
