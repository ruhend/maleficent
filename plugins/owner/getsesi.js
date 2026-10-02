const fs = require('fs');
exports.default = {
   tags: 'owner',
   help: ['sesi', 'sessi', 'getsesi'],
   command: ['sesi', 'sessi', 'getsesi'],
   start: async (m, {
      conn
   }) => {
      m.reply(`Tunggu sedang mengambil file sessi...`)
      const file = await fs.promises.readFile('./sessions/creds.json')
      conn.sendFile(m.chat, file, '', m, {
         asDocument: true,
         fileName: 'creds.json',
         mimetype: 'application/json'
      })
   },
   owner: true,
   private: true
}