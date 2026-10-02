exports.default = {
   start: async (m, { 
      sock, 
      conn
   }) => {
      const proto = m.raw?.message?.protocolMessage
      if (m.type !== 'protocolMessage' || proto?.type !== 0) return

      const deletedId = proto.key?.id
      if (!deletedId) return
      const cached = global.store.getMessage(deletedId)
      if (!cached) return

      const pelaku = proto.key.participant || m.sender
      const key = await m.reply(`kamu @${pelaku.split('@')[0]}\nmenghapus pesan di bawah ini`)
      key.sender = m.sender
      const type = Object.keys(cached.message).find(k => k === 'conversation' || k.includes('Message'))
      const content = cached.message[type]

      if (type === 'conversation' || type === 'extendedTextMessage') {
         conn.reply(m.chat, content.text, key)
      } else {
         await sock.message.send(m.chat, { [type]: content }, { quote: key })
      }
      store.messages.delete(deletedId)
   }
}