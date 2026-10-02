exports.default = {
   start: async (m, {
      conn
   }) => {
      if (((!m.isGroup && db.users[m.sender]?.chat_ai) || (m.isGroup && db.chats[m.chat]?.chat_ai)) && m?.text && !m.isBot) {
         const evaluate = ['module', 'exports', ...setting.evaluate, ...setting.prefix];
         const rejected = evaluate?.some(v => m.text?.startsWith(v));
         if (!rejected) {
            try {
               const data = await fetchJSON(`https://api.azbry.com/api/ai/aiko?q=${m.text}`);
               await conn.reply(m.chat, data.response.replace(/(Saya Aiko!|"Aiko"|Aiko|[*])/g, '').trim(), m);
            } catch (e) {
               console.error(e)
            }
         }
      }
   }
}