import { EmbedBuilder } from 'discord.js';

export default {
  name: 'cmd',
  execute(message) {
    const embed = new EmbedBuilder()
      .setTitle('📜 Daftar Perintah RPG Bot')
      .setColor(Math.floor(Math.random() * 16777215))
      .setDescription(`
**💬 General**
\`!cmd\` ➜ Lihat daftar perintah
\`!profile\` ➜ Lihat profil & stats

**💰 Economy**
\`!work\` ➜ Kerja & dapat uang
\`!bank\` ➜ Cek saldo bank (optional)

**⚒️ Resource**
\`!mine\` ➜ Menambang ore
\`!timber\` ➜ Menebang kayu
\`!sell\` ➜ Jual item

**🐲 RPG**
\`!hunt\` ➜ Melawan monster
\`!battle\` ➜ PVP antar pemain
\`!equip\` ➜ Pakai equipment

**🧰 Crafting & Forging**
\`!craft\` ➜ Lihat & buat item material
\`!forge\` ➜ Lihat & forge senjata/armor
    `)
      .setFooter({ text: `Permintaan oleh ${message.author.username} • ${new Date().toLocaleString()}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
