const { format } = require('util')
const { exec } = require('child_process');
exports.default = {
   tags: 'info',
   help: ['speedtest', 'speed'],
   command: ['speedtest', 'speed'],
   start: async (m, {
      conn
   }) => {
      m.reply('*Testing Speed...*')
      await exec('python3 lib/speed.py', async (x, y) => {
         const result = await format(y)
         await conn.reply(m.chat, result.trim(), m)
      })
   }
}