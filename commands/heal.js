import { embedReply } from '../handlers/embedHandler.js';
import { getUserData, saveUserData } from '../handlers/serHandler.js';
import potions from '../database/potions.json' with { type: 'json' };

export default {
  name: 'heal',
  execute(message, args) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    if (userData.hp >= userData.maxHP) {
      embedReply(message, {
        title: '✅ Sudah Full HP',
        description: `HP kamu sudah full.`,
        emoji: '❤️'
      });
      return;
    }

    let healAmount = 0;

    if (args[0]) {
      const tier = parseInt(args[0]);
      const potion = potions.find(p => p.tier === tier);
      if (!potion) {
        embedReply(message, {
          title: '❌ Potion Tidak Ada',
          description: `Tier potion ${tier} tidak ditemukan.`,
          emoji: '🧪'
        });
        return;
      }

      if (userData.inventory[`potion${tier}`] <= 0) {
        embedReply(message, {
          title: '❌ Tidak Punya Potion',
          description: `Kamu tidak punya ${potion.name}.`,
          emoji: '🥲'
        });
        return;
      }

      healAmount = Math.min(potion.heal, userData.maxHP - userData.hp);
      userData.hp += healAmount;
      userData.inventory[`potion${tier}`] -= 1;

    } else {
      // auto pakai potion secukupnya, mulai dari tier tertinggi
      for (let i = potions.length; i >= 1; i--) {
        while (userData.hp < userData.maxHP && userData.inventory[`potion${i}`] > 0) {
          const potion = potions.find(p => p.tier === i);
          const heal = Math.min(potion.heal, userData.maxHP - userData.hp);
          userData.hp += heal;
          userData.inventory[`potion${i}`] -= 1;
        }
      }
    }

    embedReply(message, {
      title: '✅ Heal',
      description: `HP kamu sekarang ${userData.hp}/${userData.maxHP}`,
      emoji: '🧪'
    });

    saveUserData(userId, userData);
  }
};
