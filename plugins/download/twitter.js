exports.default = {
   tags: 'download',
   help: ['twitter', 'x'],
   command: ['twitter', 'x'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`contoh ${prefix+command} https://twitter.com/gofoodindonesia/status/1229369819511709697`);
      await conn.adReply(m.chat, wait, cover, m);
      const data = await Scraper.twitter(text);
      await conn.sendFile(m.chat, data?.url?.hd ?? data?.url?.sd, data?.title ?? '', m)           
   },
   limit: 2
}