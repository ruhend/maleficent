const fs = require('fs')
exports.default = {
   tags: 'owner',
   help: ['db', 'database', 'getdb'],
   command: ['db', 'database', 'getdb'],
   start: async (m, {
      conn
   }) => {
      m.reply(`Tunggu sedang mengambil file database...`).then(async () => {
         conn.sendFile(m.chat, await fs.promises.readFile('./database.json'), '', m, {
            asDocument: true,
            fileName: 'database.json',
            mimetype: 'application/json'
         })
      })
   },
   owner: true
}