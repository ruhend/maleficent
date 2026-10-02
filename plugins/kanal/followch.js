exports.default = {
   tags: 'kanal',
   help: ['followch', 'followchanel', 'followchannel', 'fch'],
   command: ['followch', 'followchanel', 'followchannel', 'fch'],
   start: async (m, { 
      sock,
      args
   }) => {
      const raw = args.join(' ') || m.quoted?.text || '';
      const { invite, jid: parsedJid } = (0, socket.parseChannelTarget)(raw);
      if (!invite && !parsedJid) {
         return m.reply(
            `Kirim link atau JID channel yang valid!\n\nContoh:\n> \`${m.prefix}${m.command} <url chanel>\`\n> \`${m.prefix}${m.command} <jid chanel>\`\n\natau reply pesan berisi link channel lalu ketik:\n> \`${m.prefix}${m.command}\``
         );
      }
      let jid = parsedJid;
      let name = null;
      try {
         if (!jid) {
            const metadata = await sock.newsletter.fetchByInvite(invite);
            jid = metadata.jid;
            name = metadata.name;
         }
         await sock.newsletter.follow(jid);
      } catch {
         return m.reply(
            'Gagal follow channel, link/JID tidak valid atau channel tidak ditemukan.'
         );
      }
      await m.reply(
         `✅ Berhasil follow channel${name ? `:\n*${name}*` : ''}\n\`\`\`${jid}\`\`\``
      );
   },
   owner: true
}
