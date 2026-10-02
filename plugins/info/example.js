exports.default = {
   tags: 'info',
   help: ['list', 'button'],
   command: ['list', 'button'],
   start: async (m, {
      conn
   }) => {
      conn.sendList(m.chat, 'Example List', cover, m, [// cover with photo or null just list
         'Runtime', '.runtime',
         'Owner', '.owner',
         'Menu', '.menu'
      ], { 
         footer: setting.botName
      })
      
      conn.sendButton(m.chat, 'Example Button', cover, m, [// cover with photo or null just list
         'Runtime', '.runtime',
         'Owner', '.owner',
         'Menu', '.menu'
      ], { 
         footer: setting.botName
      })
   }
}