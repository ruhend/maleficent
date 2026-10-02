exports.default = {
   tags: 'owner',
   help: ['out', 'keluar', 'outgc', 'listgc'],
   command: ['out', 'keluar', 'outgc', 'listgc'],
   start: async (m, {
      conn,
      prefix,
      command,
      text
   }) => {
      if (command === 'outgc' || command === 'outlistgc' || command === 'listgc') {
         return await Utils.leaveGroup(m, conn, prefix, command, text)
      } else if (command === 'out' || command === 'keluar') {
         await m.reply('Bye Bitch')
         await conn.group.leaveGroup([m.chat])
         delete db.chats[m.chat]
         delete db.chats.community[m.chat]
      } 
   },
   owner: true
}