exports.default = {
   tags: 'owner',
   help: ['addlimit', 'tambahlimit', 'addlimitowner', 'cheatlimit'],
   command: ['addlimit', 'tambahlimit', 'addlimitowner', 'cheatlimit'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (command === 'addlimit' || command === 'tambahlimit') {
         if (!text) return m.reply(`Masukkan/ tag nomor dan limitnya \natau tag yang mau di tambahkan limit dan masukan limitnya \nContoh: ${prefix + command} nomor limit\nContoh: ${prefix + command} 62xxxxx 25 \nAtau\nContoh: ${prefix + command} @tag 25`)
         const parts = text.split(" "),
            limit = parts.pop(),
            number = parts.join(" ")
         if (!limit || isNaN(limit)) return m.reply(`Masukan limitnya berupa angka \nContoh: ${prefix + command} nomor(spasi)limit\nContoh: ${prefix + command} 62xxxxx 25\nAtau \nContoh: ${prefix + command} @tag 25`)
         const Number = cleanNumber(number)
         const num = conn.toJid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'), m.participants)                 
         if (!db.users[num]) return m.reply(`Pengguna dengan nomor ${num} tidak ditemukan dalam database. Pastikan nomor sudah terdaftar.\natau coba untuk tag contoh \n.addlimit @tag 100`)
         db.users[num].limit += parseInt(limit)
         m.reply(`Berhasil Menambahkan ${limit} Limit Ke ${num.split('@')[0]}`)
      } else if (command === 'addlimitowner' || command === 'cheatlimit') {
         if (!text) return m.reply(`Masukkan limitnya contoh: \n${prefix + command} 100`)
         db.users[m.sender].limit += parseInt(text)
         m.reply(`Cheat Limit ${text} Berhasil`)
      }
   },
   owner: true
}