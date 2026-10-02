const child_process = require('child_process');
const util = require('util');
const execPromise = (0, util.promisify)(child_process.exec);
exports.default = {
   tags: 'owner',
   help: ['$', 'shell', 'exec'],
   command: ['$', 'shell', 'exec'],
   start: async (m, { 
      text
   }) => {
      if (!text) return m.reply('*Masukkan perintah shell!*');
      try {
         const { stdout, stderr } = await execPromise(text);
         if (stdout) {
            m.reply(`${stdout.trim()}`);
         }
         if (stderr) {
            m.reply(`Error:\n\n${stderr.trim()}`);
         }
         if (!stdout && !stderr) {
            m.reply('*Command executed (No output)*');
         }
      } catch (error) {
         return m.reply(`*Error:*\n\n${error.message}`);
      }
   },
   owner: true,
}