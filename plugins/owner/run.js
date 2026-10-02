const { unUserCode } = socket
const LOOKS_LIKE_TEXT =
   /^(text\/|application\/(javascript|json|x-javascript|typescript))/i;
async function getCodeFromQuoted(m) {
   const q = m.quoted;
   if (!q)
      return {
         error: 'Reply pesan atau file yang mau di-run dulu ya kak.'
      };
   if (q.mediaType === 'document' || q.type === 'documentMessage') {
      const mime = q.mime || '';
      if (mime && !LOOKS_LIKE_TEXT.test(mime)) {
         console.warn(
            `[RUN] mimetype "${mime}" gak biasa buat code, tetap dicoba dibaca sebagai teks.`
         );
      }
      let bytes;
      try {
         bytes = await q.download();
      } catch (err) {
         return {
            error: `Gagal download document: ${err?.message || err}`
         };
      }
      const text = Buffer.from(bytes).toString('utf8');
      if (!text.trim())
         return {
            error: 'File yang di-reply kosong setelah di-download.'
         };
      return {
         code: text
      };
   }
   if (q.isMedia) {
      return {
         error: `Tipe media \`${q.mediaType}\` gak didukung buat di-run. Reply teks atau file document aja.`
      };
   }
   const text = q.text;
   if (!text || !text.trim())
      return {
         error: 'Pesan yang di-reply gak ada teks/code-nya.'
      };
   return {
      code: text
   };
}
exports.default = {
   tags: 'owner',
   help: ['run', 'runcode', 'runfile', 'execfile'],
   command: ['run', 'runcode', 'runfile', 'execfile'],
   start: async (m, { 
      sock 
   }) => {
      const { code, error } = await getCodeFromQuoted(m);
      if (error) return m.reply(`❌ ${error}`);
      if (!code.trim()) return m.reply('❌ Code kosong.');
      if (!sock?.message)
         return m.reply('❌ sock.message belum siap. Coba lagi sebentar.');
      try {
         return m.reply(await (0, runUserCode)(code, m, sock));
      } catch (err) {
         return m.reply(`❌ Kode gagal dijalankan: ${err?.message || err}`);
      }
   },
   owner: true
};
