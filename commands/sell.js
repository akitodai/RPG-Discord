import { getUserData, saveUserData } from '../handlers/serHandler.js';
import { embedReply } from '../handlers/embedHandler.js';

export default {
  name: 'sell',
  async execute(message, args) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    if (args.length < 3) {
      return embedReply(message, {
        title: '❌ Format Salah',
        description: 'Gunakan: `!sell <ore|wood> <jumlah> <nama item>`\nContoh: `!sell ore 5 Iron Ore`',
        emoji: '📦'
      });
    }

    const [type, jumlahStr, ...itemParts] = args;
    const itemNameInput = itemParts.join(' ').toLowerCase();
    const jumlah = parseInt(jumlahStr);

    if (isNaN(jumlah) || jumlah <= 0) {
      return embedReply(message, {
        title: '❌ Jumlah Tidak Valid',
        description: 'Jumlah harus berupa angka lebih dari 0.',
        emoji: '🔢'
      });
    }

    let invCategory;
    let pricePerItem;

    if (type === 'ore') {
      invCategory = userData.inventory.ores;
      pricePerItem = 10;
    } else if (type === 'wood') {
      invCategory = userData.inventory.woods;
      pricePerItem = 5;
    } else {
      return embedReply(message, {
        title: '❌ Tipe Salah',
        description: 'Tipe harus `ore` atau `wood`.',
        emoji: '📦'
      });
    }

    if (!invCategory) {
      return embedReply(message, {
        title: '❌ Inventori Kosong',
        description: `Kamu tidak punya item di kategori ${type}.`,
        emoji: '📦'
      });
    }

    // Cari key asli yang cocok, case-insensitive
    const matchedKey = Object.keys(invCategory).find(
      key => key.toLowerCase() === itemNameInput
    );

    if (!matchedKey) {
      return embedReply(message, {
        title: '❌ Item Tidak Ada',
        description: `Kamu tidak punya **${itemNameInput}**.`,
        emoji: '📦'
      });
    }

    if (invCategory[matchedKey] < jumlah) {
      return embedReply(message, {
        title: '❌ Jumlah Tidak Cukup',
        description: `Kamu hanya punya **${invCategory[matchedKey]} ${matchedKey}**.`,
        emoji: '📦'
      });
    }

    invCategory[matchedKey] -= jumlah;
    if (invCategory[matchedKey] === 0) {
      delete invCategory[matchedKey];
    }

    const goldEarned = jumlah * pricePerItem;
    userData.gold += goldEarned;

    saveUserData(userId, userData);

    embedReply(message, {
      title: '✅ Jual Sukses',
      description: `Berhasil menjual **${jumlah}x ${matchedKey}** dan dapat **${goldEarned} gold**.`,
      emoji: '💰'
    });
  }
};
