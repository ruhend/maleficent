exports.default = {
   tags: 'group',
   help: ['delete', 'del', 'hapus'],
   command: ['delete', 'del', 'hapus'],
   start: async (m) => {
      if (!m.quoted) return m.reply('❌ Reply pesan yang mau dihapus dulu.');
      await m.quoted.delete()
   },
   premium: true
}