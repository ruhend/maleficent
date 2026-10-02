exports.default = {
   tags: 'main',
   help: ['script', 'sc', 'repo'],
   command: ['script', 'sc', 'repo'],
   start: async (m) => {
      const script = 'Menggunakan Base Script Ini \n\nhttps://github.com/ruhend/maleficent\n\nhttps://github.com/ruhend/kumpulan-lagu/archive/refs/heads/main.zip'
      m.reply(script)
   }
}