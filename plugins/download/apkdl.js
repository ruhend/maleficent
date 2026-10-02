const { download } = require('../../lib/src/apk/apk.js')
exports.default = {
   tags: 'download',
   help: ['apk'],
   command: ['apk', 'apkdl'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukan apk yang ingin di cari contoh ${prefix+command} facebook lite`);      
      const res = await download(text)
      const icon = res.icon
      const paket = res.package
      const size = res.size
      const nama = res.name
      const up = res.lastup
      const file = res.dllink
      m.react('🕒')
      let caption = `  𝐀𝐏𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃\n`
      caption += ` Nama : ${nama}\n`
      caption += ` Update : ${up}\n`
      caption += ` Nama Paket : ${paket}\n`
      caption += ` Size : ${size}\n\n`
      caption += ` *Sending File...*`
      await conn.adReply(m.chat, caption, icon, m)
      await conn.sendFile(m.chat, file, '', m, {
         asDocument: true,
         fileName: nama + '.apk',
         mimetype: 'application/vnd.android.package-archive'
      })
   },
   limit: 2
}