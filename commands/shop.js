import { embedReply } from '../handlers/embedHandler.js';
import equipment from '../database/equipment.json' with { type: 'json' };
import potions from '../database/potions.json' with { type: 'json' };

export default {
  name: 'shop',
  execute(message) {
    const shopItems = [];

    // Ambil equipment shop-only
    equipment.forEach(eq => {
      const isShopItem =
        (!eq.craftable && !eq.forgeable) || eq.shopOnly;

      if (isShopItem) {
        let stat = '';
        if (eq.type === 'sword' && eq.atk) {
          stat = `⚔️ ATK: ${eq.atk}`;
        }
        if (eq.type === 'armor' && eq.maxHP) {
          stat = `❤️ HP: ${eq.maxHP}`;
        }

        shopItems.push({
          emoji: eq.type === 'sword' ? '🗡️' : '🛡️',
          name: eq.name,
          price: eq.price || 5000,
          info: `Tipe: ${eq.type.charAt(0).toUpperCase() + eq.type.slice(1)}`,
          stat: stat
        });
      }
    });

    // Potions selalu masuk shop
    potions.forEach(p => {
      shopItems.push({
        emoji: '🧪',
        name: p.name,
        price: p.price,
        info: `Memulihkan ${p.heal} HP`
      });
    });

    if (shopItems.length === 0) {
      return embedReply(message, {
        title: '🛒 Shop',
        description: 'Saat ini shop kosong!',
        emoji: '❌'
      });
    }

    const list = shopItems
      .map(item => {
        let block = `${item.emoji} **${item.name}**\n💰 Harga: ${item.price}\n📌 ${item.info}`;
        if (item.stat) {
          block += `\n${item.stat}`;
        }
        return block + '\n';
      })
      .join('\n');

    embedReply(message, {
      title: '🛒 Shop Resmi',
      description: `
Selamat datang di Shop Adventurer! 🎒✨

Berikut adalah daftar item spesial yang bisa kamu beli:

${list}

🛍️ Gunakan \`!buy <jumlah> <nama item>\` untuk berbelanja.
Pastikan goldmu cukup ya!
      `,
      emoji: '💎'
    });
  }
};
