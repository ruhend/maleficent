exports.default = {
   tags: 'user',
   help: ['catatan', 'catat', 'buatcatatan', 'hapuscatatan'],
   command: ['catatan', 'catat', 'buatcatatan', 'hapuscatatan'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (command == 'catatan') {
         if (db.users[m.sender].notes == "") {
            return m.reply(`Kamu belum memiliki catatan silahkan ketik \n${prefix}buatcatatan textkamu`)
         } else {
            const msg = await m.reply(`${db.users[m.sender].notes}`)
            conn.reply(m.chat, `@${m.sender.split('@')[0]} itu cacatan kamu\njika sudah ada catatan dan jika kamu mau edit, salin dulu catatan sebelum nya lalu tambahkan text nya dengan mengetik ${prefix}buatcatatan\nkalo mau hapus catatan ketik ${prefix}hapuscatatan`, msg, {
               mentions: [m.sender]
            })
         }
      } else if (command == 'catat' || command == 'buatcatatan') {
         if (!text) return m.reply('text nya mana?')
         db.users[m.sender].notes = text
         m.reply(`Berhasil Memasukan Cacatan Kamu ketik ${prefix}catatan`)
      } else if (command == 'hapuscatatan') {
         db.users[m.sender].notes = ''
         m.reply(`Berhasil Menghapus Cacatan Kamu. Untuk Masukan Catatan Baru ketik ${prefix}buatcatatan`)
      }
   }
}