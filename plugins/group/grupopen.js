exports.default = {
   tags: 'group',
   help: ['grupopen', 'groupopen', 'opengrup', 'opengroup'],
   command: ['grupopen', 'groupopen', 'opengrup', 'opengroup'],
   start: async (m, { 
      sock
   }) => {
      await sock.group.setSetting(m.chat, 'announcement', false);
      return m.reply('🔓 Grup dibuka, semua member bisa kirim pesan.');
   },
   group: true,
   admin: true,
   botAdmin: true
}