exports.default = {
   tags: 'owner',
   help: ['unbanned', 'unban'],
   command: ['unbanned', 'unban'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukkan Nomornya. Contoh: ${prefix + command} nomor\nContoh: ${prefix + command} 62xxxxx \n\nkamu bisa lihat di .listbanned\n\nterus salin nomornya lalu tempel`)
      const Number = cleanNumber(text)
      const num = conn.toJid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'), m.participants)      
      if (!db.users[num]) throw 'Nomor tidak ada dalam database coba untuk unban dari grup'
      db.users[num].banned = false
      db.users[num].bannedReason = ''
      m.reply(`Nomor ${num.split('@')[0]} berhasil dihapus dari database banned\nSekarang Nomor Itu Bisa Menggunakan Bot Ini\nUntuk melihat daftar banned ketik .listbanned`)
   },
   owner: true
}