import { embedReply } from '../handlers/embedHandler.js';
import { getUserData, saveUserData } from '../handlers/serHandler.js';
import recipes from '../database/recipes.json' with { type: 'json' };
import equipment from '../database/equipment.json' with { type: 'json' };

export default {
  name: 'craft',
  execute(message, args) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    if (!args[0]) {
      return embedReply(message, {
        title: '⚙️ Crafting',
        emoji: '⚙️',
        description: `Gunakan: **!craft <nama item>**`
      });
    }

    const itemName = args.join(' ').toLowerCase();

    // Cari equipment apa pun: armor atau sword
    const eq = equipment.find(e =>
      e.name && e.name.toLowerCase() === itemName &&
      e.craftable
    );

    if (!eq) {
      return embedReply(message, {
        title: '❌ Craft Gagal',
        description: `**${args.join(' ')}** tidak ditemukan atau tidak bisa di-craft.`,
        emoji: '⚒️'
      });
    }

    const recipe = recipes.find(r =>
      r.name && r.name.toLowerCase() === eq.name.toLowerCase()
    );

    if (!recipe) {
      return embedReply(message, {
        title: '❌ Craft Gagal',
        description: `Resep untuk **${eq.name}** tidak ditemukan.`,
        emoji: '🛠️'
      });
    }

    // Init user slots
    userData.inventory = userData.inventory || {};
    userData.inventory.ores = userData.inventory.ores || {};
    userData.inventory.woods = userData.inventory.woods || {};
    userData.inventory.equipment = userData.inventory.equipment || {};

    // Cek bahan ore & kayu
    for (const mat of recipe.required || []) {
      let userQty = 0;
      if (mat.name.includes('Ore')) {
        userQty = userData.inventory.ores[mat.name] || 0;
      } else if (mat.name.includes('Log')) {
        userQty = userData.inventory.woods[mat.name] || 0;
      } else {
        userQty = 0; // Unknown
      }

      if (userQty < mat.amount) {
        return embedReply(message, {
          title: '❌ Bahan Kurang',
          description: `Perlu **${mat.amount} ${mat.name}**.`,
          emoji: '📦'
        });
      }
    }

    // Cek fuel (Coal Ore dll)
    for (const fuel of recipe.fuel || []) {
      const userFuel = userData.inventory.ores[fuel.name] || 0;
      if (userFuel < fuel.amount) {
        return embedReply(message, {
          title: '❌ Bahan Bakar Kurang',
          description: `Perlu **${fuel.amount} ${fuel.name}**.`,
          emoji: '🔥'
        });
      }
    }

    // Potong bahan
    for (const mat of recipe.required || []) {
      if (mat.name.includes('Ore')) {
        userData.inventory.ores[mat.name] -= mat.amount;
      } else if (mat.name.includes('Log')) {
        userData.inventory.woods[mat.name] -= mat.amount;
      }
    }

    for (const fuel of recipe.fuel || []) {
      userData.inventory.ores[fuel.name] -= fuel.amount;
    }

    // Tambah ke equipment
    const key = eq.name;
    userData.inventory.equipment[key] = (userData.inventory.equipment[key] || 0) + recipe.resultAmount;

    embedReply(message, {
      title: '✅ Craft Sukses',
      description: `Berhasil membuat **${recipe.resultAmount}x ${eq.name}**!`,
      emoji: '🛠️'
    });

    saveUserData(userId, userData);
  }
};
