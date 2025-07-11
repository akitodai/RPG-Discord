import { getUserData } from '../handlers/serHandler.js';
import { embedReply } from '../handlers/embedHandler.js';

export default {
  name: 'profile',
  execute(message) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    const gold = userData.gold || 0;
    const atk = userData.atk || 10;
    const hp = userData.hp || 100;
    const maxHP = userData.maxHP || 100;
    const rpgXP = userData.rpgXP || 0;
    const chatXP = userData.chatXP || 0;
    const level = userData.level || 1;
    const nextXP = userData.nextXP || 100;

    const equippedWeapon = userData.equipped?.weapon || 'Kosong';
    const equippedArmor = userData.equipped?.armor || 'Kosong';

    // Ringkasan inventory
    const ores = Object.entries(userData.inventory?.ores || {})
      .map(([name, qty]) => `⛏️ ${name} x${qty}`).join('\n') || 'Tidak ada';
    const woods = Object.entries(userData.inventory?.woods || {})
      .map(([name, qty]) => `🪵 ${name} x${qty}`).join('\n') || 'Tidak ada';
    const items = Object.entries(userData.inventory?.items || {})
      .map(([name, qty]) => `🎒 ${name} x${qty}`).join('\n') || 'Tidak ada';
    const equipment = Object.entries(userData.inventory?.equipment || {})
      .map(([name, qty]) => `⚙️ ${name} x${qty}`).join('\n') || 'Tidak ada';

    const description = `
**💰 Gold:** ${gold}
**⚔️ ATK:** ${atk}
**❤️ HP:** ${hp} / ${maxHP}
**🎚️ Level:** ${level}
📈 **RPG XP:** ${rpgXP} / ${nextXP}
💬 **Chat XP:** ${chatXP}

**🗡️ Weapon Aktif:** ${equippedWeapon}
**🛡️ Armor Aktif:** ${equippedArmor}

__**⛏️ Ores:**__  
${ores}

__**🪵 Woods:**__  
${woods}

__**🎒 Items:**__  
${items}

__**⚙️ Equipment:**__  
${equipment}
`;

    embedReply(message, {
      title: `👤 Profil ${message.author.username}`,
      emoji: '📜',
      description
    });
  }
};
