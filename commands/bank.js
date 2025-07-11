import { embedReply } from '../handlers/embedHandler.js';
import { getUserData, saveUserData } from '../handlers/serHandler.js';


export default {
  name: 'bank',
  execute(message, args) {
    const userId = message.author.id;
    const userData = getUserData(userId);

    if (!userData.bank) userData.bank = 0;

    const action = args[0]?.toLowerCase();
    const amount = parseInt(args[1]);

    if (!action) {
      embedReply(message, {
        title: '🏦 Info Bank',
        description: `💰 Wallet: ${userData.gold} gold\n🏦 Bank: ${userData.bank} gold`,
        emoji: '💰'
      });
    } else if (action === 'deposit') {
      if (amount > userData.gold) {
        embedReply(message, {
          title: '❌ Gagal Deposit',
          description: 'Uangmu tidak cukup!',
          emoji: '❌'
        });
      } else {
        userData.gold -= amount;
        userData.bank += amount;
        embedReply(message, {
          title: '✅ Deposit Sukses',
          description: `Kamu menyetor ${amount} gold ke bank.`,
          emoji: '🏦'
        });
      }
    } else if (action === 'withdraw') {
      if (amount > userData.bank) {
        embedReply(message, {
          title: '❌ Gagal Tarik',
          description: 'Saldo bank tidak cukup!',
          emoji: '❌'
        });
      } else {
        userData.bank -= amount;
        userData.gold += amount;
        embedReply(message, {
          title: '✅ Tarik Sukses',
          description: `Kamu menarik ${amount} gold dari bank.`,
          emoji: '🏦'
        });
      }
    }

    saveUserData(userId, userData);
  }
};
