exports.default = {
   tags: 'owner',
   help: ['hapusprem', 'delprem'],
   command: ['hapusprem', 'delprem'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Tag / Masukkan Nomornya. Contoh: ${prefix + command} nomor\nContoh: ${prefix + command} 62xxxxx`)
      const Number = cleanNumber(text)
      if (!Number || isNaN(Number)) return m.reply(`Nomor tidak valid. Silakan masukkan nomor tanpa karakter yang tidak diinginkan.`)
      const num = conn.toJid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'), m.participants)   
      if (!db.users[num]) throw 'Nomor tidak ada dalam database coba untuk delprem dari grup'
      db.users[num].premium = false
      db.users[num].premiumTime = ''
      m.reply(`Nomor ${num.split('@')[0]} tidak lagi menjadi premium`)
   },
   owner: true
}