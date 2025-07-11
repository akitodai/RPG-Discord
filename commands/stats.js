import os from 'os';
import fs from 'fs';
import { embedReply } from '../handlers/embedHandler.js';

export default {
  name: 'stats',
  async execute(message) {
    const guildMember = message.member;
    const adminRoleId = process.env.ADMIN_ROLE_ID;

    if (!guildMember.roles.cache.has(adminRoleId)) {
      return embedReply(message, {
        title: '🚫 Akses Ditolak',
        description: 'Hanya admin yang bisa melihat statistik server.',
        emoji: '❌'
      });
    }

    // ✅ Uptime
    const uptimeSec = process.uptime();
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = Math.floor(uptimeSec % 60);

    // ✅ Memory
    const memory = process.memoryUsage();
    const rss = (memory.rss / 1024 / 1024).toFixed(2);
    const heapUsed = (memory.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotal = (memory.heapTotal / 1024 / 1024).toFixed(2);
    const external = (memory.external / 1024 / 1024).toFixed(2);

    // ✅ CPU usage
    const cpuUsage = process.cpuUsage();
    const cpuUser = (cpuUsage.user / 1000000).toFixed(2);
    const cpuSystem = (cpuUsage.system / 1000000).toFixed(2);

    // ✅ Total user files
    let totalUsers = 0;
    try {
      totalUsers = fs.readdirSync('./database/users').filter(f => f.endsWith('.json')).length;
    } catch {
      totalUsers = 0;
    }

    // ✅ Commands count
    const totalCommands = message.client.commands.size || 0;

    // ✅ Guilds & members
    const totalGuilds = message.client.guilds.cache.size;
    let totalMembers = 0;
    message.client.guilds.cache.forEach(guild => {
      totalMembers += guild.memberCount;
    });

    // ✅ OS Info
    const platform = os.platform();
    const arch = os.arch();
    const osType = os.type();
    const osRelease = os.release();
    const osUptime = Math.floor(os.uptime() / 60); // in minutes

    // ✅ Ping ke Discord API
    const apiPing = Math.round(message.client.ws.ping);

    // ✅ Ping ke server local
    const localPingStart = Date.now();
    await new Promise(r => setTimeout(r, 100));
    const localPing = Date.now() - localPingStart;

    // ✅ Log ke file /database/log-stats/
    const logDir = './database/log-stats';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logData = {
      by: message.author.tag,
      time: new Date().toISOString(),
      uptime: `${hours}h ${minutes}m ${seconds}s`,
      totalUsers,
      totalCommands,
      totalGuilds,
      totalMembers,
      rssMB: rss,
      apiPing,
      localPing,
      os: {
        type: osType,
        platform,
        arch,
        release: osRelease,
        osUptimeMin: osUptime
      }
    };
    const fileName = `${logDir}/log-${Date.now()}.json`;
    fs.writeFileSync(fileName, JSON.stringify(logData, null, 2));

    // ✅ Embed reply
    embedReply(message, {
      title: '📡 Server Monitor',
      description: `
✅ **Status:** Online
⏱️ **Uptime:** ${hours}h ${minutes}m ${seconds}s

📦 **Commands Loaded:** ${totalCommands}
📁 **User Files:** ${totalUsers}
🌐 **Servers:** ${totalGuilds}
👥 **Total Members:** ${totalMembers}

💾 **Memory**
• RSS: ${rss} MB
• Heap: ${heapUsed}/${heapTotal} MB
• External: ${external} MB

🧮 **CPU**
• User: ${cpuUser} ms
• System: ${cpuSystem} ms

📡 **Ping**
• Discord API: ${apiPing} ms
• Local Host: ${localPing} ms

🖥️ **OS Info**
• ${osType} (${platform})
• Arch: ${arch}
• Release: ${osRelease}
• Host Uptime: ${osUptime} min

🗂️ **Log**
Log dicatat ke: \`${fileName}\`
      `,
      emoji: '📊'
    });
  }
};
