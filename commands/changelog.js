import { embedReply } from '../handlers/embedHandler.js';

export default {
  name: 'changelog',
  execute(message) {
    const changelog = [
      '✨ **NEW:** Pengetikan ulang `/cmd` & `!cmd` agar lebih rapi.',
      '✨ **NEW:** Penambahan command `!changelog`.',
      '✨ **NEW:** Booster Role khusus untuk XP & Gold.',
      '✨ **NEW:** Command `!admin maintenance` untuk admin.',
      '🛠️ **IMPROVEMENT:** Penyetabilan stat equipment.',
      '🛠️ **IMPROVEMENT:** Penyetabilan beberapa module code.',
      '🔒 **SECURITY:** Sekarang `!hunt` butuh equipment aktif (sword/armor).'
    ];

    embedReply(message, {
      title: '📌 Changelog Terbaru',
      description: changelog.join('\n\n'),
      emoji: '📝'
    });
  }
};
