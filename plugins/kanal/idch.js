exports.default = {
   tags: 'kanal',
   help: ['idch', 'idchanel', 'idchannel', 'channelid', 'chanelid'],
   command: ['idch', 'idchanel', 'idchannel', 'channelid', 'chanelid'],
   start: async (m, { 
      sock,
      args
   }) => {
      const raw = args.join(' ') || m.quoted?.text || '';
      const { invite } = (0, socket.parseChannelTarget)(raw);
      if (!invite) {
         return m.reply(
            `Kirim link channel yang valid!\n\nContoh:\n> \`${m.prefix}${m.command} <url chanel>\`\n\natau reply pesan berisi link channel lalu ketik:\n> \`${m.prefix}${m.command}\``
         );
      }
      let metadata;
      try {
         metadata = await sock.newsletter.fetchByInvite(invite);
      } catch {
         return m.reply(
            'Link channel tidak valid, kadaluarsa, atau channel sudah tidak ada.'
         );
      }
      await m.reply({
         interactiveMessage: {
            header: {
               title: '📍 Info Channel ID',
               hasMediaAttachment: false
            },
            body: {
               text: `📌 *ID Channel:*\n\`\`\`${metadata.jid}\`\`\``
            },
            footer: {
               text: 'Gunakan tombol di bawah untuk menyalin ID'
            },
            nativeFlowMessage: {
               buttons: [
                  {
                     name: 'cta_copy',
                     buttonParamsJson: JSON.stringify({
                        display_text: '📋 Salin ID Channel',
                        copy_code: metadata.jid
                     })
                  }
               ],
               messageVersion: 1
            },
            contextInfo: (0, socket.buildQuoteContext)(m)
         }
      });
   }
}