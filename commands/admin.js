import { getUserData, saveUserData } from '../handlers/serHandler.js';
import { embedReply } from '../handlers/embedHandler.js';
import { setMaintenance } from '../handlers/maintenanceHandler.js';

export default {
  name: 'admin',
  execute(message, args) {
    const guildMember = message.member;
    const adminRoleId = process.env.ADMIN_ROLE_ID;

    if (!guildMember.roles.cache.has(adminRoleId)) {
      return embedReply(message, {
        title: '🚫 Akses Ditolak',
        description: 'Kamu bukan admin!',
        emoji: '❌'
      });
    }

    if (!args[0]) {
      return embedReply(message, {
        title: '📜 Daftar Perintah Admin',
        description: `
Gunakan:
\`!admin maintenance\`
\`!admin unmaintenance\`
\`!admin addgold @user jumlah\`
\`!admin removegold @user jumlah\`
\`!admin setlevel @user level\`
\`!admin removelevel @user jumlah\`
\`!admin addrpgxp @user jumlah\`
\`!admin removerpgxp @user jumlah\`
\`!admin giveitem @user "Nama Item" jumlah\`
\`!admin checkid @user\`
        `,
        emoji: '🛠️'
      });
    }

    const action = args[0];

    // ✅ MAINTENANCE
    if (action === 'maintenance') {
      setMaintenance(true);
      return embedReply(message, {
        title: '🚧 Maintenance Aktif',
        description: 'Mode maintenance diaktifkan. Hanya admin yang bisa menggunakan command.',
        emoji: '🔒'
      });
    }

    // ✅ UNMAINTENANCE
    if (action === 'unmaintenance') {
      setMaintenance(false);
      return embedReply(message, {
        title: '✅ Maintenance Nonaktif',
        description: 'Mode maintenance dimatikan. Semua user bisa menggunakan command lagi.',
        emoji: '🔓'
      });
    }

    const target = message.mentions.users.first();

    if (!target && action !== 'maintenance' && action !== 'unmaintenance') {
      return embedReply(message, {
        title: '❌ Format Salah',
        description: 'Kamu harus mention target user!',
        emoji: '⚠️'
      });
    }

    const targetId = target?.id;
    const userData = getUserData(targetId);
    const amount = parseInt(args[2]);
    const itemName = args[2];
    const itemAmount = parseInt(args[3]);

    switch (action) {
      // Perintah lain tetap sama
      case 'addgold':
        if (isNaN(amount)) {
          return embedReply(message, {
            title: '❌ Format Salah',
            description: 'Jumlah harus angka.',
            emoji: '⚠️'
          });
        }
        userData.gold += amount;
        saveUserData(targetId, userData);
        return embedReply(message, {
          title: '💰 Tambah Gold',
          description: `Berhasil menambahkan **${amount} gold** ke **${target.username}**.`,
          emoji: '✅'
        });

      case 'removegold':
        if (isNaN(amount)) {
          return embedReply(message, {
            title: '❌ Format Salah',
            description: 'Jumlah harus angka.',
            emoji: '⚠️'
          });
        }
        userData.gold = Math.max(0, userData.gold - amount);
        saveUserData(targetId, userData);
        return embedReply(message, {
          title: '💰 Kurangi Gold',
          description: `Berhasil mengurangi **${amount} gold** dari **${target.username}**.`,
          emoji: '✅'
        });

      // ... (Sisa case sama seperti sebelumnya)

      default:
        return embedReply(message, {
          title: '❌ Perintah Tidak Dikenal',
          description: `Gunakan \`!admin\` untuk melihat daftar perintah.`,
          emoji: '⚠️'
        });
    }
  }
};
