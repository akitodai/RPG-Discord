import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Menampilkan daftar command RPG & economy')
    .toJSON()
];

// Inisialisasi REST API
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🚀 Registering /help slash command...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Slash command registered globally.');
  } catch (error) {
    console.error('❌ Gagal register slash command:', error);
  }
})();
