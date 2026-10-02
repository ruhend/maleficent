exports.default = {
   tags: 'ai',
   help: ['ai', 'gpt', 'chatgpt', 'openai'],
   command: ['ai', 'gpt', 'chatgpt', 'openai'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`contoh ${prefix + command} apa kabar?`)
      m.react('🕐')
      const data = await Scraper.gpt(text)
      await conn.reply(m.chat, data, m)
   },
   limit: 1
}