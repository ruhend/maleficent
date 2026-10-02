exports.default = {
   tags: 'group',
   help: ['grupclose', 'groupclose', 'closegrup', 'closegroup'],
   command: ['grupclose', 'groupclose', 'closegrup', 'closegroup'],
   start: async (m, { 
      sock 
   }) => {
      await sock.group.setSetting(m.chat, 'announcement', true);
      return m.reply('🔒 Grup ditutup, cuma admin yang bisa kirim pesan.');
   },
   group: true,
   admin: true,
   botAdmin: true   
}