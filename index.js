import { Client, Collection, GatewayIntentBits, ActivityType } from 'discord.js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { isMaintenance } from './handlers/maintenanceHandler.js';

dotenv.config();

// Buat client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Koleksi commands
client.commands = new Collection();
const prefix = process.env.PREFIX || '!';

// Banner ASCII sebelum load commands
console.log(`\x1b[36m
██╗ ██████╗  █████╗ ██╗  ██╗ █████╗ ██████╗    ███████╗  ███████╗██╗    ██╗
██║ ██   ██ ██╔══██║ ██║ ██╔╝██╔══██╗██╔══██╗   ██    ██  ██╔════╝╚██╗  ██╔╝
██║ ██      ███████║ █████╔╝ ███████║██████╔╝   ██    ██  █████╗   ╚██ ██╔╝ 
██║ ██   ██ ██╔══██║ ██╔═██╗ ██╔══██║██╔═══╝    ██    ██  ██╔══╝    ╚█ █╔╝  
██║ ██████║ ██║  ██║ ██║  ██╗██║  ██║██║        ███████║  ███████╗   ███║   
╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚══════╝  ╚══════╝   ╚══╝   
\x1b[0m`);

// Load semua command dari folder ./commands
const commandsPath = './commands';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  if (file.includes('.disable')) {
    console.log(`| ⏸️  > Disabled : ${file}`);
    continue;
  }

  const command = await import(`./commands/${file}`);
  if (!command.default || !command.default.name || !command.default.execute) {
    console.warn(`⚠️ Command file ${file} tidak valid. Skip.`);
    continue;
  }

  client.commands.set(command.default.name, command.default);
  console.log(`| ✅ > Loaded CMD : ${command.default.name}`);
}

// Bot ready
client.once('ready', () => {
  const startedAt = new Date();

  console.log(`\x1b[36m
╔═════════════════════════════════════╗
   ✅ Bot aktif: ${client.user.tag}
   🚀 Petualangan RPG dimulai!
╚═════════════════════════════════════╝
\x1b[0m`);

  // ⏱️ Tampilkan uptime berjalan di terminal
  setInterval(() => {
    const now = new Date();
    const diff = now - startedAt;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    process.stdout.write(`\r⏱️  Uptime: ${hours}h ${minutes}m ${seconds}s `);
  }, 1000);

  client.user.setPresence({
    activities: [
      {
        name: 'Epic RPG Adventure ⚔️',
        type: ActivityType.Streaming,
        url: 'https://youtube.com/@akitodai?si=XqPP-gzjFc1O-CIo'
      }
    ],
    status: 'online'
  });
});

// Slash /help
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'help') {
    const embed = {
      title: '📜 Daftar Commands',
      description: `
Gunakan prefix: \`${prefix}\`

✨ **RPG & Economy**
• \`!work\` — 💼 Kerja harian
• \`!mine\` — ⛏️ Tambang ore
• \`!timber\` — 🌲 Tebang kayu
• \`!hunt\` — 🐺 Berburu monster
• \`!heal\` — 🧪 Minum potion
• \`!profile\` — 🧍 Lihat profil
• \`!bank\` — 🏦 Kelola bank
• \`!shop\` — 🛒 Lihat shop
• \`!sell\` — 💸 Jual barang
• \`!equip\` — 🛡️ Pakai equipment
• \`!inv\` / \`!bp\` — 🎒 Backpack
• \`!craft\` — 🔨 Craft item
• \`!pvp\` — ⚔️ PVP

Gunakan Slash: \`/help\` kapan saja!
      `,
      color: 0x00ffff,
      footer: { text: `Requested by ${interaction.user.tag}` }
    };

    await interaction.reply({ embeds: [embed] });
  }
});

// Prefix commands
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  // ✅ Cek maintenance
  if (isMaintenance()) {
    const adminRoleId = process.env.ADMIN_ROLE_ID;
    if (!message.member.roles.cache.has(adminRoleId)) {
      return message.reply('🚧 Bot sedang dalam mode maintenance. Hanya admin yang dapat menggunakan perintah.');
    }
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command = client.commands.get(cmdName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply('❌ Terjadi kesalahan saat menjalankan perintah.');
  }
});

// Login bot
client.login(process.env.TOKEN);
