exports.default = {
   tags: 'group',
   help: ['kick', 'kickuser', '-', 'dor', 'kickal'],
   command: ['kick', 'kickuser', '-', 'dor', 'kickall'],
   start: async (m, {
      sock,
      conn,
      args,
      command
   }) => {
      if (command !== 'kickall') return (0, socket.executeParticipantAction)(
         m,
         {
            sock,
            args
         },
         {
            method: 'removeParticipants',
            action: 'remove',
            successTitle: '✅ *Berhasil dikick:*',
            failureTitle: '❌ *Gagal:*',
            args
         }
      )

      const admin = m.participants.filter(v => v.isAdmin).map(v => v.phoneNumber)
      const owner = setting.owner.map(v => v + '@s.whatsapp.net')
      const me = [conn.decodeJid(conn.getCredentials().meJid)]
      const except = [...admin, ...owner, ...me]

      const kick = m.participants
         .filter(v => !except.includes(v.phoneNumber))
         .map(v => v.phoneNumber)

      if (!kick.length) return m.reply('Tidak ada member yang bisa dikick.')

      await conn.group.removeParticipants(m.chat, kick)
      m.reply(`Berhasil kick ${kick.length} member.`)
   },
   group: true,
   botAdmin: true,
   admin: true
}