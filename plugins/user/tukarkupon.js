exports.default = {
   tags: 'user',
   help: ['tukarkupon', 'kupon'],
   command: ['tukarkupon', 'kupon'],
   start: async (m, {
      conn,
      text
   }) => {
      if (!text) return m.reply(`Masukkan Parameter contoh: .tukarkupon 1\n\nKupon Kamu Tersisa ${db.users[m.sender].kupon}`)
      if (db.users[m.sender].kupon < 0) return m.reply(`Kupon kamu tidak cukup atau habis untuk menukar kupon ke limit\nsilahkan bayar hutang kupon kalo minus punya hutang\nketik .claimkupon untuk mendapatkan kupon\natau Ketik .my untuk cek sisa kupon`)
      if (/^[1-9]\d*$/.test(text)) {
         const jumlahKupon = parseInt(text)
         const jumlahLimit = jumlahKupon * 20
         if (db.users[m.sender].kupon < jumlahKupon) return m.reply(`Kupon kamu tidak cukup untuk menukar ${jumlahKupon} kupon\nPastikan kupon kamu masih mencukupi\nKupon kamu tersisa ${db.users[m.sender].kupon}`)
         db.users[m.sender].kupon -= jumlahKupon
         db.users[m.sender].limit += jumlahLimit
         conn.adReply(m.chat, `Kamu berhasil mendapat ${jumlahLimit} limit dengan menukar ${jumlahKupon} kupon`, cover, m)
      } else {
         return m.reply(`Masukkan parameter angka yang valid`)
      }
   }
}