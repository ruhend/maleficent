exports.default = {
   tags: 'tools',
   help: ['tourl', 'upload'],
   command: ['tourl', 'upload'],
   start: async (m, { 
      conn,
      prefix,
      command
   }) => {
      if (/image|video|audio|webp/.test(m.quoted ? m.quoted.mtype : m.mtype)) {
         const result = await Scraper.uploadMoe(await conn.getFile(m?.quoted?.content ?? m.content));
         m.react('🕒')
         await conn.reply(m.chat, `Upload Berhasil √ \n${result}`, m)
      } else {
         return m.reply(`Balas Media Atau Kirim Media Dengan Caption ${prefix+command}`);
      }
   },
   limit: 2
}

/*function resolveMediaTarget(m, sock) {
   if (m.quoted?.isMedia) {
      return {
         mime: m.quoted.mtype,
         download: async () => await m.quoted.download()
      };
   }
   if (m.isMedia) {     
      return {
         mime: m.mtype || '',
         download: async () => await m.download()
      };
   }
   return null;
}
exports.default = {
   tags: 'tools',
   help: ['up', 'upload'],
   command: ['up', 'upload'],
   start: async (m, { 
      sock
   }) => {
      const target = resolveMediaTarget(m, sock);
      if (!target)
         return m.reply('❌ Reply media atau kirim media dengan caption dulu!');
      let buffer;
      try {
         m.react('🕒')
         buffer = await target.download();
      } catch (err) {
         return m.reply(
            `❌ Gagal download media: ${err?.message || 'file tidak tersedia.'}`
         );
      }
      if (!buffer?.length)
         return m.reply('❌ Gagal download media atau file kosong.');
      const ext =
         (target.mime || 'application/octet-stream').split('/')[1] || 'bin';
      const fileName = `file_${Date.now()}.${ext}`;
      const formData = new FormData();
      formData.append('file', new Blob([buffer]), fileName);
      const start = performance.now();
      let res;
      try {
         res = await fetch('https://tmpfile.link/api/upload', {
            method: 'POST',
            body: formData
         });
      } catch (err) {
         return m.reply(`❌ Gagal konek ke server upload: ${err.message}`);
      }
      const durationSec = ((performance.now() - start) / 1000).toFixed(2);
      if (!res.ok) return m.reply(`❌ Upload gagal (${res.status})`);
      let data;
      try {
         data = await res.json();
      } catch {
         return m.reply('❌ Respons server upload tidak valid.');
      }
      const url = data.downloadLink;
      if (!url) return m.reply('❌ Upload gagal, tidak ada link.');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const expiresStr = expiresAt.toLocaleString('id-ID', {
         day: '2-digit',
         month: 'short',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
         hour12: false
      });
      await m.reply({
         interactiveMessage: {
            header: {
               title: '✅ Upload Berhasil',
               hasMediaAttachment: false
            },
            body: {
               text: `⏳ Waktu: ${durationSec}s\n📦 Ukuran: ${(data.size / 1024).toFixed(1)} KB`
            },
            footer: {
               text: `Kadaluarsa pada ${expiresStr}`
            },
            nativeFlowMessage: {
               buttons: [
                  {
                     name: 'cta_copy',
                     buttonParamsJson: JSON.stringify({
                        display_text: '📋 Salin Link',
                        copy_code: url
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
*/