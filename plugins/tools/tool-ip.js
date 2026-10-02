exports.default = {
   tags: 'tools',
   help: ['ip', 'myip'],
   command: ['ip', 'myip'],
   start: async (m) => {
      m.reply(await Utils.ipAddress())
   },
   owner: true
}