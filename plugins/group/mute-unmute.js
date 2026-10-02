exports.default = {
   tags: 'group',
   help: ['mute', 'unmute', 'muteall', 'unmuteall'],
   command: ['mute', 'unmute', 'muteall', 'unmuteall'],
   start: async (m) => {
      if (command === 'mute') {
         db.chats[m.chat].mute = true
         m.reply('Berhasil mute di chat ini')
      } else if (command === 'unmute') {         
         db.chats[m.chat].mute = false
         m.reply('Berhasil unmute di chat ini')
      } else if (command === 'muteall') {
         for await (let i of Object.keys(db.chats)) {
            if (i == 'community') continue
            db.chats[i].mute = true
         }
         m.reply('Berhasil mute ke semua group')
      } else if (command === 'unmuteall') {
         for await (let i of Object.keys(db.chats)) {
            if (i == 'community') continue
            db.chats[i].mute = false
         }
         m.reply('Berhasil unmute semua group')
      }
   },
   group: true,
   owner: true
}