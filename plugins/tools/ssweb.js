exports.default = {
   tags: 'tools',
   help: ['ssweb', 'screenshootweb'],
   command: ['ssweb', 'screenshootweb'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply('Masukan link atau url yang mau di screenshot webnya\ncontoh: ' + prefix + command + ' ' + setting.link);
      m.react('🕒')
      await conn.sendFile(m.chat, await toBuffer('https://image.thum.io/get/width/1900/crop/1000/fullpage/' + text), text, m);         
   },
   limit: 2
}