exports.default = {
   tags: 'tools',
   help: ['q', 'quoted'],
   command: ['q', 'quoted'],
   start: async (m, { 
      sock
   }) => {
      if (!m.quoted) return m.reply('Reply pesan yang mengandung quoted (misal pesan "y" yang tadinya reply video)')
      const cached = global.store.getMessage(m.quoted.key.id)
      if (!cached) return m.reply('Pesan itu gak ke-cache atau udah kelewat.')
      const cachedMessage = cached.message      
      const type = Object.keys(cachedMessage).find(k => k === 'conversation' || k.includes('Message'))
      const content = cachedMessage[type]
      const nested = content?.contextInfo?.quotedMessage
      if (!nested) return m.reply('Pesan itu gak nge-quote apa-apa.')
      const nestedType = Object.keys(nested)[0]
      const nestedContent = nested[nestedType]            
      if (nestedType === 'conversation' || nestedType === 'extendedTextMessage') {
         return typeof nestedContent === 'string' ? m.reply(nestedContent) : sock.message.send(m.chat, nested, { quote: m })
      }
      return sock.message.send(m.chat, { [nestedType]: nestedContent }, { quote: m })
   }
}