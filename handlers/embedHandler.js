import { EmbedBuilder } from 'discord.js';

/**
 * Membuat reply embed dengan warna RGB random + footer + timestamp
 * 
 * @param {Message} message 
 * @param {Object} options 
 * @param {string} options.title 
 * @param {string} [options.emoji] 
 * @param {string} options.description 
 * @param {boolean} [options.ephemeral] default false
 * @returns 
 */
export function embedReply(message, options) {
  const { title, emoji, description, ephemeral = false } = options;

  const embed = new EmbedBuilder()
    .setTitle(`${emoji || ''} ${title}`)
    .setDescription(description)
    .setColor(Math.floor(Math.random() * 16777215))
    .setFooter({ text: `Permintaan oleh ${message.author.username} • ${new Date().toLocaleString()}` })
    .setTimestamp();

  return message.reply({ embeds: [embed], ephemeral });
}
