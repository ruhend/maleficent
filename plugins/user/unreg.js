exports.default = {
   tags: 'user',
   help: ['unreg'],
   command: ['unreg'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!db.users[m.sender].registered) return m.reply(`Kamu Belum Terdaftar Ketik .daftar`)
      if (!text) return m.reply(`Masukan nomor sn nya untuk melihat sn silahkan ketik .sn atau .ceksn\ncontoh ${prefix + command} sn `)
      let serial = db.users[m.sender].seri
      if (text == serial) {
        /* db.users[m.sender].registered = false
         db.users[m.sender].registeredTime = ''
         db.users[m.sender].seri = ''
         db.users[m.sender].umur = ''*/
         delete db.users[m.sender]
         return conn.adReply(m.chat, `Kamu Berhasil Keluar Dari Data Base Semua Data Kamu Kereset Ulang Ketik .me`, cover, m)
      } else {
         return m.reply(`serial number kamu salah masukan dengan benar ketik .sn`)
      }
   }
}