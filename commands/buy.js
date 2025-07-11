import { embedReply } from '../handlers/embedHandler.js';
import { getUserData, saveUserData } from '../handlers/serHandler.js';
import equipment from '../database/equipment.json' with { type: 'json' };
import potions from '../database/potions.json' with { type: 'json' };

export default {
  name: 'buy',
  execute(message, args) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    const jumlah = parseInt(args[0]);
    if (isNaN(jumlah) || jumlah <= 0) {
      return embedReply(message, {
        title: '❌ Format Salah',
        emoji: '❗',
        description: 'Gunakan `!buy <jumlah> <nama item>`.'
      });
    }

    const itemName = args.slice(1).join(' ');
    if (!itemName) {
      return embedReply(message, {
        title: '❌ Item Tidak Valid',
        emoji: '📦',
        description: 'Nama item tidak boleh kosong.'
      });
    }

    // Coba cari di equipment shop-only
    let item = equipment.find(e =>
      e.name.toLowerCase() === itemName.toLowerCase() &&
      ((!e.craftable && !e.forgeable) || e.shopOnly)
    );
    let type = 'equipment';

    // Jika tidak ada, cari di potions
    if (!item) {
      item = potions.find(p => p.name.toLowerCase() === itemName.toLowerCase());
      type = 'potion';
    }

    if (!item) {
      return embedReply(message, {
        title: '❌ Tidak Ditemukan',
        emoji: '🔍',
        description: `Item **${itemName}** tidak ada di shop.\nItem ini mungkin hanya bisa dicraft atau di forge.`
      });
    }

    const price = item.price || 5000;
    const totalPrice = price * jumlah;

    if (userData.gold < totalPrice) {
      return embedReply(message, {
        title: '❌ Gold Kurang',
        emoji: '💸',
        description: `Harga total **${totalPrice} gold**, saldo kamu hanya **${userData.gold} gold**.`
      });
    }

    userData.gold -= totalPrice;

    if (type === 'equipment') {
      userData.inventory.equipment[item.name] = (userData.inventory.equipment[item.name] || 0) + jumlah;
    } else if (type === 'potion') {
      userData.inventory.items[item.name] = (userData.inventory.items[item.name] || 0) + jumlah;
    }

    saveUserData(userId, userData);

    embedReply(message, {
      title: '✅ Pembelian Sukses',
      emoji: '🛒',
      description: `Berhasil beli **${jumlah}x ${item.name}** seharga **${totalPrice} gold**!\n💰 Sisa gold: **${userData.gold}**`
    });
  }
};
