import { getUserData } from '../handlers/serHandler.js';
import { embedReply } from '../handlers/embedHandler.js';
import oresData from '../database/ores.json' with { type: 'json' };
import woodsData from '../database/woods.json' with { type: 'json' };
import equipmentData from '../database/equipment.json' with { type: 'json' };

export default {
  name: 'inventory',
  async execute(message) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    // ORES dengan rarity
    const ores = Object.entries(userData.inventory.ores || {})
      .map(([name, amount]) => {
        const ore = oresData.find(o => o.name.toLowerCase() === name.toLowerCase());
        const rarity = ore ? ore.rarity : 'Unknown';
        return `⛏️ **${name}** (${rarity}): ${amount}`;
      })
      .join('\n') || 'Kosong';

    // WOODS dengan rarity
    const woods = Object.entries(userData.inventory.woods || {})
      .map(([name, amount]) => {
        const wood = woodsData.find(w => w.name.toLowerCase() === name.toLowerCase());
        const rarity = wood ? wood.rarity : 'Unknown';
        return `🪵 **${name}** (${rarity}): ${amount}`;
      })
      .join('\n') || 'Kosong';

    // ITEMS (kalau ada)
    const items = Object.entries(userData.inventory.items || {})
      .map(([name, amount]) => `🎒 **${name}**: ${amount}`)
      .join('\n') || 'Kosong';

    // EQUIPMENT (dari equipmentData kalau mau rarity juga)
    const equipment = Object.entries(userData.inventory.equipment || {})
      .map(([name, amount]) => {
        const eq = equipmentData.find(e => e.name.toLowerCase() === name.toLowerCase());
        const rarity = eq ? eq.rarity || 'Normal' : 'Unknown';
        return `🗡️ **${name}** (${rarity}): ${amount}`;
      })
      .join('\n') || 'Kosong';

    embedReply(message, {
      title: '🎒 Inventory Kamu',
      description: `
**Ores:**
${ores}

**Woods:**
${woods}

**Items:**
${items}

**Equipment:**
${equipment}
      `,
      emoji: '📦'
    });
  }
};
