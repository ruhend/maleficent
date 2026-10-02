exports.default = {
   tags: 'owner',
   help: ['addpremium', 'addprem'],
   command: ['addpremium', 'addprem'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukkan / Tag Nomornya\ncontoh: ${prefix + command} nomor.waktu sampainya\ncontoh: ${prefix + command} 62xxxxx.10 juli 2090\ntitik setelah nomor`)
      const parts = text.split("."),
         numberPart = parts[0].trim(),
         time2 = parts[1] ? parts[1].trim() : ''
      if (!time2) return m.reply(`Masukan waktu premium nya \nContoh: ${prefix + command} nomor.tanggal\nContoh: ${prefix + command} 62xxxxx.10 juli 2090\nAtau \nContoh: ${prefix + command} @tag.10 juli 2090`)
      const Number = cleanNumber(numberPart)
      if (!Number || isNaN(Number)) return m.reply(`Nomor tidak valid. Silakan masukkan nomor tanpa karakter yang tidak diinginkan.`)
      const num = conn.toJid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'), m.participants)   
      if (!db.users[num]) throw 'Nomor tidak ada dalam database coba untuk addprem dari grup dan setidaknya dia chat agar database dia masuk'
      db.users[num].premium = true
      db.users[num].premiumTime = time2
      db.users[num].limit += 1000
      m.reply(`Nomor ${num.split('@')[0]} menjadi premium dan mendapatkan bonus utama limit 1000`)
   },
   owner: true
}