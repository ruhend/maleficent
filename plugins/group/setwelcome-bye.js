exports.default = {
   tags: 'group',
   help: ['setwelcome', 'setbye'],
   command: ['setwelcome', 'setbye'],
   start: async (m, {
      text,
      prefix,
      command
   }) => {
      if (command === 'setwelcome') {
         if (!text) return m.reply(`Masukan Text Welcome nya! \n\nContoh:\n${prefix + command} Hey Selamat Datang Babi %user\nDi Group %subject \nBaca Deskripsi Yah \n\n%subject adalah Nama Group \n%user adalah tag ke nomor member nya`)
         db.chats[m.chat].welcomeCaption = text
         m.reply(`Caption Welcome Berhasil Di Ganti Di Group ${m.groupName}`)
      } else if (command === 'setbye') {
         if (!text) return m.reply(`Masukan Text Bye nya! \n\nContoh:\n${prefix + command} Beban Group %user\nTelah Keluar Dari %subject \nSemoga ... \n\n%subject adalah Nama Group \n%user adalah tag ke nomor member nya`)
         db.chats[m.chat].byeCaption = text
         m.reply(`Caption Bye Berhasil Di Ganti Di Group ${m.groupName}`)
      }
   },
   group: true,
   admin: true
}