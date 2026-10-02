exports.default = {
   tags: 'owner',
   help: ['self', 'public'],
   command: ['self', 'public'],
   start: async (m, {
      command
   }) => {
      if (command == 'self') {
         setting.self = true
         global.self = setting.self
         save.setting()
         await m.reply(`Mode self berhasil diaktifkan. Hanya aku, owner, dan premium yang dapat mengakses bot ini`)
      } else if (command == 'public') {
         setting.self = false
         global.self = setting.self
         save.setting()
         await m.reply(`Mode self berhasil dimatikan. Sekarang semua orang dapat mengakses bot ini`)
      }
   },
   owner: true
}