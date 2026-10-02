exports.default = {
   tags: 'owner',
   help: ['block', 'blok', 'blockir', 'blokir', 'unblock', 'unblok', 'unblockir', 'unblokir'],
   command: ['block', 'blok', 'blockir', 'blokir', 'unblock', 'unblok', 'unblockir', 'unblokir'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Tag / Masukkan Nomornya yang mau di blok / unblok\nContoh: ${prefix + command} nomor\nContoh: ${prefix + command} 62xxxxx`)
      const Number = cleanNumber(text)
      const num = conn.toJid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'), m.participants)          
      const action = /unblock|unblok|unblockir|unblokir/.test(command.toLowerCase()) ? 'unblockUser' : 'blockUser'
      await conn.privacy[action](num)
      m.reply(`Nomor ${num.split('@')[0]} berhasil di ${action === 'block' ? 'blokir' : 'unblok'}`)
   },
   owner: true
}