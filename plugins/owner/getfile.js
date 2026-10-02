const { exec } = require('child_process');
exports.default = {
   tags: 'owner',
   help: ['getfile', 'gf'],
   command: ['getfile', 'gf'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`contoh ${prefix + command} main.js atau file yang ingin kamu lihat`)
      let path2 = `${text}`
      exec(`cat ${path2}`, (x, y) => {
         if (x) return m.reply(`${path2}\ntidak ada`)
         if (y) return m.reply(y.toString())
      })
   },
   owner: true
}