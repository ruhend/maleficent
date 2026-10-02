exports.default = {
   tags: 'owner',
   help: ['banned', 'ban'],
   command: ['banned', 'ban'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukkan Nomor dan alasan nya Contoh: ${prefix + command} @(titik)alasan\nContoh: ${prefix + command} @tag.karena dia toxic atau menghina bot\n\ntitik setelah tag`)
      const number = text.split(".")[0]
      const reason = text.split(".")[1]
      if (!reason) return m.reply(`Masukan Alasannya \nContoh: ${prefix + command} @tag.alasan\nContoh: ${prefix + command} @tag.karena dia toxic atau menghina bot\n\ntitik setelah tag`)
      const Number = cleanNumber(number)
      const num = conn.toJid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'), m.participants)
      if (!db.users[num]) throw 'Nomor tidak ada dalam database coba untuk ban dari grup'
      db.users[num].banned = true
      db.users[num].bannedReason = '\n' + reason + `\n\n*Waktu Di Banned:*\n${waktu.tanggal} ${waktu.time} ${waktu.suasana}`
      m.reply(`Nomor ${num.split('@')[0]} berhasil di banned\nSekarang Nomor Itu Tidak Bisa Menggunakan Bot Ini\n\nAlasan Di Banned:\n${reason}\n\nUntuk melihat daftar banned ketik .listbanned`)
   },
   owner: true
}