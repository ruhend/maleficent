exports.default = {
   tags: 'group',
   help: ['join', 'gabung'],
   command: ['join', 'gabung'],
   start: async (m, { 
      conn, 
      text
   }) => {
      if (!text) throw 'masukan link group nya!'
      await conn.group.joinGroupViaInvite(text.replace('https://chat.whatsapp.com/', '').split('?')[0])
      return m.reply('Berhasil Join ✅')
   },
   owner: true
}