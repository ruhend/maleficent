exports.default = {
   tags: 'user',
   help: ['buylimit'],
   command: ['buylimit'],
   start: async (m, {
      conn,
      text
   }) => {
      if (!text) return m.reply(`Masukkan Parameter contoh: .buylimit 1`)
      if (db.users[m.sender].uang < 10) return m.reply(`Uang kamu tidak cukup atau habis untuk membeli limit\nsilahkan bayar hutang kalo minus punya hutang\nketik .claimuang untuk uang harian\natau Ketik .my untuk cek sisa uang`)
      if (/^[1-9]\d*$/.test(text)) {
         const jumlahLimit = parseInt(text)
         const hargaLimit = jumlahLimit * 10
         if (db.users[m.sender].uang < hargaLimit) return m.reply(`Uang Kamu Tidak Cukup Untuk Membeli ${jumlahLimit} Limit\n\nUang Kamu Hanya Ada ${db.users[m.sender].uang}\n\nHarga Yang Di butuhkan Adalah ${hargaLimit} Uang\n\nCoba Untuk Mengurangi Jumlah Limitnya Yang Ingin Di Beli`)
         db.users[m.sender].limit += jumlahLimit
         db.users[m.sender].uang -= hargaLimit
         conn.adReply(m.chat, `Kamu berhasil membeli ${jumlahLimit} limit dengan harga ${hargaLimit} uang`, cover, m)
      } else {
         return m.reply(`Masukkan parameter angka yang valid`)
      }
   }
}