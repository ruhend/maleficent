const translate = require('../../lib/src/translate/translate.js');
exports.default = {
   tags: 'tools',
   help: ['translate', 'tr'],
   command: ['translate', 'tr'],
   start: async (m, {
      conn,
      text,
      args,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`contoh: ${prefix + command} id hello i am robot`)
      var lang, text2
      if (args.length >= 2) {
         lang = args[0] ? args[0] : 'id'
         text2 = args.slice(1).join(' ')
      } else if (m.quoted && m.quoted.text) {
         lang = args[0] ? args[0] : 'id'
         text2 = m.quoted.text
      } else {
         m.reply(`contoh: ${prefix + command} id hello i am robot`)
      }
      let res = await translate(text2, {
         to: lang,
         autoCorrect: true
      }).catch(_ => null)
      if (!res) return m.reply(`Bahasa "${lang}" Tidak Support`)
      const result = `*Terdeteksi Bahasa:* ${res.from.language.iso}\n*Ke Bahasa:* ${lang}\n\n*Terjemahan:* ${res.text}`.trim()
      conn.reply(m.chat, result, m)
   }
}