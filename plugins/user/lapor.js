exports.default = {
   tags: 'user',
   help: ['lapor'],
   command: ['lapor'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) throw `untuk bertanya sesi live chat dengan owner bukan bot sekarang\nmasukan text nya contoh \n${prefix + command} halo owner tolong ke grup sewa Nexus NS sebentar ada yang di tanya`
      const num = setting.owner.map(v => v + '@s.whatsapp.net')
      const teks = `Laporan Dari @${m.sender.split('@')[0]}\nPesan : ${text}`
      const caption = `Baik permintaan kamu akan segera di proses silahkan tunggu beberapa saat\nNomor: @${m.sender.split('@')[0]}\nNama: ${db.users[m.sender].name}\nWaktu: ${waktu.tanggal} ${waktu.jam} ${waktu.suasana}\nLaporan: ${text}`
      conn.adReply(m.chat, caption, cover, m, {
         mentions: [m.sender]
      }).then(() => {
         num.forEach(async v => {
            await sleep(2000)
            conn.adReply(v, teks, cover, m, {
               mentions: [m.sender]
            })
         })
      })
   }
}