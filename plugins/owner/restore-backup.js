const { backupMongo, restoreMongo } = require('../../lib/src/cloud/mongo-db.js');
const { backupGithub, restoreGithub } = require('../../lib/src/cloud/github-db.js');
const { backupGitlab, restoreGitlab } = require('../../lib/src/cloud/gitlab-db.js');
const { backupSupabase, restoreSupabase } = require('../../lib/src/cloud/supabase-db.js');
exports.default = {
   tags: ['owner'],
   help: ['backup', 'restore', 'backupall'],
   command: ['backup', 'restore', 'backupall'],
   start: async (m, {
      conn,
      text,
      prefix,
      command,
   }) => {
      if (!text && !(/backupall/.test(command))) {
         const backup = `masukan cloud penyimpanan database nya\ncontoh: ${prefix + command} mongo\n\nterdapat 4 penyimpanan database cloud:\n\nmongo\ngithub\ngitlab\nsupabase\n\npilih salah satunya saja yang mau kamu ${command}\n\n`;
         const restore =  `(optional) jika ingin backup semua ke tempat cloud database yang sudah kamu daftar ketik .backupall`;      
         return (/backup/g.test(command)) ? m.reply(backup + restore) : m.reply(backup.trim());
      };
      if (!['github', 'mongo', 'gitlab', 'supabase'].includes(text) && !(/backupall/.test(command))) {
         const backup = 'hanya ada yang tersedia: \n\nmongo\ngithub\ngitlab\nsupabase\n\n';
         const restore = '(optional) jika ingin backup semua ke tempat cloud database yang sudah kamu daftar ketik .backupall'
         return (/backup/g.test(command)) ? m.reply(backup + restore) : m.reply(backup.trim());
      };
      if (command == 'backup' && text == 'mongo') {
         m.reply('Tunggu sedang backup monggo...');
         const response = await backupMongo();
         return m.reply(obj(response))
      } else if (command == 'restore' && text == 'mongo') {
         m.reply('Tunggu sedang restore monggo...');
         const response = await restoreMongo();
         return m.reply(obj(response));
      } else if (command == 'backup' && text == 'github') {
         m.reply('Tunggu sedang backup to gitHub...');
         const response = await backupGithub();
         if (!response.status) return await m.reply('Gagal Backup Database'), m.reply(obj(response));
         return await m.reply(obj(response));
      } else if (command == 'restore' && text == 'github') {
         m.reply('Tunggu sedang restore from github...');
         const response = await restoreGithub();
         if (!response.status) return await m.reply('Gagal Restore Database'), m.reply(obj(response));         
         if (response.status) return await m.reply(obj(response))
      } else if (command == 'backup' && text == 'gitlab') {
         m.reply('Tunggu sedang backup to gitlab...');
         const response = await backupGitlab();
         if (!response.status) return await m.reply('Gagal Backup Database'), m.reply(obj(response));
         return await m.reply(obj(response))
      } else if (command == 'restore' && text == 'gitlab') {
         m.reply('Tunggu sedang restore from gitlab...');
         const response = await restoreGitlab();
         if (!response.status) return await m.reply('Gagal Restore Database'), m.reply(obj(response));         
         if (response.status) return await m.reply(obj(response))
      } else if (command == 'backup' && text == 'supabase') {
         m.reply('Tunggu sedang backup to supabase...');
         const response = await backupSupabase();
         if (!response.status) return await m.reply('Gagal Backup Database'), m.reply(obj(response));
         return await m.reply(obj(response))
      } else if (command == 'restore' && text == 'supabase') {
         m.reply('Tunggu sedang restore from supabase...');
         const response = await restoreSupabase();
         if (!response.status) return await m.reply('Gagal Restore Database'), m.reply(obj(response));         
         if (response.status) return await m.reply(obj(response))
      }
      if (/backupall/.test(command)) {
         const order = ['mongo', 'github', 'gitlab', 'supabase'];
         if (!text) return m.reply('masukan main / yang utama tempat backup andalan kamu terlebih dahulu\ncontoh: .backupall mongo');
         if (!order.includes(text)) return m.reply('main / yang utama harus salah satu dari: mongo, github, gitlab, supabase');
         const list = [text, ...order.filter(x => x !== text)];
         m.reply(`Memulai backup semua...`);
         await Utils.backupAllDB(m, list, backupMongo, backupGithub, backupGitlab, backupSupabase);
         return m.reply('Backup semua selesai ✅');
      }
   },
   owner: true
}