import { getUserData, saveUserData } from '../handlers/serHandler.js';
import { embedReply } from '../handlers/embedHandler.js';
import equipmentList from '../database/equipment.json' with { type: 'json' };

export default {
  name: 'equip',
  async execute(message, args) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    const itemName = args.join(' ');
    const eq = equipmentList.find(e => e.name.toLowerCase() === itemName.toLowerCase());

    if (!eq) {
      return embedReply(message, {
        title: '❌ Tidak Ditemukan',
        emoji: '🔍',
        description: `Equipment **${itemName}** tidak ditemukan!`
      });
    }

    if (!userData.inventory.equipment?.[eq.name]) {
      return embedReply(message, {
        title: '❌ Tidak Punya',
        emoji: '❗',
        description: `Kamu tidak punya **${eq.name}** di inventory!`
      });
    }

    if (!userData.equipped) userData.equipped = {};

    let oldEquip = '-';
    let slotType = '';

    if (eq.type === 'sword') {
      oldEquip = userData.equipped.weapon || 'Kosong';
      userData.equipped.weapon = eq.name;
      slotType = 'Weapon';
    } else if (eq.type === 'armor') {
      oldEquip = userData.equipped.armor || 'Kosong';
      userData.equipped.armor = eq.name;
      slotType = 'Armor';
    } else {
      return embedReply(message, {
        title: '❌ Tipe Tidak Valid',
        emoji: '⚙️',
        description: `Tipe equipment **${eq.name}** tidak valid!`
      });
    }

    // Fallback stat dasar
    userData.baseAtk = userData.baseAtk || 10;
    userData.baseMaxHP = userData.baseMaxHP || 100;

    const weapon = equipmentList.find(e => e.name === userData.equipped.weapon);
    const armor = equipmentList.find(e => e.name === userData.equipped.armor);

    const bonusAtk = weapon?.atk || 0;
    const bonusHP = armor?.maxHP || 0;

    userData.atk = userData.baseAtk + bonusAtk;
    userData.maxHP = userData.baseMaxHP + bonusHP;
    userData.hp = userData.maxHP;

    saveUserData(userId, userData);

    embedReply(message, {
      title: `✅ ${slotType} Dipasang`,
      emoji: eq.type === 'sword' ? '🗡️' : '🛡️',
      description: `Kamu mengenakan **${eq.name}**.\nSebelumnya: **${oldEquip}**\n\n⚔️ ATK: ${userData.atk}\n❤️ Max HP: ${userData.maxHP}`
    });
  }
};
