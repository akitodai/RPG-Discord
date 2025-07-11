import { embedReply } from '../handlers/embedHandler.js';
import { getUserData, saveUserData } from '../handlers/serHandler.js';
import { checkLevelUp } from '../handlers/levelHandler.js';
import monsters from '../database/monsters.json' with { type: 'json' };

export default {
  name: 'hunt',
  async execute(message) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    const playerLevel = userData.level || 1;

    // ✅ Tambahkan pengecekan equip weapon & armor
    const equipped = userData.equipped || {};
    if (!equipped.weapon || !equipped.armor) {
      return embedReply(message, {
        title: '🚫 Tidak Bisa Berburu',
        emoji: '⚠️',
        description: `
Kamu harus memakai **Weapon** *dan* **Armor** sebelum berburu!

Gunakan \`!equip <nama item>\` untuk memasang equipment.
        `
      });
    }

    // Fallback stat
    userData.atk = userData.atk || userData.baseAtk || 10;
    userData.maxHP = userData.maxHP || userData.baseMaxHP || 100;

    if (userData.hp <= 0) {
      return embedReply(message, {
        title: '❌ Kamu Terluka!',
        emoji: '💔',
        description: 'HP kamu 0! Gunakan potion (`!heal`) atau tunggu regen.'
      });
    }

    const available = monsters.filter(m => playerLevel >= m.minLevel);
    if (available.length === 0) {
      return embedReply(message, {
        title: '❌ Tidak Ada Monster!',
        emoji: '🪦',
        description: 'Levelmu terlalu rendah untuk berburu monster manapun!'
      });
    }

    const monster = available[Math.floor(Math.random() * available.length)];
    const randFactor = () => 0.7 + Math.random() * 0.6;

    const monsterHp = Math.ceil(monster.hp * randFactor());
    const monsterAtk = monster.atk || 3;
    const monsterXp = Math.ceil(monster.xp * randFactor());
    const monsterGold = Math.ceil(monster.gold * randFactor());

    const playerDamage = Math.floor(userData.atk * randFactor());

    let monsterDamage = Math.floor(monsterAtk * randFactor());
    if (userData.def) {
      monsterDamage -= userData.def;
      if (monsterDamage < 0) monsterDamage = 0;
    }

    const dodgeChance = Math.random();
    const dodge = dodgeChance < 0.1;

    let outcome = 'Kalah';
    if (playerDamage >= monsterHp) {
      outcome = 'Menang';
    }

    if (!dodge) {
      userData.hp -= monsterDamage;
      if (userData.hp < 0) userData.hp = 0;
    }

    let xpEarned = 0;
    let goldEarned = 0;

    if (outcome === 'Menang') {
      xpEarned = monsterXp;
      goldEarned = monsterGold;

      userData.rpgXP += xpEarned;
      userData.gold += goldEarned;

      checkLevelUp(userData, message);
    }

    if (userData.hp > userData.maxHP) {
      userData.hp = userData.maxHP;
    }

    saveUserData(userId, userData);

    embedReply(message, {
      title: `⚔️ Berburu: ${monster.name}`,
      emoji: '🐲',
      description: `
🧟 **Monster:** ${monster.name} _(Min Level: ${monster.minLevel})_
❤️ **HP Monster:** ${monsterHp}
⚔️ **ATK Monster:** ${monster.atk}

💥 **Damage Kamu:** ${playerDamage}
💢 **Damage Monster:** ${dodge ? 'Miss! (Dodge)' : monsterDamage}
🏆 **Hasil:** ${outcome}

📈 **XP Didapat:** ${xpEarned}
💰 **Gold Didapat:** ${goldEarned}
❤️ **HP Tersisa:** ${userData.hp}/${userData.maxHP}
      `
    });
  }
};
