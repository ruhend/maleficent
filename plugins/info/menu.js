exports.default = {
   tags: 'info',
   help: ['menu', 'help', 'command'],
   command: ['menu', 'help', 'command', 'm', 'msni'],
   start: async (m, {
      conn,
      args,
      prefix,
      command
   }) => {
      m.react('⏳')
      const up = '┌─────────⭓'
      const side = '│⭓'
      const down = '└─────────⭓'
      const { Upload, Download } = await Utils.statistic()
      const menu = await Utils.Menu(prefix, command, args[0], up, side, down)
      let info = `*Menu ${setting.botName}*\nSimple WhatsApp Bot\nBy ${setting.footer}\n\n`;
      info += `👋 Selamat ${waktu.suasana.charAt(0).toUpperCase() + waktu.suasana.slice(1)} Bangsat\n@${m.sender.split('@')[0]} 🐽\n\n`;
      info += `Total Penggunaan Perintah‎\nBot Kamu: ${db.users[m.sender].hitCmd} Kali\n\n`;
      info += `Owner: +${setting.owner[0]}\n\n`;
      info += `Network Bot Usage :\n📥 Download: ${Download}\n📤 Upload: ${Upload}\n\n`;
      info += `${global.logo_limit} = Limit \n${global.logo_premium} = Premium`
      const result = `${info}\n\n${menu}`;
      await conn.adReply(m.chat, result, cover, m)
      conn.sendFile(m.chat, 'https://files.catbox.moe/h3nmj8.mp3', '', m, { ptt: true })
   }
}