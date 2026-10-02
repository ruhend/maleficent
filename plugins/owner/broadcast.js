exports.default = {
   tags: 'owner',
   help: ['broadcast', 'bc'],
   command: ['broadcast', 'bc'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukan Text Nya Contoh:\n${prefix + command} Informasi ${setting.botName}`)

      let group = Object.keys(db.chats).filter(jid => jid && jid !== 'community')
      let total = group.length
      let terkirim = 0

      m.reply(`Ok tunggu sedang broadcast ke ${total} group...`)

      for await (let jid of group) {         
         conn.adReply(jid, text, cover, fake_wa)
         terkirim++
         await sleep(2000)        
      }

      m.reply(`✅ Broadcast selesai!\n\nTerkirim: ${terkirim}/${total} group`)
   },
   owner: true
}