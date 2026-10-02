const tts = require('../../lib/src/tts/index.js');
const host = 'https://translate.google.com';
exports.default = {
   tags: 'tools',
   help: ['tts', 'gtts'],
   command: ['tts', 'gtts'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) throw `Masukan suara negara (optional) dan teksnya (titik) . sebagai pemisah\ncontoh: ${prefix + command} id.aku cinta kamu`
      let parts = text.split(".")
      let region, write
      if (parts.length > 1 && parts.length === 2) {
         region = text.slice(0, 2)
         write = parts.slice(1).join(" ")
      } else {
         region = 'id'
         write = text
      }
      if (!parts) {
         const audio = await tts.getAudioUrl(text, {
            lang: 'id',
            slow: false,
            host: host
         })
         conn.sendFile(m.chat, audio, '', m, {
            ptt: true,
         })
      } else {
         const audio = await tts.getAudioUrl(write, {
            lang: region,
            slow: false,
            host: host
         })
         conn.sendFile(m.chat, audio, '', m, {
            ptt: true
         })
      }      
   },
   limit: 1
}