exports.default = {
   tags: 'owner',
   help: ['addctag', 'addcustomtag', 'delctag', 'delcustomtag'],
   command: ['addctag', 'addcustomtag', 'delctag', 'delcustomtag'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text && !m?.quoted) return m.reply(`masukan nomor atau tag yang mau di isengin (dia ketag terus) \n\ncontoh: ${prefix + command} 62xxxx atau ${prefix + command} @tag atau balas apa saja pesan dia (quoted) sambil ketik ${prefix + command}`)
      let num
      const getUser = () => {
         if (m?.quoted) return m.quoted.sender
         const Number = cleanNumber(text)
         num = conn.toJid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'), m.participants)          
         if (!num) return null
         return num
      }

      const user = getUser()
      if (!user) return m.reply(`nomor tidak valid, coba lagi!`)

      if (/addctag|addcustomtag/.test(command)) {
         db.settings.custom_tags.push(user)
         return m.reply(`sukses menambahkan ${user.split('@')[0]} ke custom tag sekarang dia akan ke tag terus 🤣`)
      } else if (/delctag|delcustomtag/.test(command)) {
         const custom = db.settings.custom_tags
         const index = custom.indexOf(user)

         if (index !== -1) {
            custom.splice(index, 1)
            return m.reply(`sukses menghapus ${user.split('@')[0]} dari custom tag, dia udah ga akan ke tag lagi 😁`)
         } else {
            return m.reply(`${user.split('@')[0]} tidak ditemukan di custom tag!`)
         }
      }
   },
   owner: true
}