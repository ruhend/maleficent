exports.default = {
   tags: 'user',
   help: ['transferuang', 'tfuang'],
   command: ['transferuang', 'tfuang'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukkan nomor atau tag dan nilai uang yang mau di transfer\ncontoh: ${prefix + command} 62xxxx 50\nAtau\ncontoh: ${prefix + command} @tag 50`)
      if (db.users[m.sender].uang < 49) return m.reply(`Gagal Transfer Pastikan Uang Kamu Masih Mencukupi Minimal Transfer Uang Adalah 50 ketik .my untuk cek sisa uang`)
      const number = text.split(" ")[0]
      const uang = text.split(" ")[1]
      if (!uang) return m.reply(`Masukkan nilai uang yang mau di transfer\ncontoh: ${prefix + command} 62xxxx 50\nAtau\ncontoh: ${prefix + command} @tag 50`)
      const Number = cleanNumber(number)
      const num = conn.toJid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'), m.participants)
      const give = parseInt(uang)
      if (!db.users[num]) return m.reply(`Pengguna dengan nomor ${num} tidak ditemukan dalam database. Pastikan nomor sudah terdaftar.`)
      db.users[m.sender].uang -= give
      db.users[num].uang += give
      conn.adReply(m.chat, `Kamu berhasil transfer ${give} uang ke nomor @${num.split('@')[0]}`, cover, m, {
         mentions: [num]
      })
   }
}