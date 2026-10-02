exports.default = {
   tags: 'owner',
   help: ['createplugin', 'exampleplugin', 'cp', 'ep'],
   command: ['createplugin', 'exampleplugin', 'cp', 'ep'],
   start: async (m, { 
      conn, 
      text,
      prefix,
      command 
   }) => {
      if (!text) throw `untuk example plugin event ketik contoh: ${prefix+command} event\natau untuk example plugin command ketik\n${prefix+command} command`
      if (/event/.test(text)) {
         throw `
exports.default = {
   start: async (m, {
      conn
   }) => {
   
   }
}`.trim()
      } else if (/command/.test(text)) {
         throw `
exports.default = {
   tags: 'nama kategori',
   help: ['nama untuk di menu'],
   command: ['nama command nya'],
   start: async (m, { 
      conn, 
      text,
      prefix,
      command 
   }) => {
   
   }
}`.trim()
      } else {
         throw 'hanya event atau command saja!'
      }
   }
}