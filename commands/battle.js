import { getUserData, saveUserData } from '../handlers/serHandler.js';
import { embedReply } from '../handlers/embedHandler.js';

export default {
  name: 'battle',
  execute(message) {
    const target = message.mentions.users.first();
    if (!target || target.id === message.author.id) {
      return embedReply(message, {
        title: 'Battle Gagal!',
        emoji: '⚔️',
        description: `Tag pemain lain yang mau kamu lawan!\nContoh: \`!battle @username\``
      });
    }

    const attacker = getUserData(message.author.id);
    const defender = getUserData(target.id);

    const atkPower = Math.floor(Math.random() * attacker.atk) + 1;
    defender.hp -= atkPower;

    if (defender.hp <= 0) {
      defender.hp = 100; // respawn
      attacker.gold += 100;
      saveUserData(message.author.id, attacker);
      saveUserData(target.id, defender);

      return embedReply(message, {
        title: 'Kemenangan!',
        emoji: '🏆',
        description: `**${message.author.username}** mengalahkan **${target.username}**!\n💰 Hadiah: 100 gold!`
      });
    } else {
      saveUserData(target.id, defender);
      return embedReply(message, {
        title: 'Serangan!',
        emoji: '⚔️',
        description: `**${message.author.username}** menyerang **${target.username}** dan memberi **${atkPower} damage**!\n❤️ HP sisa **${defender.hp}**`
      });
    }
  }
};
