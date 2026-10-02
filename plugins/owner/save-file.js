const fs = require('fs');
const vm = require('vm');
exports.default = {
   tags: 'owner',
   help: ['sf', 'simpan', 'addfile'],
   command: ['sf', 'simpan', 'addfile'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!m.quoted) return m.reply(`balas pesan nya berbentuk file atau dokumen atau text yang mau disimpan`)
      if (!text) return m.reply('masukan jalur path nya \ncontoh: ' + prefix + command + ' lib/handler.js\n' + prefix + command + ' config.json\nfile besar upload file nya dulu atau kode kecil langsung balas ke pesannya')

      const path = text.trim()
      const isJsonPath = /\.json$/i.test(path)
      let rawContent

      if (m.quoted.type === 'documentMessage') {
         const data = await m.quoted.download()
         rawContent = Buffer.from(data).toString()
      } else if (m.quoted.text) {
         rawContent = m.quoted.text
      } else {
         return m.reply('balas pesan nya berbentuk file atau dokumen atau text yang mau disimpan')
      }

      if (isJsonPath) {
         try {
            JSON.parse(rawContent)
         } catch (e) {
            return m.reply(`❗ silahkan periksa json nya, ada kesalahan sintaks JSON.\n\n${e.message}`)
         }

         await fs.promises.writeFile(path, rawContent)
         return m.reply(`tersimpan di ${path}`)
      }

      try {
         new vm.Script(rawContent, {
            filename: path
         })
      } catch (e) {
         throw e
      }

      await fs.promises.writeFile(path, rawContent)
      return m.reply(`tersimpan di ${path}`)
   },
   owner: true
}