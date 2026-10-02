const axios = require('axios');
const https = require('https');
const perf_hooks = require('perf_hooks');
const GITHUB_URL_REGEX =
   /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9][\w-]{0,38})\/([a-zA-Z0-9._-]{1,100})(?:\.git)?/i;
const REPO_SHORTHAND_REGEX =
   /(?:^|\s)([a-zA-Z0-9][\w-]{0,38})\/([a-zA-Z0-9._-]{1,100})(?:\s|$)/i;
const keepAliveAgent = new https.Agent({
   keepAlive: true,
   maxSockets: 20
});
function extractRepo(raw) {
   if (!raw) return null;
   const text = raw.trim();
   const fromUrl = text.match(GITHUB_URL_REGEX);
   if (fromUrl)
      return {
         user: fromUrl[1],
         repo: fromUrl[2].replace(/\.git$/i, '')
      };
   const fromShorthand = text.match(REPO_SHORTHAND_REGEX);
   if (fromShorthand)
      return {
         user: fromShorthand[1],
         repo: fromShorthand[2].replace(/\.git$/i, '')
      };
   return null;
}
exports.default = {
   tags: 'tools',
   help: ['gitclone', 'git', 'clonegit'],
   command: ['gitclone', 'git', 'clonegit'],
   start: async (m, { 
      sock, 
      args 
   }) => {
      const typed = args.join(' ');
      const input = typed || m.quoted?.text || '';
      if (!input.trim()) {
         return m.reply(
            `Masukkan repo GitHub yang valid!\n` +
               `Contoh:\n` +
               `• ${m.prefix}${m.command} ruhend/maleficent\n` +
               `• ${m.prefix}${m.command} github.com/ruhend/maleficent\n` +
               `• reply pesan berisi link GitHub lalu ketik ${m.prefix}${m.command}`
         );
      }
      const target = extractRepo(input);
      if (!target)
         return m.reply(
            '❌ Tidak menemukan format `user/repo` atau link GitHub yang valid.'
         );
      const { user, repo } = target;
      const zipUrl = `https://api.github.com/repos/${user}/${repo}/zipball`;
      const repoUrl = `https://github.com/${user}/${repo}`;
      const t0 = perf_hooks.performance.now();
      try {
         m.react('🕒')
         const response = await axios.get(zipUrl, {
            headers: {
               'User-Agent': 'Mozilla/5.0',
               Accept: 'application/vnd.github+json',
               'Accept-Encoding': 'gzip, deflate, br'
            },
            httpsAgent: keepAliveAgent,
            responseType: 'stream',
            timeout: 60000,
            maxRedirects: 10,
            decompress: true
         });
         const sizeHeader = Number(response.headers['content-length']) || null;
         const caption =
            `📦 *Repo:* ${user}/${repo}\n` +
            `🔗 *Link:* ${repoUrl}` +
            (sizeHeader
               ? `\n📄 *Ukuran:* ${(0, socket.formatBytes)(sizeHeader)}`
               : '');
         await sock.message.send(
            m.chat,
            {
               type: 'document',
               media: response.data,
               mimetype: 'application/zip',
               fileName: `${repo}.zip`,
               caption
            },
            {
               quote: m.raw
            }
         );
         const duration = ((perf_hooks.performance.now() - t0) / 1000).toFixed(
            2
         );
         console.log(`[GITCLONE] ${user}/${repo} selesai dalam ${duration}s`);
      } catch (err) {
         const status = err.response?.status;
         const errMsg =
            status === 404
               ? `❌ Repo *${user}/${repo}* tidak ditemukan atau bersifat private.`
               : `❌ Gagal mengunduh repo!\n*Status:* ${status || 'Error'}\n*Pesan:* ${err.message}`;
         console.error(`[GITCLONE] Error ${user}/${repo}:`, err.message);
         return m.reply(errMsg);
      }
   },
   limit: 2
}