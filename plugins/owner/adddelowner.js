exports.default = {
   tags: 'owner',
   help: ['addowner', 'addown', 'delowner', 'delown'],
   command: ['addowner', 'addown', 'delowner', 'delown'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukkan Nomornya contoh\n${prefix + command} 62xxxx atau tag @tag nomornya`)       
      let num
      if (text.match("@")) {
         const Number = cleanNumber(text)
         if (!Number || isNaN(Number)) return m.reply(`Nomor tidak valid. Silakan masukkan nomor tanpa karakter yang tidak diinginkan.`)
         num = conn.toJid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'), m.participants).split('@')[0]       
      } else {
         num = cleanNumber(text)
      }

      if (/addowner|addown/.test(command)) {
         setting.owner.push(num)
         save.setting()
         return m.reply(`Sukses Menambahkan ${num} sebagai owner`)
      } else if (/delowner|delown/.test(command)) {
         const index = setting.owner.indexOf(num)
         if (index !== -1) {
            setting.owner.splice(index, 1)
            save.setting()
            m.reply(`Nomor ${num} berhasil dihapus dari daftar owner.`)
         } else {
            return m.reply(`Nomor ${text} tidak ditemukan dalam daftar owner.`)
         }
      }
   },
   owner: true
}