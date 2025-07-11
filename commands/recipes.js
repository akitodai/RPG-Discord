import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import equipment from '../database/equipment.json' with { type: 'json' };
import recipes from '../database/recipes.json' with { type: 'json' };
import { embedReply } from '../handlers/embedHandler.js';

export default {
  name: 'recipes',
  async execute(message) {
    const craftableItems = equipment.filter((item) => item.craftable);

    if (!craftableItems || craftableItems.length === 0) {
      await embedReply(message, '📜 Resep', 'Tidak ada equipment yang dapat dibuat.');
      return;
    }

    const itemsPerPage = 5;
    let page = 0;

    const generateEmbed = (page) => {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const currentItems = craftableItems.slice(start, end);

      let description = '';
      currentItems.forEach((item, index) => {
        description += `**${start + index + 1}. ${item.name}**\n`;
        description += `📦 **Tipe:** ${item.type}\n`;
        description += `⭐ **Tier:** ${item.tier}\n`;

        if (item.atk) description += `⚔️ ATK: ${item.atk}\n`;
        if (item.maxHP) description += `❤️ HP: ${item.maxHP}\n`;

        // Cari resepnya di recipes.json
        const recipe = recipes.find((r) => r.name === item.name);

        if (recipe) {
          const requiredStr = Array.isArray(recipe.required) && recipe.required.length > 0
            ? recipe.required.map((mat) => `${mat.amount}x ${mat.name}`).join(', ')
            : 'Tidak ada';

          const fuelStr = Array.isArray(recipe.fuel) && recipe.fuel.length > 0
            ? recipe.fuel.map((mat) => `${mat.amount}x ${mat.name}`).join(', ')
            : '-';

          description += `🔹 **Bahan:** ${requiredStr}\n`;
          if (recipe.fuel && recipe.fuel.length > 0) {
            description += `🔥 **Bahan Bakar:** ${fuelStr}\n`;
          }
          description += `\n`;
        } else {
          description += `❌ **Resep:** Belum tersedia\n\n`;
        }
      });

      return new EmbedBuilder()
        .setTitle('📦 Daftar Resep Equipment')
        .setDescription(description)
        .setColor(0x00ffff)
        .setFooter({
          text: `Halaman ${page + 1} dari ${Math.ceil(craftableItems.length / itemsPerPage)}`,
        });
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('⬅️ Sebelumnya')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡️ Berikutnya')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(craftableItems.length <= itemsPerPage)
    );

    const embedMessage = await message.reply({
      embeds: [generateEmbed(page)],
      components: [row],
    });

    const collector = embedMessage.createMessageComponentCollector({
      time: 60000,
    });

    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        await interaction.reply({ content: 'Tombol ini bukan untukmu!', ephemeral: true });
        return;
      }

      if (interaction.customId === 'prev') page--;
      if (interaction.customId === 'next') page++;

      row.components[0].setDisabled(page === 0);
      row.components[1].setDisabled((page + 1) * itemsPerPage >= craftableItems.length);

      await interaction.update({
        embeds: [generateEmbed(page)],
        components: [row],
      });
    });

    collector.on('end', async () => {
      row.components.forEach((btn) => btn.setDisabled(true));
      await embedMessage.edit({
        components: [row],
      });
    });
  },
};
