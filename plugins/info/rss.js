exports.default = {
   tags: 'info',
   help: ['memory', 'mem', 'ram', 'rss'],
   command: ['memory', 'mem', 'ram', 'rss'],
   start: async (m) => {
      const mem = process.memoryUsage();
      const lines = Object.entries(mem)
         .map(([key, value]) => `◦ *${key}:* ${(0, socket.formatBytes)(value)}`)
         .join('\n');
      await m.reply(`*── 「 MEMORY USAGE 」 ──*\n\n${lines}`);
   }
}
