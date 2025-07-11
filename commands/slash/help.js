import { EmbedBuilder } from 'discord.js';

export default {
  name: 'help',
  async execute(interaction, commands) {
    const prefix = process.env.PREFIX || '!';

    const list = [
      `📌 **Core & Info**
• \`${prefix}profile\` ➜ Lihat profil RPG & economy
• \`${prefix}cmd\` ➜ Lihat daftar command

📜 **RPG & Battle**
• \`${prefix}hunt\` ➜ Berburu monster & dapat XP/gold
• \`${prefix}pvp\` ➜ Duel PvP dengan pemain lain
• \`${prefix}equip\` ➜ Gunakan equipment
• \`${prefix}heal <tier>\` ➜ Minum potion regen HP
• \`${prefix}craft\` ➜ Craft equipment
• \`${prefix}forge\` ➜ Forge upgrade equipment

⚒️ **Resource & Economy**
• \`${prefix}mine\` ➜ Mining ore & dapat XP/gold
• \`${prefix}timber\` ➜ Tebang kayu & dapat XP/gold
• \`${prefix}sell\` ➜ Jual hasil resource
• \`${prefix}bank\` ➜ Simpan & tarik gold
• \`${prefix}shop\` ➜ Beli potion & equipment

💼 **Work & Reward**
• \`${prefix}work\` ➜ Kerja dapat gold & XP
• \`${prefix}daily\` ➜ Klaim hadiah harian
• \`${prefix}weekly\` ➜ Klaim mingguan
• \`${prefix}monthly\` ➜ Klaim bulanan

🎒 **Inventory**
• \`${prefix}inv\` / \`${prefix}bp\` / \`${prefix}inventory\` ➜ Lihat backpack

🛡️ **Admin & Logs**
• \`${prefix}admin\` ➜ Fitur admin (reset, ban, dst)
• \`${prefix}logger\` ➜ Tulis log event

`
    ].join('\n');

    const embed = new EmbedBuilder()
      .setTitle('📜 RPG Bot Command List')
      .setDescription(list)
      .setColor(Math.floor(Math.random() * 16777215))
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
