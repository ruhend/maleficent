const { runUserCode } = socket
exports.default = {
   tags: 'owner',
   help: ['>', 'eval', 'ev', '=>', '!!'],
   command: ['>', 'eval', 'ev', '=>', '!!'],
   start: async (m, { 
      conn, 
      sock 
   }) => {
      const code = m.text.slice(m.prefix.length + m.command.length).trim();
      if (!code) return m.reply('*Masukkan kode setelah prefix eval!*');
      try {
         m.react('🗿')
         return m.reply(await (0, runUserCode)(code, m, sock, conn));
      } catch (err) {
         return m.reply(`❌ Kode gagal dijalankan: ${err?.message || err}`);
      }
   },
   owner: true
}