exports.default = {
   tags: 'owner',
   help: ['resetlimit'],
   command: ['resetlimit'],
   start: async (m, {
      conn,
      args,
      prefix,
      command
   }) => {
      if (!args[0]) return m.reply(`Masukan Nilai Limit Yang Ingin Di Reset Ke Semua Pengguna\ncontoh ${prefix + command} 25`)
      let list = Object.entries(db.users)
      let isNumber = (x = 0) => {
         x = parseInt(x)
         return !isNaN(x) && typeof x == 'number'
      }
      let lim = !args || !args[0] ? 5 : isNumber(args[0]) ? parseInt(args[0]) : 5
      lim = Math.max(1, lim)
      list.map(([user, data], i) => (Number(data.limit = lim)))
      let caption = `Berhasil Mereset Limit\n${args[0]} Per User`
      conn.adReply(m.chat, caption, cover, m)
   },
   owner: true
}