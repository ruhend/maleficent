// nambahin command atau fitur lain disini 
const path = require('path');
const fs = require('fs');
const os = require('os');
const fetch = require('node-fetch');
const axios = require('axios');
const cheerio = require('cheerio');
const ms = require('ms');
const assert = require('assert');
const syntaxError = require('syntax-error');
const search = require('yt-search');
const {
   ttdl,
   igdl,
   fbdl
} = require('ruhend-scraper');
const {
   download
} = require('./lib/src/apk/apk.js');
const {
   exec
} = require('child_process');
const {
   format
} = require('util');
const TicTacToe = require('./lib/tictactoe.js');
const {
   ttp
} = require('./lib/src/scraper/ttp.js');
const tts = require('./lib/src/tts/index.js');
const translate = require('./lib/src/translate/translate.js');
const {
   Image
} = require('node-webpmux');
const host = 'https://translate.google.com';
const {
   backupMongo,
   restoreMongo
} = require('./lib/src/cloud/mongo-db.js');
const {
   backupGithub,
   restoreGithub
} = require('./lib/src/cloud/github-db.js');
const {
   backupGitlab,
   restoreGitlab
} = require('./lib/src/cloud/gitlab-db.js');
const {
   backupSupabase,
   restoreSupabase
} = require('./lib/src/cloud/supabase-db.js');
let running = false
const clockString = (ms) => {
   const d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
   const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
   const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
   const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
   return [`*${d} Hari*`, `*${h} Jam*`, `*${m} Menit*`, `*${s} Detik*`].map(v => v.toString().padStart(2, 0)).join(': ')
};
const modes = {
   noob: [-3, 3, -3, 3, '+-', 15000, 10],
   easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
   medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
   hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
   extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 9999],
   impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000],
   impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 50000]
};
global.is_time = () => {
   const jam = moment.tz('asia/jakarta').format('HH:mm:ss');
   const tanggal = moment().tz("Asia/Jakarta").format("ll");
   const suasana = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a');
   const time = moment(new Date()).format("HH:mm");
   global.waktu = {
      tanggal,
      jam,
      suasana,
      time
   };
}
const operators = {
   '+': '+',
   '-': '-',
   '*': '×',
   '/': '÷'
};

function randomInt(from, to) {
   if (from > to)[from, to] = [to, from]
   from = Math.floor(from)
   to = Math.floor(to)
   return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
   return list[Math.floor(Math.random() * list.length)]
}

function genMath(mode) {
   return new Promise((resolve, reject) => {
      let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
      let a = randomInt(a1, a2)
      let b = randomInt(b1, b2)
      let op = pickRandom([...ops])
      let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))()
      if (op == '/')[a, result] = [result, a]
      let hasil = {
         soal: `${a} ${operators[op]} ${b}`,
         mode: mode,
         waktu: time,
         jawaban: result
      }
      resolve(hasil)
   })
}
function getCmd(body, prefix) {
   const clean = (body || '').trim();
   if (!clean) return false;
   if (db.settings.prefix === 'single') {
      if (!prefix) return false;
      const word = clean.slice(prefix.length).trim().split(/\s+/)[0] || '';
      return word ? word.toLowerCase() : false;
   } else {
      const raw = prefix ? clean.slice(prefix.length) : clean;
      const word = raw.trim().split(/\s+/)[0] || '';
      return word ? word.toLowerCase() : false;
   }
}
const usedCommandRecently = new Set();
const isFiltered = (from) => {
   return !!usedCommandRecently.has(from)
};
const addFilter = (from) => {
   usedCommandRecently.add(from)
   setTimeout(() => {
      return usedCommandRecently.delete(from)
   }, 3000); // Delay Spam Every 3 Second
};
const addSpam = (sender, _db) => {
   let position = false
   Object.keys(_db).forEach((i) => {
      if (_db[i].id === sender) {
         position = i
      }
   })
   if (position !== false) {
      _db[position].spam += 1
   } else {
      const bulin = ({
         id: sender,
         spam: 1,
         expired: Date.now() + ms('10m')
      })
      _db.push(bulin)
   }
};
const resetspam = (_dir) => {
   setInterval(() => {
      let position = null
      Object.keys(_dir).forEach((i) => {
         if (Date.now() >= _dir[i].expired) {
            position = i
         }
      })
      if (position !== null) {
         // console.log(`Spam expired: ${_dir[position].id}`)
         _dir.splice(position, 1)
      }
   }, 1000)
};
const isSpam = (sender, _db) => {
   let found = false
   for (let i of _db) {
      if (i.id === sender) {
         let spam = i.spam
         if (spam >= 6) {
            found = true
            return true
         } else {
            found = true
            return false
         }
      }
   }
}
const toxic = ['kontol', 'anj', 'kntl', 'anjing', 'bngst', 'bgst', 'bangsat', 'memek', 'mmk', 'njir', 'najis', 'anjir', 'jing', 'njing', 'kntl', 'kontol', 'babi', 'monyet', 'mnyt', 'jembut', 'jmbt', 'lol', 'tolol'];
exports.handler = async (m, conn, store) => {
   try {
      const body = typeof m.text == 'string' ? m.body : m.text
      const args = body?.trim().split(/ +/).slice(1);
      const text = args?.join(' ');
      const prefix = isPrefix.find(p => body.startsWith(p)) || ''
      const command = getCmd(body, prefix) || db.settings.prefix == 'multi' ? body.split(' ')[0].replace(prefix, '') : body.split(' ')[0].slice(1).replace(prefix, '')
      const pname = (m.pushName === undefined || m.pushName == null || typeof m.pushName !== 'string') ? 'unknownName' : m.pushName
      const pushname = m.isBaileys && m.key.fromMe ? m.isBaileys ? setting.botName : pname : m.isGroup ? pname : m.key.remoteJid == 'status@broadcast' ? pname : m.sender.split('@')[0];
      const botNumber = conn.decodeJid(conn.user.id);
      const isMe = botNumber.split('@')[0];
      const mebot = m.isLid ? m.jid(m.sender)?.split('@')[0] : isMe
      const isOwner = m.isLid ? (setting.ownerNumber.includes(mebot) || [...setting.ownerNumber, isMe].map(num => `${num}@s.whatsapp.net`.replace(/[+-\s]/g, '')).includes(m.sender)) : [...setting.ownerNumber, isMe].map(num => `${num}@s.whatsapp.net`.replace(/[+-\s]/g, '')).includes(m.sender)
      const quoted = m?.quoted ? m.quoted : m;
      const mime = m.quoted ? (m?.quoted?.mimetype || m?.quoted?.mtype) : m.mtype;
      const groupMetadata = m.isGroup ? await conn.cacheGroupMetadata(m.chat) : {};
      const groupId = m.isGroup ? groupMetadata?.id : '';
      const groupName = m.isGroup ? groupMetadata?.subject : '';
      const groupDesc = m.isGroup ? groupMetadata?.desc : '';
      const participants = m.isGroup ? groupMetadata?.participants : '';
      const groupAdmins = await conn.getAdmins(m, groupMetadata, participants);
      const groupOwner = m.isGroup ? groupMetadata?.owner : '';
      const isBotAdmins = m.isGroup ? groupAdmins?.includes(m.isLid ? m.jid(botNumber) : botNumber) : false;
      const isAdmins = m.isGroup ? groupAdmins?.includes(m.sender) : false;
      const users = global.db?.users[m.sender] ? global.db?.users[m.sender] : global.db.users[m.sender] = {};
      if (Object.keys(users).length < 1) {
         global.db.users[m.sender] = {
            name: pushname,
            registered: false,
            registeredTime: '',
            umur: '',
            seri: '',
            premium: false,
            premiumTime: '',
            banned: false,
            bannedReason: '',
            limit: isOwner ? 1000 : 15,
            kupon: 5,
            uang: 1000,
            hitCmd: 0,
            notes: '',
            lastClaim: '',
            lastHour: '',
            lastUang: '',
            lastKupon: '',
            lastSpin: '',
            spin: 10,
            is_spin: false,
            afkTime: -1,
            afkReason: '',
            chat_ai: false
         }
      };
      const groups = global.db.chats[groupId] ? global.db.chats[groupId] : global.db.chats[groupId] = {};
      if (Object.keys(groups).length < 1) {
         global.db.chats[groupId] = {
            name: groupName,
            welcome: true,
            antilink: true,
            mute: false,
            absen: false,
            absen_count: 0,
            absen_user: [],
            absen_text: '',
            viewOnce: true,
            antiToxic: true,
            antiPhoto: false,
            antiBot: false,
            chat_ai: false,
            tagsw: true,
            description: groupDesc == undefined ? '' : groupDesc,
            welcomeCaption: global.group_welcome || '',
            byeCaption: global.group_bye || ''
         }
      };
      if (!('community' in global.db.chats)) global.db.chats.community = {};
      if (global.db.chats['']) delete global.db.chats[''];
      const settings = global.db.settings ? global.db.settings : global.db.settings = {};
      if (Object.keys(settings).length < 1) {
         global.db.settings = {
            menu_type: 2,
            prefix: 'multi',
            cover: setting.thumbnail,
            custom_tags: [],
            readsw: true,
            reactsw: true,
            antispam: true,
            block_pc: false,
            auto_down: false,
            auto_sticker: false,
            auto_clear_chat: false
         }
      };
      global.cover = db.settings.cover;
      if (!('menfess' in global.db)) global.db.menfess = {}
      if (!('stores' in global.db)) global.db.stores = {}
      const isPremium = db.users[m.sender].premium || isOwner;
      const owner = setting.ownerNumber.map(num => `${num}@s.whatsapp.net`).concat(setting.ownerNumber.map(num => `${num}@lid`));
      const number = conn.decodeNum(m.sender).replace('s.whatsapp.net', '').replace('lid', '');
      const num = m.isLid ? m.fromMe ? botNumber : number + '@s.whatsapp.net' : number + '@s.whatsapp.net';
      if (db.settings.block_pc && !m.fromMe && !owner.includes(m.sender) && m.chat !== 'status@broadcast' && !m.isGroup && !isPremium && !isOwner) {
         console.log(`Private => ${m.sender.split('@')[0]}\n`, body);
         console.log(`${m.sender.split('@')[0]} Blocked From Private Chat`)
         return conn.updateBlockStatus(m.sender, 'block');
      };
      if ((db.users[num]?.banned) && !m.isBaileys && !m.fromMe) {
         if (command && prefix !== '') {
            console.log(`${m.isGroup ? `${groupName} => ${m.chat.split('@')[0]}\n` : m.sender.split("@")[0]}\n`, body);
            return m.reply(mess.banned + `${db.users[num].bannedReason}`);
         } else {
            console.log(m.isGroup ? `${groupName} => ${m.chat}` : `${m.sender.split("@")[0]}`);
            console.log(m.isGroup ? `${m?.pushName} - ${m.sender.split("@")[0]}` : `${m.sender.split("@")[0]}`)
            console.log(body)
            return console.log(mess.banned.replace(/\*/g, ''), `${db.users[num].bannedReason}`);
         }
      };
      const orang_spam = [];
      const antispam = db.settings.antispam;
      resetspam(orang_spam);
      if (antispam && command && isFiltered(m.sender) && !m.isBaileys && !(prefix === undefined || prefix === '')) {
         addSpam(m.sender, orang_spam);
         return m.reply(mess.spam);
      };
      if (antispam && command && args.length < 1 && !m.isBaileys) addFilter(m.sender);
      Logger(m, conn, waktu.time, pushname, groupName, body);
      if (global.self && !m.fromMe && !isOwner && !isPremium) return
      if (m.isGroup && db.chats[m.chat].mute && !isOwner && !m.fromMe && !isPremium) return
      if (global.group_mode && !m.isGroup && !m.isBaileys && !m.fromMe && !isOwner && !isPremium) {
         if (global?.group_only_message) return conn.adReply(m.chat, mess.groupOnly.replace('%contact', setting.contact), cover, m);
         else return
      };
      if (m.sender.startsWith('93') ||
         m.sender.startsWith('212') ||
         m.sender.startsWith('91') ||
         m.sender.startsWith('92') ||
         m.sender.startsWith('90') ||
         m.sender.startsWith('54') ||
         m.sender.startsWith('55') ||
         m.sender.startsWith('95') ||
         m.sender.startsWith('94') ||
         m.sender.startsWith('256')) {
         return conn.updateBlockStatus(m.sender, 'block');
      }
      if (!m.fromMe && !isAdmins && !isOwner && db.chats[m.chat]?.antiBot && m.isBaileys) {
         return m.reply('Maaf Kak Admin Mengaktifkan Anti Bot Lain Dan Kau Akan Segera Di Usir'), await m.delete(m.key), await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      }
      if (!m.fromMe && !isAdmins && !isOwner && db.chats[m.chat]?.antiPhoto && (m.mtype === 'imageMessage' || /image/.test(mime))) {
         return await m.reply('Maaf Kak Anti Photo Aktif'), await m.delete(m.key)
      }
      if (m?.mentionedJid) {
         if (m?.mentionedJid?.length > 10) {
            if (isAdmins || isOwner || m.fromMe && m.isBaileys) return
            m.delete(m.key) //, m.reply(`Hidetag atau Tagall Terdeteksi`)
         }
      }
      if (m?.msg?.ptt && !m.fromMe && m.isBaileys) m.delete(m.key)
      if (body?.toLowerCase()?.includes('assalamualaikum') || body?.toLowerCase()?.includes('assalamu\'alaikum')) {
         m.reply('waalaikumsalam')
      }
      if (m.isBaileys) return
      const isLimit = () => {
         let x
         if (db.users[m.sender].limit < 0) x = false
         else if (db.users[m.sender].limit > 0) x = true
         if (!x) conn.adReply(m.chat, mess.limit, cover, m)
         else if (x) {}
         return x
      }
      const useLimit = (value) => {
         const text_limit = limit_message.replace("%limit", value)
         if (!use_limit_message) {
            return db.users[m.sender].limit -= value
         } else if (use_limit_message && limit_adReply) {
            db.users[m.sender].limit -= value
            return conn.adReply(m.chat, text_limit, cover, m)
         } else if (use_limit_message && !limit_adReply) {
            db.users[m.sender].limit -= value
            return m.reply(text_limit)
         }
      };
      const isRegister = () => {
         let x
         if (db.users[m.sender].registered) x = true
         else if (!db.users[m.sender].registered) x = false
         if (x) {} else if (!x) conn.adReply(m.chat, mess.register, cover, m)
         return x
      }
      const isGroup = () => {
         let x
         if (m.isGroup) x = true
         else if (!m.isGroup) x = false
         if (x) {} else if (!x) conn.adReply(m.chat, mess.group, cover, m)
         return x
      }
      const isPrivate = () => {
         let x
         if (!m.isGroup) x = true
         else if (m.isGroup) x = false
         if (x) {} else if (!x) conn.adReply(m.chat, mess.private, cover, m)
         return x
      }
      const isOwn = () => {
         let x
         if (isOwner) x = true
         else if (!isOwner) x = false
         if (x) {} else if (!x) conn.adReply(m.chat, mess.owner, cover, m)
         return x
      }
      const isAdm = () => {
         let x
         if (isAdmins || isOwner) x = true
         else if (!isAdmins || !isOwner) x = false
         if (x) {} else if (!x) conn.adReply(m.chat, mess.admin, cover, m)
         return x
      }
      const isPrem = () => {
         let x
         if (isPremium) x = true
         else if (!isPremium) x = false
         if (x) {} else if (!x) conn.adReply(m.chat, mess.premium, cover, m)
         return x
      }      
      switch (command) {
        //** USER **//
         case 'daftar':
         case 'verify':
         case 'register': {
            if (db.users[m.sender].registered) return m.reply(`❗Kamu Sudah Daftar`);
            const nama = text.split(".")[0];
            const umur = text.split(".")[1];
            if (!nama || !umur) return m.reply(`*Masukkan nama dan umur yang benar*\n*contoh* *${prefix+command}* *nadia.50*`);
            const sn = Format.makeid(10);
            const date = `${waktu.tanggal} ${waktu.time} ${waktu.suasana}`;
            let user = db.users[m.sender]
            user.registered = true
            user.registeredTime = date
            user.name = nama
            user.umur = umur
            user.seri = sn
            user.limit += 10
            let verified = `Berhasil Daftar √\n\n`
            verified += `Nama: ${nama}\n`
            verified += `Umur: ${umur}\n`
            verified += `Serial Number: ${sn}\n\n`
            verified += `kamu mendapatkan 10 limit\n`
            verified += `setelah mendaftar\n`
            verified += `silahkan Ketik .meni`
            conn.adReply(m.chat, verified, cover, m)
         }
         break

         case 'afk': {
            const reason = text ? text : 'Ngewe';
            const caption = `Kamu Sekarang AFK Dengan Alasan: ${reason}`;
            const mention = text.includes('@') ? conn.parseMentionLid2(text) : [''];
            const isTags = [m.sender].concat(mention);
            conn.adReply(m.chat, caption, cover, m, {
               mentions: isTags,
               showAds: false
            }).then(() => {
               db.users[m.sender].afkReason = reason
               db.users[m.sender].afkTime = +new Date
            })
         }
         break

         case 'unreg': {
            if (!db.users[m.sender].registered) return m.reply(`Kamu Belum Terdaftar Ketik .daftar`);
            if (!text) return m.reply(`Masukan nomor sn nya untuk melihat sn silahkan ketik .sn atau .ceksn\ncontoh ${prefix+command} sn `);
            let serial = db.users[m.sender].seri
            if (text == serial) {
               db.users[m.sender].registered = false
               db.users[m.sender].registeredTime = ''
               db.users[m.sender].seri = ''
               db.users[m.sender].umur = ''
               return conn.adReply(m.chat, `Kamu Berhasil Keluar Dari Data Base Semua Data Kamu Kereset Ulang Ketik .me`, cover, m);
            } else {
               return m.reply(`serial number kamu salah masukan dengan benar ketik .sn`);
            }
         }
         break

         case 'transferuang':
         case 'tfuang': {
            if (!text) return m.reply(`Masukkan nomor atau tag dan nilai uang yang mau di transfer\ncontoh: ${prefix+command} 62xxxx 50\nAtau\ncontoh: ${prefix+command} @tag 50`);
            if (db.users[m.sender].uang < 49) return m.reply(`Gagal Transfer Pastikan Uang Kamu Masih Mencukupi Minimal Transfer Uang Adalah 50 ketik .my untuk cek sisa uang`);
            const number = text.split(" ")[0]
            const uang = text.split(" ")[1]
            if (!uang) return m.reply(`Masukkan nilai uang yang mau di transfer\ncontoh: ${prefix+command} 62xxxx 50\nAtau\ncontoh: ${prefix+command} @tag 50`);
            const Number = conn.decodeNum(number)
            const num = m.jid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'));
            const give = parseInt(uang);
            if (!db.users[num]) return m.reply(`Pengguna dengan nomor ${num} tidak ditemukan dalam database. Pastikan nomor sudah terdaftar.`);
            db.users[m.sender].uang -= give
            db.users[num].uang += give
            conn.adReply(m.chat, `Kamu berhasil transfer ${give} uang ke nomor @${num.split('@')[0]}`, cover, m, {
               mentions: [num]
            })
         }
         break

         case 'transferlimit':
         case 'tflimit': {
            if (!text) return m.reply(`Masukkan nomor atau tag dan nilai limit yang mau di transfer\ncontoh: ${prefix+command} 62xxxx 5\nAtau\ncontoh: ${prefix+command} @tag 5`);
            if (db.users[m.sender].limit < 4) return m.reply(`Gagal Transfer Pastikan Limit Kamu Masih Mencukupi Minimal Transfer Limit Adalah 5 ketik .limit untuk cek limit`);
            const number = text.split(" ")[0]
            const limit = text.split(" ")[1]
            if (!limit) return m.reply(`Masukkan nilai limit yang mau di transfer\ncontoh: ${prefix+command} 62xxxx 5\nAtau\ncontoh: ${prefix+command} @tag 5`);
            const Number = conn.decodeNum(number)
            const num = m.jid(Number + (m.text.match('@') ? '@lid' : '@s.whatsapp.net'));
            const give = parseInt(limit);
            if (!db.users[num]) return m.reply(`Pengguna dengan nomor ${num} tidak ditemukan dalam database. Pastikan nomor sudah terdaftar.`);
            db.users[m.sender].limit -= give
            db.users[num].limit += give
            conn.adReply(m.chat, `Kamu berhasil transfer ${give} limit ke nomor @${num.split("@")[0]}`, cover, m, {
               showAds: true,
               mentions: [num]
            });
         }
         break

         case 'profile':
         case 'my':
         case 'me':
         case 'profil': {
            const prem = isPremium ? 'Aktif' : 'Tidak';
            const isRegister = db.users[m.sender].registered
            const reg = isRegister ? 'Sudah Daftar' : 'Belum Daftar';
            const limitUser = db.users[m.sender].limit
            const userData = db.users[m.sender]
            const tag = text.match(/@/g);
            m.react('😚')
            if (tag) {
               try {
                  const mention = text.startsWith('@') ? conn.parseMention(text)[0] : conn.decodeNum(text) + '@s.whatsapp.net';
                  const userTag = db.users[mention];
                  const isRegisterTag = db.users[mention].registered
                  const limitUserTag = db.users[mention].limit
                  const regTag = isRegisterTag ? 'Sudah Daftar' : 'Belum Daftar';
                  const isPremiumTag = db.users[mention].premium
                  const premTag = isPremiumTag ? 'Aktif' : 'Tidak';
                  const _regtime = `${userTag.registeredTime === "" ? "" : '\n ‎ ‎ ‎ ‎ ‎ ‎ ' + userTag.registeredTime}`;
                  let Other = `👤 *User Profile* @${mention.split("@")[0]}\n`
                  Other += `📝 Total Penggunaan Perintah\n ‎ ‎ ‎ ‎ ‎ ‎ Bot: ${userTag.hitCmd} Kali\n`
                  Other += `🏷 Terdaftar: ${regTag}\n`
                  Other += `🗓 Waktu Daftar:${_regtime}\n`
                  Other += `📌 Premium: ${premTag}\n`
                  Other += `📍 Nama: ${userTag.name}\n`
                  Other += `💋 Umur: ${userTag.umur}\n`
                  Other += `📎 Seri: ${userTag.seri}\n`
                  Other += `🔖 Limit: ${limitUserTag}\n`
                  Other += `💰 Uang: ${userTag.uang}\n`
                  Other += `🛍 Kupon: ${userTag.kupon}\n`
                  conn.adReply(m.chat, Other, 'https://files.catbox.moe/xldrmi.png', m, {
                     mentions: [mention]
                  })
               } catch (e) {
                  throw 'Profile Not Active: \n' + e
               }
            } else if (!tag) {
               const Regtime = `${userData.registeredTime === "" ? "" : '\n ‎ ‎ ‎ ‎ ‎ ‎ ' + userData.registeredTime}`;
               let Profile = `👤 *User Profile* @${m.sender.split('@')[0]}\n`
               Profile += `📝 Total Penggunaan Perintah\n ‎ ‎ ‎ ‎ ‎ ‎ Bot: ${userData.hitCmd} Kali\n`
               Profile += `🏷 Terdaftar: ${reg}\n`
               Profile += `🗓 Waktu Daftar:${Regtime}\n`
               Profile += `📌 Premium: ${prem}\n`
               Profile += `📍 Nama: ${userData.name}\n`
               Profile += `💋 Umur: ${userData.umur}\n`
               Profile += `📎 Seri: ${userData.seri}\n`
               Profile += `🔖 Limit: ${limitUser}\n`
               Profile += `💰 Uang: ${userData.uang}\n`
               Profile += `🛍 Kupon: ${userData.kupon}\n`
               conn.adReply(m.chat, Profile, 'https://files.catbox.moe/xldrmi.png', m);
            }
         }
         break

         case 'catatan':
         case 'buatcatatan':
         case 'hapuscatatan': {
            if (command == 'catatan') {
               if (db.users[m.sender].notes == "") {
                  return m.reply(`Kamu belum memiliki catatan silahkan ketik \n${prefix}buatcatatan textkamu`);
               } else {
                  await m.reply(`${db.users[m.sender].notes}`);
                  await m.reply(`itu cacatan kamu\njika sudah ada catatan dan jika kamu mau edit, salin dulu catatan sebelum nya lalu tambahkan text nya dengan mengetik ${prefix}buatcatatan\nkalo mau hapus catatan ketik ${prefix}hapuscatatan`);
               }
            } else if (command == 'buatcatatan') {
               if (!text) return m.reply('text nya mana?');
               db.users[m.sender].notes = text
               m.reply(`Berhasil Memasukan Cacatan Kamu ketik ${prefix}catatan`);
            } else if (command == 'hapuscatatan') {
               db.users[m.sender].notes = ''
               m.reply(`Berhasil Menghapus Cacatan Kamu. Untuk Masukan Catatan Baru ketik ${prefix}buatcatatan`);
            }
         }
         break

         case 'menfess':
         case 'mfs':
         case 'tutupmenfess':
         case 'akhirimenfess':
         case 'menfessclose': {
            if (command == 'menfess' || command == 'mfs') {
               if (!text) throw `*Cara penggunaan :*\n\n${prefix + command} nomor penerima|nama pengirim|pesan\n\n*Note:* nama pengirim boleh nama samaran atau anonymous.\n\n*Contoh:*\n${prefix + command} ${m.sender.split`@`[0]}|${setting.botName}|Halo`;
               const menfess = global.db.menfess
               let [jid, name, pesan] = text.split('|');
               if ((!jid || !name || !pesan)) throw `*Cara penggunaan :*\n\n${prefix + command} nomor penerima|nama pengirim|pesan\n\n*Note:* nama pengirim boleh nama samaran atau anonymous.\n\n*Contoh:*\n${prefix + command} ${m.sender.split`@`[0]}|${setting.botName}|Halo.`;
               jid = jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
               const data = (await conn.onWhatsApp(jid))[0] || {};
               if (!data.exists) throw 'Nomer tidak terdaftar di whatsapp.';
               if (jid == m.sender) throw 'tidak bisa mengirim pesan menfess ke diri sendiri.'
               const id = +new Date
               const txt = `*Hai Kak*\n*@${data.jid.split('@')[0]}*\n*Kenalin Aku ${setting.botName} Robot Whatsap*\n*Disini Aku Berperan Sebagai Tukang Pos* , *kamu menerima pesan nih*.\n\n*Dari:* ${name}\n*Pesan:* ${pesan}\n\nMau balas pesan ini kak? bisa kak. kamu tinggal ketik pesan kamu nanti aku sampaikan ke *${name}*.`.trim();
               if (m.isBaileys) return
               await conn.sendMessage(data.jid, {
                  text: txt,
                  mentions: [data.jid]
               }, {
                  quoted: fake_wa,
                  ...conn.exp
               }).then(async () => {
                  if (m.isBaileys) return
                  await m.reply('Berhasil mengirim pesan menfess.')
                  menfess[id] = {
                     ID: id,
                     status: true,
                     dari: m.sender,
                     penerima: data.jid,
                     firstNameChat: name,
                     pesan: [{
                        waktu: `${waktu.tanggal} ${waktu.time}`,
                        nama: m.pushName,
                        number: `${m.sender.split('@')[0]}`,
                        pesan: pesan
                     }]
                  }
                  return !0
               })
            } else if (command == 'menfessclose' || command == 'tutupmenfess' || command == 'akhirimenfess') {
               const menfess = global.db.menfess
               const mf = Object.values(menfess).find(v => v.status === true && v.dari == m.sender);
               if (mf) {
                  delete menfess[mf.ID]
                  await m.reply('Sukses Menutup Sesi Menfess').then(async () => {
                     await conn.sendMessage(mf.penerima, {
                        text: 'Pengirim Telah Mengakhiri Sesi Menfess',
                        mentions: [mf.penerima]
                     }, {
                        quoted: fake_wa,
                        ...conn.exp
                     })
                  })
               } else {
                  return m.reply('Tidak Ada Sesi Menfess Saat InI')
               }
            }
         }
         break

         case 'lapor': {
            if (!text) throw `untuk bertanya sesi live chat dengan owner bukan bot sekarang\nmasukan text nya contoh \n${prefix+command} halo owner tolong ke grup sewa Nexus NS sebentar ada yang di tanya`;
            const num = setting.contact + '@s.whatsapp.net'
            const teks = `Laporan Dari @${m.sender.split('@')[0]}\nText : ${text}`
            const caption = `Baik permintaan kamu akan segera di proses silahkan tunggu beberapa saat\nNomor: @${m.sender.split('@')[0]}\nNama: ${db.users[m.sender].name}\nWaktu: ${waktu.tanggal} ${waktu.jam} ${waktu.suasana}\nLaporan: ${text}`
            conn.adReply(m.chat, caption, cover, m, {
               mentions: [m.sender]
            }).then(() => {
               conn.adReply(num, teks, cover, m, {
                  mentions: [m.sender]
               })
            })
         }
         break

         case 'tukarkupon':
         case 'kupon': {
            if (!text) return m.reply(`Masukkan Parameter contoh: .tukarkupon 1\n\nKupon Kamu Tersisa ${db.users[m.sender].kupon}`);
            if (db.users[m.sender].kupon < 0) return m.reply(`Kupon kamu tidak cukup atau habis untuk menukar kupon ke limit\nsilahkan bayar hutang kupon kalo minus punya hutang\nketik .claimkupon untuk mendapatkan kupon\natau Ketik .my untuk cek sisa kupon`);
            if (/^[1-9]\d*$/.test(text)) {
               const jumlahKupon = parseInt(text);
               const jumlahLimit = jumlahKupon * 20
               if (db.users[m.sender].kupon < jumlahKupon) return m.reply(`Kupon kamu tidak cukup untuk menukar ${jumlahKupon} kupon\nPastikan kupon kamu masih mencukupi\nKupon kamu tersisa ${db.users[m.sender].kupon}`);
               db.users[m.sender].kupon -= jumlahKupon
               db.users[m.sender].limit += jumlahLimit
               conn.adReply(m.chat, `Kamu berhasil mendapat ${jumlahLimit} limit dengan menukar ${jumlahKupon} kupon`, cover, m);
            } else {
               return m.reply(`Masukkan parameter angka yang valid`);
            }
         }
         break

         case 'limit':
         case 'ceklimit': {
            const limitUser = db.users[m.sender].limit
            if (limitUser !== undefined) {
               const Limit = `Kamu Memiliki ${limitUser} Limit Tersisa`
               conn.adReply(m.chat, Limit, cover, m, {
                  showAds: true
               })
            } else {
               return m.reply('Limit kamu tidak ditemukan silahkan .daftar');
            }
         }
         break

         case 'claimuang': {
            let give = 250;
            let currentTime = new Date().getTime();
            let lastUang = new Date(db.users[m.sender].lastUang).getTime();
            let timeDiff = Math.floor((currentTime - lastUang) / (1000 * 60 * 60));
            let remainingTime;
            if (timeDiff < 24) {
               remainingTime = 24 - timeDiff
            } else {
               db.users[m.sender].uang += give
               db.users[m.sender].lastUang = new Date().toJSON();
               const text = `Claim Uang berhasil. Kamu dapat ${give} Uang\nKamu Bisa melakukan claim uang lagi dalam 24 jam mendatang.\nGunakan Untuk Membeli Limit\ncontoh .buylimit 50`
               conn.adReply(m.chat, text, cover, m, {
                  showAds: true
               })
            }
            if (typeof remainingTime === "number") {
               return m.reply(`Kamu sudah melakukan claim uang sebelumnya. Tunggu ${remainingTime} jam lagi sebelum dapat melakukan claim uang kembali.`);
            }
         }
         break

         case 'claimkupon': {
            let give = 5
            let currentTime = new Date().getTime();
            let lastKupon = new Date(db.users[m.sender].lastKupon).getTime();
            let timeDiff = Math.floor((currentTime - lastKupon) / (1000 * 60 * 60));
            let remainingTime;
            if (timeDiff < 48) {
               remainingTime = 48 - timeDiff
            } else {
               db.users[m.sender].kupon += give
               db.users[m.sender].lastKupon = new Date().toJSON();
               let text = `Claim Kupon berhasil. Kamu dapat ${give} Kupon\nKamu Bisa melakukan claim lagi dalam 48 jam mendatang.\n\nJika Ingin Tukar Ke Limit Contoh Penggunaannya: \n.tukarkupon 1 \n\nLihat Ada Berapa Kupon Kamu Berapa Banyak Bisa Di Tukar Ke Limit Ketik .me`
               conn.adReply(m.chat, text, cover, m, {
                  showAds: true
               })
            }
            if (typeof remainingTime === "number") {
               return m.reply(`Kamu sudah melakukan claim kupon sebelumnya. Tunggu ${remainingTime} jam lagi sebelum dapat melakukan claim kupon kembali.`);
            }
         }
         break

         case 'hour':
         case 'hourly': {
            const hourly = 10
            const currentTime = new Date().getTime();
            const lastHourTime = new Date(db.users[m.sender].lastHour).getTime();
            const timeDiff = Math.floor((currentTime - lastHourTime) / (1000 * 60 * 60));
            let remainingTime;
            if (timeDiff < 1) {
               remainingTime = 60 - (Math.floor((currentTime - lastHourTime) / (1000 * 60)) % 60);
            } else {
               db.users[m.sender].limit += hourly
               db.users[m.sender].lastHour = new Date().toJSON();
               const claim_hour = `Claim Perjam berhasil. Kamu mendapatkan ${hourly} Limit. Kamu bisa melakukan claim lagi dalam 1 jam mendatang.`
               return conn.adReply(m.chat, claim_hour, cover, m)
            }
            if (typeof remainingTime === "number") {
               return m.reply(`Kamu sudah melakukan claim dalam 1 jam terakhir. Tunggu ${remainingTime} menit lagi sebelum dapat melakukan claim kembali.\nkamu juga bisa claim uang  ketik .claimuang`);
            }
         }
         break

         case 'claim':
         case 'daily':
         case 'hadiah': {
            const give = 20
            const currentTime = new Date().getTime();
            const lastClaim = new Date(db.users[m.sender].lastClaim).getTime();
            const timeDiff = Math.floor((currentTime - lastClaim) / (1000 * 60 * 60));
            let remainingTime;
            if (timeDiff < 24) {
               remainingTime = 24 - timeDiff
            } else {
               if (!m.isBaileys) {
                  db.users[m.sender].limit += give
                  db.users[m.sender].lastClaim = new Date().toJSON();
                  const claim = `Claim berhasil. Kamu dapat ${give} Limit\nKamu Bisa melakukan claim lagi dalam 24 jam mendatang.`
                  conn.adReply(m.chat, claim, cover, m).then(() => {
                     conn.sendButton(m.chat, 'Ingin Tukar Kupon?', null, m, [
                        ['Tukar Kupon', '.tukarkupon']
                     ])
                  })
               }
            }
            if (typeof remainingTime === "number") {
               return m.reply(`Kamu sudah melakukan claim dalam 24 jam terakhir. Tunggu ${remainingTime} Jam lagi sebelum dapat melakukan claim kembali.\nkamu juga bisa claim uang  ketik .claimuang`);
            }
         }
         break

         case 'sn':
         case 'ceksn': {
            const Serial = db.users[m.sender].seri
            if (Serial !== "") {
               await Promise.all([await conn.adReply(m.chat, `itu adalah serial number kamu silahkan salin`, cover, m), await m.reply(Serial)])
            } else {
               return m.reply('nomor sn kamu tidak ditemukan silahkan .daftar');
            }
         }
         break

         case 'buylimit': {
            if (!text) return m.reply(`Masukkan Parameter contoh: .buylimit 1`);
            if (db.users[m.sender].uang < 10) return m.reply(`Uang kamu tidak cukup atau habis untuk membeli limit\nsilahkan bayar hutang kalo minus punya hutang\nketik .claimuang untuk uang harian\natau Ketik .my untuk cek sisa uang`);
            if (/^[1-9]\d*$/.test(text)) {
               const jumlahLimit = parseInt(text);
               const hargaLimit = jumlahLimit * 10
               if (db.users[m.sender].uang < hargaLimit) return m.reply(`Uang Kamu Tidak Cukup Untuk Membeli ${jumlahLimit} Limit\n\nUang Kamu Hanya Ada ${db.users[m.sender].uang}\n\nHarga Yang Di butuhkan Adalah ${hargaLimit} Uang\n\nCoba Untuk Mengurangi Jumlah Limitnya Yang Ingin Di Beli`);
               db.users[m.sender].limit += jumlahLimit
               db.users[m.sender].uang -= hargaLimit
               conn.adReply(m.chat, `Kamu berhasil membeli ${jumlahLimit} limit dengan harga ${hargaLimit} uang`, cover, m);
            } else {
               return m.reply(`Masukkan parameter angka yang valid`);
            }
         }
         break

         case 'jadibot':
         case 'stopjadibot':
         case 'listjadibot':
         case 'deletejadibot':
         case 'deljadibot': {
            if (!global.jadibot_engine) return m.reply('Fitur jadibot belum di nyalakan owner');
            if (/stopjadibot/g.test(command)) {
               return await stopjadibot(m)
            } else if (/listjadibot/g.test(command)) {
               return await listjadibot(m)
            } else if (/deljadibot|deletejadibot/g.test(command)) {
               if (!isOwner) return m.reply(mess.owner)
               return await deletejadibot(m, text)
            } else if (/jadibot/g.test(command)) {
               if (!isRegister()) return
               return await jadibot(m)
            }
         }
         break

         /** DOWNLOAD **/
         case 'ytsearch':
         case 'yts': {
            if (!text) return m.reply(`Masukan Info Yang Ingin Di Cari\ncontoh ${prefix+command} laila canggung`);
            let caption = ''
            const thumb = "https://qu.ax/OcWmv.jpeg"
            const data = await (await search(text)).all
            data.forEach(v => caption += `\n\n⭔ ID : ${v.videoId}\n⭔ Title : ${v.title}\n⭔ Views : ${v.views}\n⭔ Duration : ${v.timestamp}\n⭔ Upload At : ${v.ago}\n⭔ Url : ${v.url}\n─────────────────`);
            conn.adReply(m.chat, loading, cover, m).then(() => {
               conn.adReply(m.chat, `*${zw} 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐒𝐄𝐀𝐑𝐂𝐇*` + caption, thumb, m, {
                  showAds: true
               })
            })
         }
         break

         case 'play':
         case 'song':
         case 'lagu': {
            if (!isLimit()) return
            if (!text) return m.reply(`Masukan Lagu Yang Ingin Di Cari\ncontoh ${prefix+command} papinka sana sini aku rindu atau .play linknya https://youtu.be/A5Jj6Ib91zA`);
            await m.react('🎧')
            let data = await search(text)
            const res = data.all
            const url = data.videos[0]
            const link = url.url
            const thumb = `https://i.ytimg.com/vi/${url.videoId}/0.jpg`
            let result = '';
            result += `🎧 〔 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐏𝐋𝐀𝐘 〕\n`
            result += `*⭔ Title:* ${url.title}\n`
            result += `*⭔ Durasi:* ${url.timestamp}\n`
            result += `*⭔ Views:* ${url.views.toLocaleString()}\n`
            result += `*⭔ Name Channel:* ${url.author.name}\n`
            result += `*⭔ Channel:* ${url.author.url}\n`
            result += `*⭔ URL Video:* ${url.url}\n\n`
            result += ` *Loading audio sedang dikirim...*`
            conn.sendFile(m.chat, thumb || cover, result, m)
            const audio = await Scraper.ocean(link, 'mp4', 144).catch(async () => await Scraper.ocean(link, 'mp4', 360)).catch(async () => await Scraper.ocean(link, 'mp4', 480)).catch(async () => await Scraper.ocean(link, 'mp4', 720)).catch(async () => await Scraper.ocean(link, 'mp4', 1080)).catch(async () => await Scraper.ocean(text, 'mp3')).catch(async () => await toBuffer((await (await fetch(`https://api.azbry.com/api/download/ytmp3?url=${link}`)).json()).result.download));
            const pretty = await Format.mp3Play(audio?.media || audio);
            if (audio.media) m.react('✅')
            else if (audio && !audio.media) m.react('🔥')
            await conn.sendFile(m.chat, await Format.mp3(pretty), url.title, m, {
               ...opus
            });
            useLimit(2)
         }
         break

         case 'ytmp4':
         case 'ytv':
         case 'ytvideo':
         case 'ytvid': {
            if (!isLimit()) return
            if (!text) return m.reply(`Masukan Link Youtubenya contoh:\n${prefix+command} https://youtu.be/MvsAesQ-4zA`);
            m.react('📥')
            const video = await Scraper.ocean(text, 'mp4', 1080).catch(async () => await Scraper.ocean(text, 'mp4', 720)).catch(async () => await Scraper.ocean(text, 'mp4', 480)).catch(async () => await Scraper.ocean(text, 'mp4', 360));
            const {
               thumbnail
            } = await Scraper.getInfoYoutube(text);
            const caption = `${head("YouTube")}\n` +
               `*Title:* ${video.title}\n\n` +
               `*Loading video sedang di kirim*`;
            await conn.adReply(m.chat, caption, thumbnail, m);
            await conn.sendFile(m.chat, video.media, '', m, {
               document: true,
               fileName: `${video.title}-${video?.quality || ''}~Ruhend-MD.mp4`,
               mimetype: 'video/mp4'
            })
            useLimit(2)
         }
         break

         case 'ytmp3':
         case 'yta':
         case 'ytaudio': {
            if (!isLimit()) return
            if (!text) return m.reply(`Masukan kontolnya! \nContoh: ${prefix+command} https://youtu.be/MvsAesQ-4zA`);
            m.react('🎵')
            const audio = await Scraper.ocean(text, 'mp4', 144).catch(async () => await Scraper.ocean(text, 'mp4', 360)).catch(async () => await Scraper.ocean(text, 'mp4', 480)).catch(async () => await Scraper.ocean(text, 'mp4', 720)).catch(async () => await Scraper.ocean(text, 'mp4', 1080)).catch(async () => await Scraper.ocean(text, 'mp3'));
            await conn.adReply(m.chat, loading, audio?.thumbnail || cover, m);
            const media = await Format.mp3Play(audio.media);
            await conn.sendFile(m.chat, media, '', m, {
               document: true,
               fileName: `${audio.title}~Ruhend-MD.mp3`,
               mimetype: 'audio/mpeg'
            })
            useLimit(2)
         }
         break

         case 'twitter': {
            if (!isLimit()) return
            if (!text) return m.reply(`contoh ${prefix+command} https://twitter.com/gofoodindonesia/status/1229369819511709697`);
            await conn.adReply(m.chat, loading, cover, m);
            const data = await Scraper.twitter(text);
            await conn.sendFile(m.chat, data.url.hd || data.url.sd, data.title || '', m)
            useLimit(2)
         }
         break

         case 'tiktokmp3':
         case 'ttmp3': {
            if (!isLimit()) return
            if (!text) return m.reply(`Masukan link tiktok nya! \nContoh: ${prefix + command} https://vt.tiktok.com/ZSNYfYdLj`);
            conn.adReply(m.chat, loading, cover, m);
            const {
               music
            } = await ttdl(text);
            await conn.sendFile(m.chat, music, '', m);
            useLimit(2)
         }
         break

         case 'tiktok':
         case 'tt':
         case 'ttdl':
         case 'titit': {
            if (!isLimit()) return
            if (!text) return m.reply(`masukan Tiktok contoh\n${prefix+command} ` + 'https://vm.tiktok.com/ZSqX31DxJ/')
            m.react('🕒')
            const {
               title,
               author,
               username,
               published,
               like,
               comment,
               share,
               views,
               bookmark,
               video,
               cover: picture,
               music
            } = await ttdl(text);
            let caption = `${head("𝐓𝐈𝐊𝐓𝐎𝐊")} \n`
            caption += `⭔ *Author:* ${author}\n`
            caption += `⭔ *Username:* ${username}\n`
            caption += `⭔ *Published:* ${published}\n`
            caption += `⭔ *Like:* ${like}\n`
            caption += `⭔ *Comment:* ${comment}\n`
            caption += `⭔ *Views:* ${views}\n`
            caption += `⭔ *Bookmark:* ${bookmark}\n`
            caption += `⭔ *Description:* ${title}\n`
            caption += `${zw} ${namebot}`
            const vid = await conn.getMime(video);
            if (/video/.test(vid)) {
               await conn.sendFile(m.chat, video, caption, m);
            } else {
               const slides = (await toJSON(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${text}`)).data.slides;
               const urls = Object.keys(slides).filter(key => !isNaN(key)).map(key => slides[key].url);
               for await (let v of urls) {
                  const media = (await conn.getFile(v)).res;
                  const outPath = media.replace(/\.\w+$/, '.jpg');
                  await new Promise((resolve, reject) => {
                     exec(`ffmpeg -i ${media} ${outPath}`, (err) => {
                        if (err) reject(err);
                        else resolve();
                     })
                  })
                  await m.reply(await toBuffer(outPath));
               }
               await m.reply(await toBuffer(video));
            }
            useLimit(2)
         }
         break

         case 'sfile': {
            if (!isLimit()) return
            if (!text) return m.reply(`contoh: ${prefix+command} https://sfile.mobi/agJlyQTbq0T`);
            m.react('🍌')
            const data = await Scraper.sfile(text);
            const caption = `${head('*SFILE*')}\n` +
               `*Name:* ${data.title}\n` +
               `*Size:* ${data.size}\n` +
               `*Mimetype:* ${data.mime_type}\n` +
               `*Uploaded By:* ${data.author.name}\n` +
               `*Uploaded Date:* ${data.upload_date}\n` +
               `*Total Download:* ${data.downloads}`
            await conn.adReply(m.chat, caption, 'https://files.catbox.moe/wbgchw.jpg', m).then(async () => {
               await conn.sendFile(m.chat, data.direct_cdn_link, '', m, {
                  document: true,
                  fileName: data.title,
                  mimetype: data.mime_type
               })
            })
            useLimit(2)
         }
         break

         case 'pinterest':
         case 'pin': {
            if (!isLimit()) return
            if (!text) return m.reply(`contoh: ${prefix+command} Input Query`)
            const data = await toJSON(`https://api.siputzx.my.id/api/s/pinterest?query=${text}&type=image`);
            const images = data.data.map(item => item.image_url).filter(Boolean);
            conn.adReply(m.chat, loading, cover, m);
            for await (let i of images) await await m.reply(await toBuffer(i));
            useLimit(2)
         }
         break

         case 'mediafire':
         case 'mf': {
            if (!isLimit()) return
            if (!text) return m.reply(`Contoh:\n${prefix+command} https://www.mediafire.com/file/96mscj81p92na3r/images+(35).jpeg/file`);
            const isLinks = text.match(/(?:https?:\/{2})?(?:w{3}\.)?mediafire(?:com)?\.(?:com|be)(?:\/www\?v=|\/)([^\s&]+)/)
            if (!isLinks) return m.reply('Link yang kamu berikan tidak valid');
            const mediafire = async (url) => {
               const data = await fetch(`https://www-mediafire-com.translate.goog/${url.replace("https://www.mediafire.com/", "")}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`).then(res => res.text());
               const $ = cheerio.load(data);
               const link = ($("#downloadButton").attr("href") || "").trim();
               const link2 = ($("#download_link > a.retry").attr("href") || "").trim();
               const $intro = $("div.dl-info > div.intro");
               const name = $intro.find("div.filename").text().trim();
               const filetype = $intro.find("div.filetype > span").eq(0).text().trim();
               const ext = /\(\.(.*?)\)/.exec($intro.find("div.filetype > span").eq(1).text())?.[1]?.trim() || "bin";
               const upload = $("div.dl-info > ul.details > li").eq(1).find("span").text().trim();
               const size = $("div.dl-info > ul.details > li").eq(0).find("span").text().trim();
               return {
                  link,
                  link2,
                  name,
                  filetype,
                  ext,
                  upload,
                  size
               }
            };
            const {
               link,
               link2,
               name,
               filetype,
               ext,
               upload,
               size
            } = await mediafire(`${isLinks}`);
            const isType = filetype.toLowerCase() + "/" + ext.toLowerCase()
            let mediaFire = ` ${zw} 𝐌𝐄𝐃𝐈𝐀𝐅𝐈𝐑𝐄\n\n`
            mediaFire += ` Nama : ${name}\n`
            mediaFire += ` Size : ${size}\n`
            mediaFire += ` Type : ${filetype} ${ext}\n\n`
            mediaFire += ` Sending File...\n`
            await conn.adReply(m.chat, mediaFire, cover, m).then(async () => {
               await conn.sendFile(m.chat, link || link2, '', m, {
                  document: true,
                  fileName: name,
                  mimetype: isType
               })
            })
            useLimit(2)
         }
         break

         case 'iqc':
         case 'iphoneqc': {
            if (!isLimit()) return
            if (!text) throw `gunakan : .iqc pesan\ncontoh : ${prefix+command} hai`;
            m.reply(loading)
            const battery = Math.floor(Math.random() * 100) + 1;
            const image = await toBuffer(`https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(waktu.time)}&batteryPercentage=${battery}&carrierName=Smartfren&messageText=${text}&emojiStyle=apple`);
            await conn.sendFile(m.chat, image, '', m);
            useLimit(2)
         }
         break

         case 'instagram':
         case 'ig':
         case 'igdl': {
            if (!isLimit()) return
            if (!text) return m.reply(`Masukan instagram \ncontoh: ${prefix+command} https://www.instagram.com/p/DX3y0nUkwYR/?img_index=3&igsh=a3ZuZWp2MGtldW1p`);
            await m.react("🕒")
            await conn.adReply(m.chat, loading, cover, m);
            const data = await igdl(text);
            for await (let v of data) {
               const video = await conn.getMime(v)
               if (/video/.test(video)) {
                  await conn.sendFile(m.chat, v, '', m);
               } else {
                  const media = (await conn.getFile(v)).res;
                  const outPath = media.replace(/\.\w+$/, '.png');
                  await new Promise(async (resolve, reject) => {
                     await exec(`ffmpeg -i ${media} ${outPath}`, (err) => {
                        if (err) reject(err);
                        else resolve();
                     })
                  })
                  await conn.sendFile(m.chat, outPath, '', m);
               }
            }
            useLimit(2)
         }
         break

         case 'googledrive':
         case 'gdrive':
         case 'drive': {
            if (!isLimit()) return
            if (!text) return m.reply(`Masukan Link Google Drove nya contoh ${prefix+command} https://drive.google.com/file/d/1BKaXs8uIt4_C_dEKUje-nn-XYYNOO07y/view?usp=drivesdk`)
            m.react('🕒')
            const res = await Scraper.gdrive(text);
            if (!res) throw res
            const drive = ` ${star} 𝐆𝐎𝐆𝐆𝐋𝐄 𝐃𝐑𝐈𝐕𝐄\n` +
               ` ${java} Name: ${res.fileName}\n` +
               ` ${java} Type: ${res.mimetype}\n` +
               ` ${java} Size: ${res.fileSize}`
            await conn.adReply(m.chat, drive, cover, m).then(() => {
               conn.sendFile(m.chat, res.downloadUrl, '', m, {
                  document: true,
                  fileName: res.fileName,
                  mimetype: res.mimetype
               })
            })
            useLimit(2)
         }
         break

         case 'gitclone': {
            if (!isLimit()) return
            if (!text) return m.reply(`link githubnya mana?\n*Contoh:*\n${prefix+command} https://github.com/ruhend/maleficent`)
            let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
            let linknya = text
            if (!regex1.test(linknya)) return m.reply('link salah!');
            let [, user, repo] = args[0].match(regex1) || []
            repo = repo.replace(/.git$/, '')
            let url = `https://api.github.com/repos/${user}/${repo}/zipball`
            let filename = (await fetch(url, {
               method: 'HEAD'
            })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
            await conn.adReply(m.chat, `*Mohon tunggu*\n*sedang mengirim repository...*`, cover, m).then(() => {
               conn.sendFile(m.chat, url, '', m, {
                  document: true,
                  fileName: filename,
                  mimetype: 'application/zip'
               })
            })
            useLimit(2)
         }
         break

         case 'apk':
         case 'apkdl': {
            if (!isLimit()) return
            if (!text) return m.reply(`Masukan apk yang ingin di cari contoh ${prefix+command} facebook lite`);
            m.reply(loading);
            const res = await download(text),
               icon = res.icon,
               paket = res.package,
               size = res.size,
               nama = res.name,
               up = res.lastup,
               file = res.dllink;
            let caption = ` 𝐀𝐏𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃\n`
            caption += ` ${java} Nama : ${nama}\n`
            caption += ` ${java} Update : ${up}\n`
            caption += ` ${java} Nama Paket : ${paket}\n`
            caption += ` ${java} Size : ${size}\n\n`
            caption += ` *Sending File...*`
            await conn.sendFile(m.chat, icon, caption, m).then(async () => {
               await conn.sendFile(m.chat, file, '', m, {
                  document: true,
                  fileName: nama + '.apk',
                  mimetype: 'application/vnd.android.package-archive'
               })
            })
            useLimit(2)
         }
         break

         case 'facebook':
         case 'fb':
         case 'fbdl': {
            if (!isLimit()) return
            if (!text) return m.reply(`masukan link facebook nya! \nContoh: ${prefix+command} https://www.facebook.com/share/r/15i8ekGVQgF`);
            await conn.adReply(m.chat, loading, cover, m)
            const data = await fbdl(text);
            for await (let media of data) {
               await conn.sendFile(m.chat, media, '𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊', m), await sleep(2000)
            }
            useLimit(2)
         }
         break

         /** GAMES **/

         case 'caklontong':
         case 'cak': {
            const rewards = {
               limit: 15,
               uang: 25
            }
            if (caklontong.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            const anu = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.adReply(m.chat, `Jawablah Pertanyaan Berikut :\n\n*${result.soal}*\n\nWaktu : 60 detik\n🎁 Hadiah\n+${rewards.limit} Limit 🎟\n+${rewards.uang} Uang 💰`, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZhjq_8cvfICed0NWLYemchaBqC9QN8RjbGg&usqp=CAU', m).then(() => {
               caklontong[m.sender.split('@')[0]] = result.jawaban.toLowerCase();
               console.log(caklontong);
               caklontong_desc[m.sender.split('@')[0]] = result.deskripsi;
               console.log(caklontong_desc);
            })
            await sleep(60000);
            if (caklontong.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban: ${caklontong[m.sender.split('@')[0]]}\nDeskripsi : ${caklontong_desc[m.sender.split('@')[0]]}`, cover, m);
               delete caklontong[m.sender.split('@')[0]]
               delete caklontong_desc[m.sender.split('@')[0]]
            }
         }
         break

         case 'family100': {
            if ('family100' + m.chat in family100) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');
            const anu = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json')
            const random = anu[Math.floor(Math.random() * anu.length)]
            const hasil = `*Jawablah Pertanyaan Berikut :*\n\n${random.soal}\n\nTerdapat *${random.jawaban.length}* Jawaban ${random.jawaban.find(v => v.includes(' ')) ? `(beberapa Jawaban Terdapat Spasi)\n` : ''}`.trim();
            console.log(random.jawaban);
            family100['family100' + m.chat] = {
               id: 'family100' + m.chat,
               pesan: await conn.sendText(m.chat, hasil, m),
               ...random,
               terjawab: Array.from(random.jawaban, () => false)
            }
         }
         break

         case 'spin': {
            const currentTime = new Date().getTime();
            const lastSpinTime = new Date(db.users[m.sender].lastSpin).getTime();
            const timeDiff = Math.floor((currentTime - lastSpinTime) / (1000 * 60));
            if (timeDiff >= 30) {
               db.users[m.sender].spin = 10;
               db.users[m.sender].is_spin = true;
               db.users[m.sender].lastSpin = new Date().toJSON();
            };
            if (db.users[m.sender].spin < 1 && timeDiff < 30) {
               const remainingTime = 30 - timeDiff;
               return m.reply(`Kamu sudah melakukan spin dalam 30 menit terakhir\nTunggu ${remainingTime} menit lagi sebelum dapat melakukan spin kembali`);
            };
            if (!text || !/^[1-9]\d*$/.test(text) || parseInt(text) < 1 || parseInt(text) > 100) {
               return m.reply(`Silakan masukkan angka target antara 1 hingga 100\nContoh: ${prefix + command} 25`);
            };
            const target = parseInt(text);
            const result = Math.floor(Math.random() * 101);
            const difference = Math.abs(result - target);
            let response;
            if (result === target) {
               response = `🎰 Anda memutar roda dan mendapatkan angka ${result}\n🎉 Selamat! Anda menang dengan hadiah utama! Jackpot\n+50 limit 🎟\n+500 Uang💰 `;
               db.users[m.sender].limit += 50;
               db.users[m.sender].uang += 500;
            } else if (difference <= 5) {
               const limitReward = Math.floor(Math.random() * 5) + 1;
               const uangReward = Math.floor(Math.random() * 41) + 10;
               response = `🎰 Anda memutar roda dan mendapatkan angka ${result}\n🎁 Dekat sekali! Anda menang dengan hadiah kecil!\n+${limitReward} Limit 🎟\n+${uangReward} Uang💰`;
               db.users[m.sender].limit += limitReward;
               db.users[m.sender].uang += uangReward;
            } else {
               response = `🎰 Anda memutar roda hasilnya adalah ${result}\nMaaf, Anda kalah\nAngka Anda adalah: ${target}\nTidak ada hadiah yang diberikan\ndan Jackpot adalah ${result}`;
            };
            conn.adReply(m.chat, response + `\nSisa Kesempatan spin ${db.users[m.sender].spin < 1 ? '' : db.users[m.sender].spin - 1 + ''}`, cover, m, {
               showAds: true
            }).then(() => {
               db.users[m.sender].spin -= 1;
               if (db.users[m.sender].spin < 1) {
                  db.users[m.sender].spin = 0;
                  db.users[m.sender].is_spin = false;
                  db.users[m.sender].lastSpin = new Date().toJSON();
               }
            })
         }
         break

         case 'kuismath':
         case 'math':
         case 'matematika': {
            const rewards = {
               limit: 10,
               uang: 30
            }
            if (kuismath.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!")
            if (!text) return m.reply(`Pilih Mode:\n- ${Object.keys(modes).join(' \n- ')}\n\nContoh penggunaan: ${prefix + command} medium`)
            const result = await genMath(text.toLowerCase())
            conn.adReply(m.chat, `*Berapa hasil dari: ${result.soal.toLowerCase()}*?\n\nWaktu: ${(result.waktu / 1000).toFixed(2)} detik\n\n*Hadiah* :\n *+${rewards.limit} Limit*\n *+${rewards.uang} Uang*`, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiz5Y0ncO0gQpNj1N3UrQ-2hx85TaSu_8f8w&usqp=CAU', m).then(() => {
               kuismath[m.sender.split('@')[0]] = result.jawaban
               console.log(kuismath)
            });
            await sleep(result.waktu);
            if (kuismath.hasOwnProperty(m.sender.split('@')[0])) {
               console.log("Jawaban: " + result.jawaban);
               m.reply("Waktu Habis\nJawaban: " + kuismath[m.sender.split('@')[0]])
               delete kuismath[m.sender.split('@')[0]]
            }
         }
         break

         case 'siapakahaku':
         case 'siapakah': {
            const rewards = {
               limit: 20,
               uang: 40
            }
            if (m.isBaileys) return
            if (siapakahaku.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Soal Yang Belum Terjawab!")
            const anu = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json');
            const result = anu[Math.floor(Math.random() * anu.length)];
            conn.adReply(m.chat, `*Siapakah Aku*\nSilahkan Jawab Soal Di Bawah Ini\n\nDeskripsi :\n*${result.soal}*\n\nWaktu : 60 Detik\nHadiah : 🛍 \n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💵`, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQehh3CYKBlK2WAla6ZV7nH8pD3-fdj9Q_cLw&usqp=CAU", m).then(() => {
               siapakahaku[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
               console.log(siapakahaku);
            });
            await sleep(60000);
            if (siapakahaku.hasOwnProperty(m.sender.split('@')[0])) {
               console.log("Jawaban: " + result.jawaban)
               conn.adReply(m.chat, `📢 Waktu Habis\nJawaban: ${siapakahaku[m.sender.split('@')[0]]}`, setting.thumbnail, m)
               delete siapakahaku[m.sender.split('@')[0]]
            }
         }
         break

         case 'susunkata': {
            const rewards = {
               limit: 15,
               uang: 30
            }
            if (susunkata.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Soal Yang Belum Terjawab!")
            const json = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json')
            const result = json[Math.floor(Math.random() * json.length)];
            conn.adReply(m.chat, `Silahkan Jawab Soal Di Atas Ini\n\nDeskripsi : ${result.soal}\n\nTipe ${result.tipe}\nWaktu : 60 Detik\nHadiah 🛍\n${rewards.limit} limit 🎟 dan ${rewards.uang} uang 💵`, "https://lh3.googleusercontent.com/o2SA5NGKG3hTljpBZMnAPG2T7qdhhCk6gvY1tnn1fIm9JvTqnrkIiCL6_FOptI9WpA", m).then(() => {
               susunkata[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
               console.log(susunkata);
            });
            await sleep(60000);
            if (susunkata.hasOwnProperty(m.sender.split('@')[0])) {
               console.log("Jawaban: " + result.jawaban)
               conn.adReply(m.chat, `📢 Waktu Habis\nJawaban: ${susunkata[m.sender.split('@')[0]]}`, setting.thumbnail, m);
               delete susunkata[m.sender.split('@')[0]]
            }
         }
         break

         case 'tebakbendera': {
            const rewards = {
               limit: 25,
               uang: 50
            }
            if (tebakbendera.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Soal Yang Belum Diselesaikan!");
            const anu = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera2.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.sendFile(m.chat, result.img, {
               caption: `*Silahkan Jawab Pertanyaan Berikut*\nWaktu : 1 menit\n\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `,
               quoted: m
            }).then(() => {
               tebakbendera[m.sender.split('@')[0]] = result.name.toLowerCase();
               console.log(tebakbendera);
            })
            await sleep(60000);
            if (tebakbendera.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tebakbendera[m.sender.split('@')[0]]}\n`, result.img, m);
               delete tebakbendera[m.sender.split('@')[0]]
            }
         }
         break

         case 'tebakgambar': {
            const rewards = {
               limit: 10,
               uang: 20
            };
            if (tebakgambar.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Soal Yang Belum Diselesaikan!")
            const results = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json')
            const result = results[Math.floor(Math.random() * results.length)];
            const ran = './tmp/' + Format.getRandom('.png');
            const out = './tmp/' + Format.getRandom('.webp');
            await fs.promises.writeFile(out, await toBuffer(result.img));
            exec(`ffmpeg -i ${out} ${ran}`, () => {
               const media = fs.readFileSync(ran);
               conn.sendFile(m.chat, media, {
                  caption: `Silahkan Jawab Soal Di Atas Ini\n\nDeskripsi : ${result.deskripsi}\nWaktu : 60 Detik\nHadiah 🎁 ${rewards.limit} limit dan ${rewards.uang} uang`,
                  quoted: m
               }).then(() => {
                  tebakgambar[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                  console.log(tebakgambar);
               })
            });
            await sleep(60000);
            if (tebakgambar.hasOwnProperty(m.sender.split('@')[0])) {
               console.log("Jawaban: " + result.jawaban)
               conn.adReply(m.chat, `Waktu Habis\nJawaban: ${tebakgambar[m.sender.split('@')[0]]}`, setting.thumbnail, m)
               delete tebakgambar[m.sender.split('@')[0]]
            }
         }
         break

         case 'tebakgame': {
            const rewards = {
               limit: 25,
               uang: 50
            }
            if (tebakgame.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Soal Yang Belum Diselesaikan!");
            const anu = await toJSON('https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.sendFile(m.chat, result.img, {
               caption: `*🎮 Tebak Game*\n*Silahkan Jawab Pertanyaan Berikut*\nWaktu : 1 menit\n\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `,
               quoted: m
            }).then(() => {
               tebakgame[m.sender.split('@')[0]] = result.jawaban.toLowerCase();
               console.log(tebakgame);
            })
            await sleep(60000);
            if (tebakgame.hasOwnProperty(m.sender.split('@')[0])) {
               await conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tebakgame[m.sender.split('@')[0]]}\n`, result.img, m);
               delete tebakgame[m.sender.split('@')[0]]
            }
         }
         break

         case 'tebakkalimat': {
            const rewards = {
               limit: 20,
               uang: 50
            }
            if (tebakkalimat.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            const anu = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkalimat.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.adReply(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 60 detik\nHadiah 🛍 \n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, 'https://files.catbox.moe/y21ty3.jpg', m).then(() => {
               tebakkalimat[m.sender.split('@')[0]] = result.jawaban.toLowerCase().trim();
               console.log(tebakkalimat);
            })
            await sleep(60000);
            if (tebakkalimat.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tebakkalimat[m.sender.split('@')[0]]}\n`, setting.thumbnail, m);
               delete tebakkalimat[m.sender.split('@')[0]]
            }
         }
         break

         case 'tebakkata':
         case 'teka': {
            const rewards = {
               limit: 20,
               uang: 40
            }
            if (tebakkata.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Soal Yang Belum Diselesaikan!");
            const anu = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.adReply(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n*${result.soal}*\n\nWaktu : 60 detik\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGef6IGK44lqaIIcestqDIbS9jG9Bs7McYmQ&usqp=CAU', m).then(() => {
               tebakkata[m.sender.split('@')[0]] = result.jawaban.toLowerCase();
               console.log(tebakkata);
            })
            await sleep(60000);
            if (tebakkata.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tebakkata[m.sender.split('@')[0]]}\n`, setting.thumbnail, m);
               delete tebakkata[m.sender.split('@')[0]]
            }
         }
         break

         case 'tebaktebakan':
         case 'tebakan': {
            const rewards = {
               limit: 10,
               uang: 35
            }
            if (tebaktebakan.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Soal Yang Belum Diselesaikan!");
            const anu = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.adReply(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n*${result.soal}*\n\nWaktu : 60 detik\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `, 'https://play-lh.googleusercontent.com/nfT7BqjO4xJiKTdZC7m3Lh7peoTyedG_7ZApHpMa64yoxhQsQ2kzltxwEC2lLaxhUg', m).then(() => {
               tebaktebakan[m.sender.split('@')[0]] = result.jawaban.toLowerCase();
               console.log(tebaktebakan);
            })
            await sleep(60000);
            if (tebaktebakan.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tebaktebakan[m.sender.split('@')[0]]}\n`, setting.thumbnail, m);
               delete tebaktebakan[m.sender.split('@')[0]];
               console.log(tebaktebakan);
            }
         }
         break

         case 'tekateki': {
            const rewards = {
               limit: 15,
               uang: 30
            }
            if (tekateki.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Soal Yang Belum Diselesaikan!");
            const anu = await toJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tekateki.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.adReply(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n*${result.soal}*\n\nWaktu : 60 detik\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `, 'https://www.my.wislah.com/wp-content/uploads/2023/08/Senarai-Teka-Teki.png', m).then(() => {
               tekateki[m.sender.split('@')[0]] = result.jawaban.toLowerCase();
               console.log(tekateki);
            })
            await sleep(60000);
            if (tekateki.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tekateki[m.sender.split('@')[0]]}\n`, setting.thumbnail, m);
               delete tekateki[m.sender.split('@')[0]];
            }
         }
         break

         case 'tictactoe':
         case 'ttt':
         case 'delttt': {
            if (command == 'tictactoe' || command == 'ttt') {
               if (Object.values(tictactoe).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return m.reply('Kamu masih didalam game')
               let room = Object.values(tictactoe).find(room => room.state === 'WAITING' && (text ? room.name === text : true));
               if (room) {
                  await m.reply('Partner ditemukan!')
                  room.o = m.chat
                  room.game.playerO = m.sender
                  room.state = 'PLAYING'
                  const arr = room.game.render().map(v => {
                     return {
                        X: '❌',
                        O: '⭕',
                        1: '1️⃣',
                        2: '2️⃣',
                        3: '3️⃣',
                        4: '4️⃣',
                        5: '5️⃣',
                        6: '6️⃣',
                        7: '7️⃣',
                        8: '8️⃣',
                        9: '9️⃣'
                     } [v]
                  });
                  const str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n\nMenunggu @${room.game.currentTurn.split('@')[0]}\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`
                  if (room.x !== room.o) await conn.sendText(room.x, str, m, {
                     mentions: m.isLid ? conn.parseMentionLid(str) : conn.parseMention(str)
                  });
                  await conn.sendText(room.o, str, m, {
                     mentions: m.isLid ? conn.parseMentionLid(str) : conn.parseMention(str)
                  });
               } else {
                  room = {
                     id: 'tictactoe-' + (+new Date),
                     x: m.chat,
                     o: '',
                     game: new TicTacToe(m.sender, 'o'),
                     state: 'WAITING'
                  }
                  if (text) room.name = text
                  tictactoe[room.id] = room
                  await m.reply(`Menunggu partner atau kamu bisa ajak member lain dengan mengetik ${prefix + command}` + (text ? ` mengetik command dibawah ini ${prefix}${command} ${text}` : ''))
               }
            } else if (command == 'delttt') {
               if (tictactoe) {
                  tictactoe = {}
                  conn.reply(m.chat, `Berhasil delete session TicTacToe`, m);
               }
            }
         }
         break

         case 'boom':
         case 'bomb': {
            const chat = m.chat;
            if (chat in boom) {
               return conn.reply(m.chat, '*☝sesi ini belum selesai !*', boom[chat][0]);
            }
            const board = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5);
            const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
            const boxes = board.map((emot, index) => ({
               emot: emot,
               number: numbers[index],
               position: index + 1,
               state: false,
               player: m.sender
            }));
            let text = '💣 *B O M B*\n\nKirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n';
            for (let i = 0; i < boxes.length; i += 3) {
               text += boxes.slice(i, i + 3).map(box => box.state ? box.emot : box.number).join('') + '\n';
            }
            text += '\nTimeout : [ *2 menit* ]\nApabila mendapat kotak yang berisi bom maka uang akan di kurangi.';
            let msg = await m.reply(text);
            let participant = msg.message.extendedTextMessage.contextInfo.participant;
            let {
               key
            } = msg;
            let bombBox;
            boom[chat] = [
               msg,
               boxes,
               setTimeout(() => {
                  bombBox = boxes.find(box => box.emot == '💥');
                  if (boom[chat]) {
                     conn.reply(m.chat, `*Waktu habis!*\nBom berada di kotak nomor ${bombBox.number}\nmain lagi .boom`, msg, {
                        contextInfo: {
                           mentionedJid: [participant]
                        }
                     });
                  }
                  delete boom[chat];
               }, 120000),
               key
            ];
         }
         break

         /** GROUP **/

         case 'absenstart': {
            if (!isAdmins) return m.reply('Hanya Admin Yang Dapat Memulai Absen');
            db.chats[m.chat].absen = true
            m.reply('Absen Di Mulai\nSekarang Member Bisa Absen Ketik .absen atau hadir');
         }
         break

         case 'absen': {
            if (!db.chats[m.chat].absen) return m.reply('absen belum di mulai perintahkan admin untuk memulai absen ketik .absenstart')
            if (db.chats[m.chat].absen_user.includes(m.sender)) return m.reply('kamu sudah absen ketik .cekabsen')
            db.chats[m.chat].absen_user.push(m.sender)
            db.chats[m.chat].absen_count += 1
            let caption = db.chats[m.chat].absen_text
            caption += `• ${m.pushName || ""} @${m.sender.split('@')[0]}\n`
            db.chats[m.chat].absen_text = caption
            conn.adReply(m.chat, zw + ` *ABSEN*\n\nketik .absen atau hadir\nuntuk mengakhiri absen ketik .tutupabsen\n\nTotal Hadir: ${db.chats[m.chat].absen_count}\n\n` + db.chats[m.chat].absen_text, 'https://qu.ax/WSojV.jpeg', m, {
               mentions: conn.parseMention(db.chats[m.chat].absen_text)
            })
         }
         break

         case 'tutupabsen':
         case 'hapusabsen': {
            if (!isAdmins) return m.reply('Hanya Admin Yang Dapat Menghapus Absen');
            db.chats[m.chat].absen = false
            db.chats[m.chat].absen_count = 0
            db.chats[m.chat].absen_user = []
            db.chats[m.chat].absen_text = ''
            m.reply('Sukses Mengakhiri Absen')
         }
         break

         case 'cekabsen': {
            conn.adReply(m.chat, zw + ` *ABSEN*\n\nketik .absen atau hadir\nuntuk mengakhiri absen ketik .tutupabsen\n\nTotal Hadir: ${db.chats[m.chat].absen_count}\n\n` + db.chats[m.chat].absen_text, 'https://qu.ax/WSojV.jpeg', m, {
               mentions: conn.parseMention(db.chats[m.chat].absen_text)
            })
         }
         break

         case 'ht':
         case 'h':
         case 'hidetag': {
            if (!isAdm()) return
            let mem = [];
            participants.map(i => mem.push(i.id))
            conn.adReply(m.chat, m?.quoted?.text ? m?.quoted?.text : text ? text : '', cover, m, {
               showAds: true,
               mentions: mem
            })
         }
         break

         case 'infogc':
         case 'infogroup': {
            let Info = ` ${javi} *INFO GROUP* ${javi}\n`
            Info += ` ??? *ID:* ${m.chat}\n`
            Info += ` ??? *Nama Grup:* ${groupName}\n`
            Info += ` ??? *Total Member:* ${participants.length}\n`
            Info += ` ??? *Total Admin:* ${groupAdmins.length}`
            conn.adReply(m.chat, Info, cover, m);
         }
         break

         case 'kick':
         case 'tendang':
         case '-':
         case 'dor': {
            if (!isAdm()) return
            if (m?.quoted) {
               await conn.groupParticipantsUpdate(m.chat, [m.quoted.sender], "remove");
               return m.reply(`Berhasil Menghapus @${m.quoted.sender.split("@")[0]} Dari Grup Ini`, {
                  mentions: [m.quoted.sender]
               });
            } else if (text) {
               const user = conn.parseMention(text);
               await conn.groupParticipantsUpdate(m.chat, [...user], "remove");
               return m.reply(`Berhasil Menghapus @${user[0].split("@")[0]} Dari Grup Ini`, {
                  mentions: [...user]
               });
            } else {
               return m.reply(`Tag atau Balas Orangnya Yang Mau Di Keluarkan`);
            }
         }
         break

         case 'kickall':
         case 'bubar': {
            if (!isAdm()) return
            return await Format.kickall(m, conn, participants), m.reply('Done');
         }
         break

         case 'linkgc':
         case 'link':
         case 'linkgroup': {
            let url = await conn.groupInviteCode(m.chat)
            if (!url) return
            if (url) {
               url = 'https://chat.whatsapp.com/' + url;
               return m.reply(`Link Group ${groupName}\n${url}`);
            }
         }
         break

         case 'mute': {
            if (!isGroup()) return
            if (!isAdm()) return
            db.chats[m.chat].mute = true
            m.reply('Berhasil mute di chat ini');
         }
         break

         case 'unmute': {
            if (!isGroup()) return
            if (!isAdm()) return
            db.chats[m.chat].mute = false
            m.reply('Berhasil unmute di chat ini');
         }
         break

         case 'muteall': {
            if (!isOwner) return m.reply(mess.owner);
            for await (let i of Object.keys(db.chats)) {
               if (i == 'community') continue
               db.chats[i].mute = true
            }
            m.reply('Berhasil mute ke semua group');
         }
         break

         case 'unmuteall': {
            if (!isOwner) return m.reply(mess.owner);
            for await (let i of Object.keys(db.chats)) {
               if (i == 'community') continue
               db.chats[i].mute = false
            }
            m.reply('Berhasil unmute semua group');
         }
         break

         case 'groupoff':
         case 'tutup': {
            if (!isGroup()) return
            if (!isAdm()) return
            await conn.groupSettingUpdate(m.chat, "announcement");
            m.reply(`Group Telah Di Tutup\nSemua Anggota Tidak Dapat Mengirim Pesan\nAdmin Kontol`);
         }
         break

         case 'groupon':
         case 'buka': {
            if (!isGroup()) return
            if (!isAdm()) return
            await conn.groupSettingUpdate(m.chat, "not_announcement");
            m.reply(`Group Telah Di Buka\nSemua Anggota Dapat Mengirim Pesan`);
         }
         break

         case 'jadiadmin':
         case 'promote': {
            if (!isGroup()) return
            if (!isAdm()) return
            if (m?.quoted) {
               await conn.groupParticipantsUpdate(m.chat, [m.quoted.sender], "promote");
               return m.reply(`Sekarang @${m.quoted.sender.split("@")[0]} Jadi Admin`, {
                  mentions: [m.quoted.sender]
               });
            } else if (text) {
               const user = conn.parseMention(text);
               await conn.groupParticipantsUpdate(m.chat, [...user], "promote");
               return m.reply(`Sekarang @${user[0].split("@")[0]} Jadi Admin`, {
                  mentions: [...user]
               });
            } else {
               return m.reply(`Tag atau Balas Orangnya Yang Mau Di Promote`);
            }
         }
         break

         case 'demote':
         case 'dmt': {
            if (!isGroup()) return
            if (!isAdm()) return
            if (m?.quoted) {
               await conn.groupParticipantsUpdate(m.chat, [m.quoted.sender], "demote");
               return m.reply(`Sekarang @${m.quoted.sender.split("@")[0]} Tidak Lagi Jadi Admin`, {
                  mentions: [m.quoted.sender]
               });
            } else if (text) {
               const user = conn.parseMention(text);
               await conn.groupParticipantsUpdate(m.chat, [...user], "demote");
               return m.reply(`Sekarang @${user[0].split("@")[0]} Tidak Lagi Jadi Admin`, {
                  mentions: [...user]
               });
            } else {
               return m.reply(`Tag atau Balas Orangnya Yang Mau Di Demote Atau Di Berhentikan Jadi Admin`);
            }
         }
         break

         case 'resetlink':
         case 'revoke': {
            if (!isGroup()) return
            if (!isAdm()) return
            await conn.groupRevokeInvite(m.chat)
            m.reply(`Sukses`)
         }
         break

         case 'setwelcome': {
            if (!isGroup()) return
            if (!isAdm()) return
            if (!text) return m.reply(`Masukan Text Welcome nya! \n\nContoh:\n${prefix + command} Hey Selamat Datang Babi %user\nDi Group %subject \nBaca Deskripsi Yah \n\n%subject adalah Nama Group \n%user adalah tag ke nomor member nya`)
            db.chats[m.chat].welcomeCaption = text
            m.reply(`Caption Welcome Berhasil Di Ganti Di Group ${groupName}`);
         }
         break

         case 'setbye': {
            if (!isGroup()) return
            if (!isAdm()) return
            if (!text) return m.reply(`Masukan Text Bye nya! \n\nContoh:\n${prefix + command} Beban Group %user\nTelah Keluar Dari %subject \nSemoga ... \n\n%subject adalah Nama Group \n%user adalah tag ke nomor member nya`)
            db.chats[m.chat].byeCaption = text
            m.reply(`Caption Bye Berhasil Di Ganti Di Group ${groupName}`);
         }
         break

         case 'setdescgc': {
            if (!isGroup()) return
            if (!isAdm()) return
            if (text) {
               await conn.groupUpdateDescription(m.chat, text);
               m.reply(`Deskripsi Group Telah Di Ubah Menjadi ${text}`);
            } else {
               return m.reply(`Masukan deskripsi group nya contoh: \n${prefix + command} Rules My Group`);
            }
         }
         break

         case 'setnamegc':
         case 'setnamegroup': {
            if (!isGroup()) return
            if (!isAdm()) return
            if (text) {
               await conn.groupUpdateSubject(m.chat, text);
               m.reply(`Nama Group Telah Di Ubah Menjadi ${text}`);
            } else {
               return m.reply(`Masukan nama group nya contoh: \n${prefix + command} My Group`);
            }
         }
         break

         case 'setppgc':
         case 'setppgroup': {
            if (!isGroup()) return
            if (!isAdm()) return
            if (/image/.test(mime) || m.mtype === 'imageMessage') {
               try {
                  const media = await quoted.download()
                  m.react('😆'), await updateProfilePicture(conn, m.chat, media);
                  return m.reply(`Sukses mengganti Foto Profile Group`)
               } catch (e) {
                  console.log(e)
                  return m.reply(`Terjadi kesalahan, coba lagi nanti\n${e}`)
               }
            } else {
               return m.reply(`Kirim gambar dengan caption *${prefix + command}* atau tag gambar yang sudah dikirim`)
            }
         }
         break

         case 'tagsw': {
            if (!isGroup()) return
            if (!isAdm()) return
            m.reply(loading)
            let options;
            if (/extended|conversation/.test(mime)) {
               options = {
                  text: text ? text : m?.quoted ? m.quoted.text : m.text
               }
            } else if (/audio/.test(mime)) {
               options = {
                  audio: await Format.mp3(await quoted.download()),
                  ...opus
               }
            } else if (/video/.test(mime)) {
               const tmp = await conn.download(quoted);
               const video = await Format.chunks(tmp);
               for (let i = 0; i < video.length; i++) {
                  const videoFile = await fs.promises.readFile(video[i]);
                  options = {
                     video: videoFile,
                     caption: text ? text : m?.quoted ? m.quoted.text : m.text
                  }
                  await conn.sendTagStatusGroup(conn, m.chat, m, options);
               };
               return m.reply('Done');
            } else if (/image/.test(mime)) {
               options = {
                  image: await toBuffer(await conn.download(quoted)),
                  caption: text ? text : m?.quoted ? m.quoted.text : m.text
               }
            }
            await conn.sendTagStatusGroup(conn, m.chat, m, options);
            m.reply('Done');
         }
         break

         case 'tagall': {
            if (!isGroup()) return
            if (!isAdm()) return
            let teks_tagall = `??? *Tag All* ???\n\nDi Perintahkan Oleh\n@${m.sender.split('@')[0]}\n\nKata Dia\n${text ? text : ''}\n\n`;
            let mem = [];
            participants.map(i => mem.push(i.id))
            for (let mem of participants) {
               teks_tagall += `??? @${mem.id.split('@')[0]}\n`;
            }
            await conn.adReply(m.chat, teks_tagall, cover, m, {
               showAds: true,
               mentions: mem
            })
         }
         break

         /** INFO **/
         case 'user':
         case 'totaluser': {
            const user = Object.keys(db.users).length;
            const user_reg = Object.entries(db.users).filter(user => user[1].registered);
            const registered = user_reg.map(([jid, user]) => jid);
            const caption = `Total user: ${user} pengguna\nTotal terdaftar: ${registered.length} pengguna`;
            conn.adReply(m.chat, caption, cover, m);
         }
         break

         case 'totalgroup':
         case 'totalgc':
         case 'listpc':
         case 'listgc': {
            m.reply(`Obtaining data please wait \n${text.includes('--desc') ? '' : 'use --desc to see description (optional)'}\nMaybe this takes a long time ...`);
            let group = Object.keys(db.chats);
            let count = 0;
            let caption = '';
            for await (let i of group) {
               try {
                  if (i === 'community') continue
                  const accept = await conn.groupMetadata(i);
                  if (!accept) continue
                  count += 1
               } catch {
                  if (i !== 'community') delete db.chats[i]
                  await Format.sleep(5000)
               }
            };
            let teks_gc = `*Total Data Chat ${setting.botName}*\nTotal Group: ${count} group\n\n`
            for await (let i of Object.keys(db.chats)) {
               if (i === 'community') continue
               const data = await conn.groupMetadata(i)
               const nama = data.subject
               const desc = data.desc || 'No Description'
               teks_gc += `*ID:* ${i}\n*Name:* ${nama}\n${text.includes('--desc') && isOwner ? `*Description:* ${desc}` : ''}\n\n`
            };
            const pc = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v.id)
            let teks_pc = `*List Personal Chat*\nTotal Chat : ${pc.length} Chat\n\n`
            for (let i of pc) {
               const pesan = (await store.chats.all().filter(v => v.id === i)[0]).unreadCount
               const nama = store.messages[i].array[0].pushName
               teks_pc += `*User :* @${i.split('@')[0]}\n*Number :* +${i.split('@')[0]}\n*Total Pesan :* ${pesan + pesan} pesan\n\n`
            }
            caption += teks_gc
            caption += teks_pc
            conn.adReply(m.chat, caption.trim(), cover, m, {
               mentions: conn.parseMention(caption)
            });
         }
         break

         case 'fitur':
         case 'totalfitur': {
            const fitur = await Format.totalFitur();
            const caption = `Total Fitur ${setting.botName} saat ini adalah ${fitur} Fitur`;
            conn.adReply(m.chat, caption, cover, m);
         }
         break

         case 'speedtest':
         case 'speed': {
            m.reply('*Testing Speed...*')
            await exec('python3 lib/speed.py', async (x, y) => {
               const result = await format(y)
               await conn.reply(m.chat, result, m)
            })
         }
         break

         case 'script':
         case 'sc':
         case 'repo': {
            const script = 'Menggunakan Base Script Ini \n\nhttps://github.com/ruhend/maleficent\n\nhttps://github.com/ruhend/kumpulan-lagu/archive/refs/heads/main.zip'
            conn.adReply(m.chat, script, cover, m);
         }
         break

         case 'listpremium':
         case 'listprem': {
            if (!isOwn()) return
            let users = Object.entries(db.users).filter(user => user[1].premiumTime);
            let premiumUsers = users.map(([jid, user]) => {
               return {
                  jid: jid,
                  reason: user.premiumTime || ''
               };
            });
            let premiumList = premiumUsers.map(user => `${user.jid.split('@')[0]}\nPremium Sampai: ${user.reason}`).join('\n');
            let text = `Berikut Adalah List Pengguna Premium ${setting.botName}\n`;
            text += `Total : ${premiumUsers.length}\n`;
            text += `User: ${premiumList ? '\n' + premiumList : ''}`;
            conn.adReply(m.chat, text, cover, m);
         }
         break

         case 'ping':
         case 'runtime':
         case 'uptime':
         case 'rt':
         case 'p': {
            const {
               latensi,
               oldd,
               neww,
               response,
               muptime,
               sessions
            } = await Format.System();
            const {
               Upload,
               Download
            } = await Format.statistic();
            let runtime = `⚡ Kecepatan TV : \n`
            runtime += `${latensi.toFixed(4)} _Second_\n`
            runtime += `${oldd - neww} _miliseconds_\n\n`
            runtime += `🌐 Statistic Usage Network Bot :\n📤  Upload: ${Upload}\n📥  Download: ${Download}\n📂  Sessions: ${sessions}\n\n`
            runtime += `🟢 Bot Aktif Selama :\n`
            runtime += `${muptime}\n`
            runtime += `${response}`
            m.reply(runtime)
         }
         break

         case 'listafk': {
            const afk = Object.entries(db.users).filter(v => {
               const user = v[1].afkTime == -1
               const data = !user
               return data
            });
            const clockString = (ms) => {
               let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
               let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
               let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
               let toString = [`*${h} Jam*`, `*${m} Menit*`, `*${s} Detik*`].map(v => v.toString().padStart(2, 0)).join(': ')
               return `${toString}`
            };
            const users = afk.map(([jid, user]) => {
               return {
                  jid: jid,
                  name: user.name,
                  timeAfk: clockString(new Date() - db.users[jid].afkTime),
                  reason: user.afkReason
               };
            });
            const data = users.map(user => `• ${user.name}\n Nomor: @${user.jid.split('@')[0]}\n AFK Selama:\n ${user.timeAfk}\n Alasan: ${user.reason}\n`).join('\n');
            const jid = conn.parseMentionLid(data);
            const teks = ` *List User AFK*\n *${setting.botName}*\n\n${data.trim()}`
            conn.adReply(m.chat, teks, cover, m, {
               mentions: jid
            })
         }
         break

         case 'idgc':
         case 'id':
            m.reply(m.chat)
            break

         case 'listbanned':
         case 'listban': {
            let users = Object.entries(db.users).filter(user => user[1].banned);
            let bannedUsers = users.map(([jid, user]) => {
               return {
                  jid: jid,
                  name: user.name,
                  reason: user.bannedReason || 'Tidak ada alasan'
               };
            });
            let bannedList = bannedUsers.map(user => `Nomor: *${user.jid.split('@')[0]}*\nName: ${user.name || ''}\nAlasan Di Ban: ${user.reason}`).join('\n');
            let text2 = `Berikut Adalah List Pengguna Terbanned ${setting.botName}\n`;
            text2 += `Total : ${bannedUsers.length}\n`;
            text2 += `User: ${bannedList ? '\n' + bannedList : 'Tidak ada pengguna terbanned.'}`;
            conn.adReply(m.chat, text2, cover, m);
         }
         break

         case 'statusbot':
         case 'status': {
            const Y = 'Aktif 🟢'
            const T = 'Tidak Aktif 🔴'
            let caption = `*${zw} STATUS BOT 🤖*\n${setting.botName}\n${conn.authState.creds.me.name}\n\n`
            caption += `Cloud DB: ${global.backup_mongo || global.backup_github || global.backup_gitlab || global.backup_supabase ? Y : T}\n`
            caption += `${global?.backup_mongo ? 'Monggo DB = Aktif ✅' : 'Monggo DB = Tidak Aktif ❎'}\n`
            caption += `${global?.backup_github ? 'Github DB = Aktif ✅' : 'Github DB = Tidak Aktif ❎'}\n`
            caption += `${global?.backup_gitlab ? 'Gitlab DB = Aktif ✅' : 'Gitlab DB = Tidak Aktif ❎'}\n`
            caption += `${global?.backup_supabase ? 'Supabase DB = Aktif ✅' : 'Supabase DB = Tidak Aktif ❎'}\n\n`
            caption += `Self: ${global.self ? Y : T}\n`
            caption += `Auto Download: ${db.settings.auto_down ? Y : T}\n`
            caption += `Auto Read Story: ${db.settings.readsw ? Y : T}\n`
            caption += `Auto React Story: ${db.settings.reactsw ? Y : T}\n`
            caption += `Anti Call: ${global.anticall ? Y : T}\n`
            caption += `Auto Block PC: ${db.settings.block_pc ? Y : T}\n`
            caption += `Auto Clear Chat: ${db.settings.auto_clear_chat ? Y : T}\n`
            caption += `Group Mode: ${global.group_mode ? Y : T}\n`
            caption += `Mess Group Only: ${global.group_only_message ? Y : T}\n`
            caption += `Mystery Box: ${global.mystery_box ? Y : T}\n`
            caption += `AdReply: ${global.adReply ? Y : T}\n`
            caption += `Use Limit Message: ${global.use_limit_message ? Y : T}\n`
            caption += `Limit AdReply: ${global.limit_adReply ? Y : T}\n`
            caption += `Read Group: ${global.read_group ? Y : T}\n`
            caption += `Read Private: ${global.read_private ? Y : T}\n`
            caption += `Typing Group: ${global.typing_group ? Y : T}\n`
            caption += `Typing Private: ${global.typing_private ? Y : T}\n`
            caption += `Recording Group: ${global.recording_group ? Y : T}\n`
            caption += `Recording Private: ${global.recording_private ? Y : T}\n`
            caption += `Jadibot: ${global.jadibot_engine ? Y : T}\nEngine ${global.jadibot_engine_version ? global.jadibot_engine_version : ''}\n\n`
            caption += `Ram Set: ${setting.ram}\n`
            caption += `Prefix: ${db.settings.prefix == 'multi' ? 'multi (tanpa prefix)' : 'single (perlu prefix)'}\n\n`
            caption += `Untuk mengubah pengaturan langsung dari bot owner bisa cek di menu .set atau ada juga di menu .on .off`
            const {
               key
            } = await conn.reply(m.chat, caption, m)
            if (!isOwner) return await sleep(3000), m.delete(key);
         }
         break

         /** INTERNET **/
         case 'fetch':
         case 'get': {
            if (!isLimit()) return
            if (!text) return m.reply(`masukan link atau url \ncontoh: ${prefix+command} https://www.google.com`);
            if (!text.match(/http|https/g)) return m.reply(`link salah awali dengan http atau https`);
            m.reply(loading)
            await Format.getFetch(conn, text, m);
            useLimit(2)
         }
         break

         case 'ai':
         case 'gpt':
         case 'chatgpt':
         case 'openai': {
            if (!isLimit()) return
            if (!text) return m.reply(`contoh ${prefix+command} apa kabar?`);
            m.react('🕐')
            const data = await Scraper.gpt(text);
            await conn.reply(m.chat, data, m);
            useLimit(2)
         }
         break

         /** ISLAM **/
         case 'adzan': {
            const adzan = `
Arab:

(٢x) اَللهُ اَكْبَرُ،اَللهُ اَكْبَرُ
(٢x) أَشْهَدُ اَنْ لاَ إِلٰهَ إِلَّااللهُ
(٢x) اَشْهَدُ اَنَّ مُحَمَّدًا رَسُوْلُ اللهِ
(٢x) حَيَّ عَلَى الصَّلاَةِ
(٢x) حَيَّ عَلَى الْفَلاَحِ
(١x) اَللهُ اَكْبَرُ ،اَللهُ اَكْبَرُ
(١x) لَا إِلَهَ إِلَّااللهُ

Latin:

Allaahu Akbar, Allaahu Akbar (2x)
Asyhadu allaa illaaha illallaah. (2x)
Asyhadu anna Muhammadar rasuulullah. (2x)
Hayya 'alashshalaah (2x)
Hayya 'alalfalaah. (2x)
Allaahu Akbar, Allaahu Akbar (1x)
Laa ilaaha illallaah (1x)

Artinya :

Allah Maha Besar, Allah Maha Besar
Aku menyaksikan bahwa tiada Tuhan selain Allah
Aku menyaksikan bahwa nabi Muhammad itu adalah utusan Allah
Marilah Sholat
Marilah menuju kepada kejayaan
Allah Maha Besar, Allah Maha Besar
Tiada Tuhan selain Allah

Kemudian, untuk lafadz adzan subuh ada kalimat yang ditambahkan, yakni

Arab: اَلصَّلاَةُ خَيْرٌ مِنَ النَّوْمِ

Latin: Ash-shalaatu khairum minan-nauum

Artinya: Sholat itu lebih baik dari pada tidur

dan dibaca 2x setelah lafadz Hayya 'alalfalaah

Nah, semoga kita semua bisa memaknai lafadz adzan dengan betul ya!
`
            conn.adReply(m.chat, adzan, cover, m);
         }
         break

         case 'bacaansholat': {
            const bacaansholat = `
1. Takhbiratul ikhram

*Allâhu Akbar*

2. Iftitah

*Allaahu akbar Kabiroo Walhamdulillaahi Katsiiraa, Wa Subhaanallaahi Bukratan Wa'ashiilaa, Innii Wajjahtu Wajhiya Lilladzii Fatharas Samaawaati Wal Ardha Haniifan Musliman Wamaa Anaa Minal Musyrikiin. Inna Shalaatii Wa Nusukii Wa Mahyaaya Wa Mamaatii Lillaahi Rabbil 'Aalamiina. Laa Syariikalahu Wa Bidzaalika Umirtu Wa Ana Minal Muslimiin*

3. Ruku

*Subhana rabbiyal adhimi wa bihamdihi* 3x

4. I-tidal berdiri setelah Ruku

*Sami allahu liman hamidah*

5. Sujud

*Subhana rabbiyal a-laa wa bi hamdih*

6. Duduk di antara dua sujud 

*Rabighfirlii, Warhamnii, Wajburnii, Warfa'ni, Warzuqnii, Wahdini, Wa'aafinii, Wa'fuannii*

7. Membaca Tasyahud awal

*Attahiyyaatul mubaarakaatush shalawaatuth thoyyibaatulillaah. Assalaamu•alaika ayyuhan nabiyyu warahmatullaahi wabarakaatuh, Assalaamu•alaina waalaa ibaadillaahishaalihiin. Asyhaduallaa ilaaha illallaah, wa asyhadu anna Muhammad Rasuulullaah. Allahumma shalli •alaa sayyidinaa muhammad*

8. Membaca Tasyahud Akhir

*Attahiyyaatul mubaarakaatush shalawaatuth thoyyibaatulillaah. Assalaamu•alaika ayyuhan nabiyyu warahmatullaahi wabarakaatuh, Assalaamu•alaina waalaa ibaadillaahishaalihiin. Asyhaduallaa ilaaha illallaah, wa asyhadu anna Muhammad Rasuulullaah. Allahumma shalli •alaa sayyidinaa muhammad Wa alaa aali sayyidina muhammad. Kamaa shallaita 'alaa sayyidinaa Ibraahim wa'alaa aali sayyidinaa ibraahim wabaarik 'alaa sayyidinaa muhammad wa 'alaa aali sayyidina muhammad. Kamaa baarakta 'alaa sayyidinaa ibraahiim wa 'alaa aali sayyidina Ibraahiim fil•aalamiina innaka hamiidum majiid*

9. salam

*Assalaamu alaikum wa rahmatullah* 2x kanan kiri
`
            conn.adReply(m.chat, bacaansholat, cover, m);
         }
         break

         case 'mandiwajib':
         case 'mandijunub': {
            const text = ` Tata Cara Mandi Wajib Laki-laki
Mengacu pada sumber yang sama, berikut merupakan langkah-langkah melaksanakan mandi wajib laki-laki sesuai dengan sunnah.

1. Melafalkan niat mandi wajib, berikut bacaannya:
نَوَيْتُ الْغُسْلَ لِرَفْعِ اْلحَدَثِ اْلأَكْبَرِ مِنَ اْلِجنَابَةِ فَرْضًا لِلهِ تَعَالَى

"Nawaitul-ghusla lirafil ḫadatsil-akbari fardlan lillâhi ta'ala"

 Atau

"Nawaitul-ghusla lirafil ḫadatsil-akbari minal-jinâbati fardlan lillâhi ta'ala"

Artinya: "Aku berniat mandi besar untuk menghilangkan hadats besar fardhu karena Allah ta'ala,"

2. Membersihkan telapak tangan sebanyak tiga kali
3. Membersihkan kotoran tersembunyi dengan menggunakan tangan kiri, seperti kemaluan, dubur, bawah ketiak, pusar, dan lain sebagainya
4. Mencuci tangan dengan cara menggosokkan ke sabun atau tanah
5. Berwudhu seperti akan melaksanakan sholat
6. Sela pangkal rambut menggunakan jari-jari tangan yang telah dibasuh air hingga menyentuh kulit kepala
7. Membasuh seluruh tubuh dengan air yang dimulai dari sisi kanan, lalu ke sisi kiri
8. Memastikan seluruh lipatan kulit serta bagian yang tersembunyi ikut dibersihkan
`
            conn.adReply(m.chat, text, cover, m);
         }
         break

         case 'niatsholat': {
            const niatsholat = ` 
*Niat Sholat*

1. *Niat Sholat Subuh*
اُصَلِّى فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhosh shubhi rok'ataini mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu Shubuh dua raka'at menghadap kiblat karena Allah Ta'ala

2. *Niat Sholat Dzuhur*
اُصَلِّى فَرْضَ الظُّهْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhodl dhuhri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu Dzuhur empat raka'at menghadap kiblat karena Allah Ta'ala

3. *Niat Sholat Ashar*
اُصَلِّى فَرْضَ الْعَصْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhol 'ashri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu 'Ashar empat raka'at menghadap kiblat karena Allah Ta'ala

4. *Niat Sholat Maghrib*
اُصَلِّى فَرْضَ الْمَغْرِبِ ثَلاَثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhol maghribi tsalaata raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu Maghrib tiga raka'at menghadap kiblat karena Allah Ta'ala

5. *Niat Sholat Isya*
اُصَلِّى فَرْضَ الْعِشَاءِ اَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhol 'isyaa-i arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu Isya empat raka'at menghadap kiblat karena Allah Ta'ala

_Suatu ibadah akan diterima bila memenuhi dua hal, yaitu niat dan contoh dari rasulullah saw:_
*_"إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ ...[رواه البخاري ومسلم]رَ"_*

Artinya: *_Sesungguhnya (sahnya) amal itu tergantung kepada niat ... [Hadits Riwayat al-Bukhari dan Muslim]_*
`
            conn.adReply(m.chat, niatsholat, cover, m);
         }
         break

         case 'solatjumat':
         case 'sojum': {
            const sojum = `Apakah solat Jumaat?
Solat jumaat adalah solat fardhu, dua rakaat yang dilakukan pada hari Jumaat untuk menggantikan solat Zuhur. Niat solat jumaat juga berbeza dengan solat fardhu yang lain. Ia haruslah dilakukan secara berjemaah selepas mendengar khutbah Jumaat.

*Syarat wajib solat Jumat*
Islam – tidak wajib bagi orang kafir
Baligh – tidak wajib bagi kanak-kanak belum baligh
Berakal – tidak wajib bagi orang yang gila
Merdeka – tidak wajib ke atas hamba abdi
Lelaki – tidak diwajibkan berjemaah untuk orang perempuan
Sihat – tidak wajib berjemaah bagi orang yang uzur, dan berhalangan
Bermastautin atau bermukim – tidak wajib berjemaah bagi orang yang musafir

*Syarat sah solat Jumat*
- Didirikan di dalam waktu Zuhur
- Tempat mendirikan solat Jumaat itu mestilah di suatu tempat yang telah ditetapkan seperti masjid, dewan, padang, dan sebagainya
- Mestilah berjemaah dengan sekurang-kurangnya 40 orang yang beriman yang tinggal di kawasan itu
- Didahului dengan dua khutbah

*"Usolli fardol jum'ati rak'ataini makmuman lillahi taala"*

`
            conn.adReply(m.chat, sojum, 'https://akuislam.com/wp-content/uploads/2023/01/Niat-Solat-Jumaat@2x-768x321.png', m);
         }
         break

         /** MAIN **/
         case 'hapustoko':
         case 'deltoko': {
            if (!isOwn()) return
            if (!text) return m.reply(`Masukkan nama toko yang ingin dihapus.\nContoh: ${prefix + command} nama toko\nContoh: ${prefix + command} toko1\n\nDaftar toko yang ada:\n${Object.keys(db.stores)}`.trim())
            let toko = text.trim();
            delete db.stores[toko]
            m.reply(`Berhasil menghapus toko dan dagangan yang ada di ${toko}`);
         }
         break

         case 'addtoko':
         case 'addlist': {
            if (!isOwn()) return
            if (!text) return m.reply(`Masukkan dagangan ke toko.\ncontoh ${prefix + command} nama toko item\n\nContoh :\n${prefix + command} toko1(spasi)Judul enter dan text Nya \n${prefix + command} toko2 Judul dan listnya\ntextnya \ndan seterusnya\n contoh \n.addtoko toko1 1.List Panel enter\n- Panel Ram 1GB 1000 \n- Panel Ram 2GB 2000\ndan seterusnya...\nnama toko bisa bebas`);
            let [toko, ...items] = text.split(" ");
            if (!items.length) return m.reply(`Masukkan item yang ingin ditambahkan ke ${toko}`);
            let item = items.join(" ");
            db.stores[toko] = item;
            m.reply(`Berhasil memasukkan ${item} \nke ${toko}`);
         }
         break

         case 'toko':
         case 'shop': {
            const toko = global.db.stores;
            const shops = Object.values(toko);
            let caption = `List Toko atau Dagangan\n${setting.botName}\n\n`;
            if (shops.length === 0) {
               caption += `Tidak Ada Dagangan Di Toko.\nSilahkan tambahkan toko dengan mengetik ${prefix}addtoko`;
            } else {
               shops.forEach(shop => {
                  if (shop) {
                     caption += `${shop}\n\n`;
                  }
               });
            }
            conn.adReply(m.chat, caption.trim(), cover, m, {
               showAds: true
            });
         }
         break

         case 'ya':
         case 'y': {
            conn.adReply(m.chat, 'Silahkan Ketik .menu', cover, m)
         }
         break

         case 'harga':
         case 'premium':
         case 'sewa':
         case 'sewabot': {
            let price = `*📑 List Harga Premium & Sewa* \n ${setting.botName}\n\n`
            price += `*🎗 Price Limit & Akses Premium*\n`
            price += `• Rp 1.000 (+1000) limit\n`
            price += `• Rp 3.000 (+5000) limit\n`
            price += `• Rp 8.000 (+10000) limit\n`
            price += `• Rp 10.000 (+15000) limit\n\n`
            price += `✅ *_priority your database will keep until time has run out_* \n*_Bilang Ke Owner Jika Ingin Memperpanjang agar database kamu di keep dengan aman_*\n`
            let sewa = `*🎭 Akses Bot Join Group* \n*+ Bonus limit untuk penyewa*\n\n`
            sewa += `• 1 minggu Rp 3.000 bonus +1000 limit (1 Group)\n`
            sewa += `• 2 minggu Rp 6.000 bonus +2000 limit (2 Groups Maximal)\n`
            sewa += `• 3 minggu Rp 10.000 bonus +5000 limit (3 Groups Maximal)\n`
            sewa += `• 4 minggu Rp 12.000 bonus +10000 limit++ (5 Groups Maximal)\n\n`
            let hub = `*📢 Hubungi Owner* \n@${setting.contact}\n`
            conn.adReply(m.chat, price + '\n' + sewa + hub, cover, m, {
               mentions: [`${setting.contact}@s.whatsapp.net`]
            })
         }
         break

         case 'sendpoll':
         case 'poll': {
            const poll = ['ya', 'tes']
            conn.sendPoll(m.chat, 'Ini adalah contoh poll', poll, m)
         }
         break

         case 'menu':
         case 'help':
         case 'allmenu':
         case 'command':
         case 'm':
         case 'all':
         case 'meni': {
            const garis = ''
            const side = ''
            const top = ''
            const bot = ''
            const title = `${setting.botName}\n${setting.footer}`
            const music = 'https://files.catbox.moe/eqcyi3.opus'
            const lolim = logo_limit || 'Ⓛ';
            const loprem = logo_premium || 'Ⓟ';
            const select = 'SELECT HERE';
            const header_sub = `LIST MENU`;
            const header = `┌────`;
            const middle = `│`;
            const pointer = `⭓`;
            const bottom = `└──────────⭓\n`
            const left = `『`;
            const right = `』`;
            const bigHeader = false;
            const type = db.settings.menu_type;
            const top_1 = {
               left,
               right,
               bigHeader,
               text,
               header_sub,
               select,
               type,
               command,
               conn
            };
            const {
               Upload,
               Download
            } = await Format.statistic();
            const audio = async () => conn.sendFile(m.chat, await Format.mp3(await toBuffer(music)), '', m, {
               ...opus,
               fileLength: 5240
            });
            let info = `${top}${garis}${side} ${star} Menu ${setting.botName}\n${side} Simple WhatsApp Bot \n${side} By ${setting.footer}\n${side}${garis}\n`;
            info += `${side} 👋 Selamat ${waktu.suasana.charAt(0).toUpperCase() + waktu.suasana.slice(1)} Bangsat\n${side} @${m.sender.split('@')[0]} 🐽\n`;
            info += `${side} Total Penggunaan Perintah‎\n${side} Bot Kamu: ${db.users[m.sender].hitCmd} Kali\n${side}${garis}\n`;
            info += `${side} Owner: +${setting.contact}\n\n`;
            info += `${side} Network Bot Usage :\n${side} 📥 Download: ${Download}\n${side} 📤 Upload: ${Upload}\n${side}${garis}\n`;
            info += `${side} ${lolim} = Limit \n${side} ${loprem} = Premium\n${bot}${garis}`
            if (type === 1) {
               await m.react('🐽');
               //  const all_menu = await Format.Menu(header, middle, pointer, bottom, prefix, top_1);
               //  await conn.adReply(m.chat, `${info}\n${all_menu}`, cover, m), audio();
               const menuBody = await Menu(prefix, command, text);
               await conn.adReply(m.chat, `${info}\n${menuBody}`, cover, m);
               audio();
            } else if (type === 2) {            
               await m.react('🖕');
               //   const sub_menu = await Format.Menu(header, middle, pointer, bottom, prefix, top_1);
               // await conn.adReply(m.chat, `${info}\n${sub_menu}`, cover, m), audio();
               const menuBody = await Menu(prefix, command, text);
               await conn.adReply(m.chat, `${info}\n${menuBody}`, cover, m);
               audio();
            } else if (type === 3) {
               m.react('🥶');
               const opts = [{
                     title: 'Jadibot',
                     id: '.jadibot'
                  },
                  {
                     title: 'Owner',
                     id: '.owner'
                  },
                  {
                     title: 'Sewa',
                     id: '.sewa'
                  },
                  {
                     title: 'Source Code',
                     id: '.sc'
                  }
               ];
               const {
                  menu,
                  message
               } = await Format.Menu(header, middle, pointer, bottom, prefix, top_1, opts);
               if (!text) {
                  conn.sendList(m.chat, info, message, m, {
                     isMedia: true,
                     media: {
                        image: {
                           url: cover
                        }
                     }
                  });
               } else if (text || text.toLowerCase() === 'all') {
                  conn.sendList(m.chat, `${info}\n${menu}`, message, m, {
                     isMedia: true,
                     media: {
                        image: {
                           url: cover
                        }
                     }
                  })
               }
            }
         }
         break

         case 'owner':
            m.reply(`Nih Ka Nomor Owner Ku:\nwa.me/${setting.contact}\nSosmed:\n${setting.sosmed}\nSilahkan Chat`)
            break

         case 'hyd': {
            let caption = 'Tes'
            let media = cover
            let hyd = [
               ['Google', 'https://www.google.com'],
               ['Facebook', 'https://www.facebook.com'],
               ['Instagram', 'https://www.instagram.com/ru_hend_'],
               ['Youtube', 'https://www.youtube.com/'],
               ['Tiktok', 'https://www.tiktok.com/mr.beast']
            ]
            conn.sendHydrated(m.chat, caption, media, m, hyd)
         }
         break

         case 'slide': {
            const caption = 'Hy There'
            const media = cover
            const galery = [
               ['1', '', cover, []],
               ['2', '', media, []],
               ['3', '', media, []],
               ['4', '', media, []],
               ['5', '', media, []]
            ]
            conn.sendGalery(m.chat, caption, m, galery)
         }
         break

         case 'copy':
            conn.sendCopy(m.chat, 'Silahkan Copy ', 'Salin', 'tes salin', cover, m)
            break

         case 'list': {
            let caption = `👋 Hai @${m.sender.split('@')[0]}\n`
            caption += `This Is Example List Message`
            let sections = [{
               title: 'Example',
               rows: [{
                     title: 'Menu Tes',
                     description: `Menampilkan Example Ping`,
                     id: '.ping'
                  },
                  {
                     title: 'Menu Info',
                     description: `Script Bot`,
                     id: '.sc'
                  }
               ]
            }]
            let listMessage = {
               title: 'Select Here',
               sections
            }
            conn.sendList(m.chat, caption, listMessage, m, {
               isMedia: true,
               media: {
                  image: {
                     url: cover
                  }
               }
            })
         }
         break

         case 'button': {
            text = text || 'contoh'
            let caption = `Hay Ka @${m.sender.split('@')[0]}`
            let media = cover
            let button = [
               ['One', '.ping'],
               ['Two', '.ping ' + text],
               ['Three', '.sc']
            ]
            conn.sendButton(m.chat, caption, media, m, button)
         }
         break

         case 'bost':
         case 'boost':
         case 'percepat':
            conn.edReply(m.chat, global.ed, 'Sukses mempercepat bot', 500, m)
            break

            /** OWNER **/
         case 'upsw': {
            if (!isOwn()) return
            let contacts = {}
            try {
               const data = await fs.promises.readFile('./lib/contacts.json', 'utf8')
               contacts = JSON.parse(data)
            } catch (e) {}
            if (Object.keys(contacts).length === 0) {
               try {
                  if (db.contacts && Object.keys(db.contacts).length > 0) {
                     contacts = db.contacts
                  }
               } catch (e) {}
            }
            if (Object.keys(contacts).length === 0) throw 'Tidak ada kontak yang ditemukan, tidak bisa mengirim status!'
            const statusJidList = Object.keys(contacts).map(v => `${v}@s.whatsapp.net`)
            if (/image|video|audio/.test(mime)) {
               const media = await quoted.download()
               if (/audio/.test(mime)) {
                  m.reply(loading)
                  return await conn.sendStatusAudio(media, statusJidList), m.reply('Done')
               } else {
                  m.reply(loading)
                  const mediaType = /image/.test(mime) ? 'image' : 'video'
                  return await conn.sendStatusImageOrVideo(text, quoted, media, mediaType, statusJidList), m.reply('Done')
               }
            } else {
               if (!text) throw 'Textnya mana?'
               m.reply(loading)
               return await conn.sendStatusText(text, statusJidList), m.reply('Done')
            }
         }
         break

         case 'updatesc':
         case 'update': {
            if (!isOwn()) return
            if (!text) return m.reply(`apa kamu yakin ingin update script?\n\n- update ini akan memperbarui script lama ini dengan yang terbaru.\n- beberapa file yg sudah kamu buat atau edit mungkin akan menjadi default script bawaan (default).\n- update ini tidak akan menghapus database dan configurasi kamu\n\nsetuju dan lanjut ketik ${prefix+command} yes`);
            if (text == 'y' || text == 'yes') {
               m.reply(`tunggu sedang backup script saat ini terlebih dahulu . . .`);
               const data = await Format.backup_script();
               await conn.sendFile(m.sender, data, 'ini file backup script sekarang jika ada file yg sudah kamu buat atau edit kamu bisa ambil dan restore lagi', m, {
                  document: true,
                  fileName: 'script_backup_old.zip',
                  mimetype: 'application/zip'
               })
               await sleep(2000);
               m.reply('updating script .  .  .');
               const update = await Format.update_script();
               if (update) return await m.reply('update script selesai rebooting . . .'), await sleep(1000), reset();
            }
         }
         break

         case 'ubahnama': {
            if (!isOwn()) return
            if (!text) throw `Masukan nama profil nya contoh: \n${prefix+command} My Bot`
            await conn.updateProfileName(`${text}`);
            m.reply(`Sukses Menggantikan Nama Profil Menjadi ${text}`);
         }
         break

         case 'unbanned':
         case 'unban': {
            if (!isAdm()) return
            if (!text) return m.reply(`Masukkan Nomornya. Contoh: ${prefix+command} nomor\nContoh: ${prefix+command} 62xxxxx \n\nkamu bisa lihat di .listbanned\n\nterus salin nomornya lalu tempel`);
            const num = text.startsWith('@') ? conn.parseMention(text)[0] : conn.decodeNum(text) + '@s.whatsapp.net';
            if (!db.users[num]) throw 'Nomor tidak ada dalam database coba untuk unban dari grup'
            db.users[num].banned = false
            db.users[num].bannedReason = ''
            m.reply(`Nomor ${num.split('@')[0]} berhasil dihapus dari database banned\nSekarang Nomor Itu Bisa Menggunakan Bot Ini\nUntuk melihat daftar banned ketik .listbanned`);
         }
         break

         case 'sesi':
         case 'sessi':
         case 'getsesi': {
            if (!isOwn()) return
            if (!isPrivate()) return
            m.reply(`Tunggu sedang mengambil file sessi...`);
            const data = await Format.sessions();
            conn.sendFile(m.chat, data, '', m, {
               document: true,
               fileName: 'sessions.zip',
               mimetype: 'application/zip'
            })
         }
         break

         case 'self':
         case 'public': {
            if (!isOwn()) return
            if (command == 'self') {
               save.global('global.self = false', 'global.self = true');
               await m.reply(`Mode self berhasil diaktifkan. Hanya aku, owner, dan premium yang dapat mengakses bot ini\nRestarting...`);
               return m.reply(global.self)
            } else if (command == 'public') {
               save.global('global.self = true', 'global.self = false');
               await m.reply(`Mode self berhasil dimatikan. Sekarang semua orang dapat mengakses bot ini\nRestarting...`);
               return m.reply(global.self)
            }
         }
         break

         case 'sf':
         case 'simpan':
         case 'addfile': {
            if (!isOwn()) return
            if (!m.quoted) return m.reply(`balas pesan nya berbentuk file atau dokumen atau text yang mau disimpan`);
            if (!text) return m.reply('masukan jalur path nya \ncontoh: ' + prefix + command + ' lib/handler.js\n' + prefix + command + ' config.json\nfile besar upload file nya dulu atau kode kecil langsung balas ke pesannya');
            const path = text.trim();
            const isJsonPath = /\.json$/i.test(path);
            let rawContent;
            if (m.quoted.mtype === 'documentMessage') {
               const data = await m.quoted.download();
               rawContent = data.toString();
            } else if (m.quoted.text) {
               rawContent = m.quoted.text;
            } else {
               return m.reply('balas pesan nya berbentuk file atau dokumen atau text yang mau disimpan');
            }
            if (isJsonPath) {
               try {
                  JSON.parse(rawContent);
               } catch (e) {
                  return m.reply(`❗ silahkan periksa json nya, ada kesalahan sintaks JSON.\n\n${e.message}`);
               }
               await fs.promises.writeFile(path, rawContent);
               return m.reply(`tersimpan di ${path}`);
            } else {
               const error = await syntaxError(rawContent, {
                  sourceType: 'commonjs'
               });
               if (error) {
                  return m.reply(`❗ tidak dapat menyimpan kode, terdapat kesalahan sintaks.\n\n${error}`);
               }
               await fs.promises.writeFile(path, rawContent);
               return m.reply(`tersimpan di ${path}`);
            }
         }
         break

         case 'addcase': {
            if (!isOwn()) return
            if (!m.quoted) return m.reply(`Balas pesan yang berisi kode case yang mau ditambahkan\ncontoh ${prefix + command} download`);
            if (!text) return m.reply(`Masukan nama kategori tujuan\ncontoh ${prefix + command} download`);
            const code = m.quoted.text;
            try {
               const result = await Format.addCase(code, text.trim());
               return m.reply(result);
            } catch (e) {
               return m.reply(format(e));
            }
         }
         break

         case 'delcase': {
            if (!isOwn()) return
            if (!text) return m.reply(`Masukan nama case yang mau di hapus\ncontoh ${prefix + command} nabung\natau dengan kategori: ${prefix + command} nabung|user`);
            const [caseName, cat] = text.split('|').map(v => v?.trim());
            try {
               const result = await Format.delCase(caseName, cat || null);
               return m.reply(result);
            } catch (e) {
               return m.reply(format(e));
            }
         }
         break

         case 'getcase': {
            if (!isOwn()) return
            if (!text) return m.reply(`Masukan nama case yang mau di lihat\ncontoh ${prefix + command} nabung\natau dengan kategori: ${prefix + command} nabung|user`);
            const [caseName, cat] = text.split('|').map(v => v?.trim());
            try {
               const result = await Format.getCase(caseName, cat || null);
               return m.reply(result.text), m.reply(result.case.trim())
            } catch (e) {
               return m.reply(format(e));
            }
         }
         break

         case 'restart':
         case 'reset':
         case 'reboot':
         case 'rb': {
            if (!isOwn()) return
            await m.reply(`Merestart bot . . .`), await sleep(1000), reset();
         }
         break

         case 'resetlimit': {
            if (!isOwn()) return
            if (!args[0]) return m.reply(`Masukan Nilai Limit Yang Ingin Di Reset Ke Semua Pengguna\ncontoh ${prefix+command} 25`);
            let list = Object.entries(db.users)
            let isNumber = (x = 0) => {
               x = parseInt(x);
               return !isNaN(x) && typeof x == 'number'
            }
            let lim = !args || !args[0] ? 5 : isNumber(args[0]) ? parseInt(args[0]) : 5
            lim = Math.max(1, lim)
            list.map(([user, data], i) => (Number(data.limit = lim)))
            let caption = `Berhasil Mereset Limit\n${args[0]} Per User`;
            conn.adReply(m.chat, caption, cover, m);
         }
         break

         case 'pushkontak': {
            if (!isOwn()) return
            if (!m.isGroup) return m.reply('Command ini hanya bisa digunakan di dalam grup.')
            if (!text) return m.reply(`Contoh ${prefix+command} Hi Ka Save Ya Namaku Jembut`);
            let users2 = participants.map(a => a.id);
            let delay = 10000
            m.reply('Hold On Sir Doing Your Command...')
            for (let i = 0; i < users2.length; i++) {
               setTimeout(async () => {
                  await conn.sendMessage(users2[i], {
                     text: `${text}`
                  }, m);
                  if (i === users2.length - 1) {
                     await m.reply('Pesan sudah dikirim ke semua member');
                  }
               }, delay * i);
            }
         }
         break

         case 'out':
         case 'keluar':
         case 'outgc':
         case 'outall':
         case 'outgcall': {
            if (!isOwn()) return
            if (command === 'outgc' || command === 'outlistgc') {
               return await Format.leave_group(m, {
                  conn,
                  prefix,
                  command,
                  text,
                  Format
               });
            } else if (command === 'out' || command === 'keluar') {
               return await m.reply('Bye'), await conn.groupLeave(m.chat), delete db.chats[m.chat], delete db.chats.community[m.chat];
            } else if (command === 'outall' || command === 'outgcall') {
               await m.reply('OK Bot Akan Keluar Dari Semua Group')
               return await Format.leave_group_all(m, {
                  conn
               });
            }
         }
         break

         case 'join':
         case 'gabung': {
            if (!isOwn()) return
            if (!text) return m.reply('Masukkan Link Groupnya!');
            let isUrl = (url) => url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
            if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return m.reply('Link Invalid!');
            m.reply('Menyatukan...');
            const result = args[0].split('https://chat.whatsapp.com/')[1]?.split('?')[0]
            await conn.groupAcceptInvite(result)
            m.reply('Berhasil Bersatu Ke Group Yang Kamu Berikan')
         }
         break

         case 'getfile':
         case 'gf': {
            if (!isOwn()) return
            if (!text) return m.reply(`contoh ${prefix+command} main.js atau file yang ingin kamu lihat`);
            let path2 = `${text}`;
            exec(`cat ${path2}`, (x, y) => {
               if (x) return m.reply(`${path2}\ntidak ada`);
               if (y) return m.reply(y.toString());
            })
         }
         break

         case 'fixsesi':
         case 'fixsessi':
         case 'clearsesi':
         case 'clearsessi': {
            if (!isOwn()) return
            await m.reply(`Done sessions fixed rebooting...`);
            await sleep(2000), await Format.fix_sessions(), process.send('reset');
         }
         break

         case 'hapusprem':
         case 'delprem': {
            if (!isOwn()) return
            if (!text) return m.reply(`Tag / Masukkan Nomornya. Contoh: ${prefix+command} nomor\nContoh: ${prefix+command} 62xxxxx`);
            const num = text.startsWith('@') ? conn.parseMention(text)[0] : conn.decodeNum(text) + '@s.whatsapp.net';
            if (!db.users[num]) throw 'Nomor tidak ada dalam database coba untuk delprem dari grup'
            db.users[num].premium = false
            db.users[num].premiumTime = ''
            m.reply(`Nomor ${num.split('@')[0]} tidak lagi menjadi premium`);
         }
         break

         case 'addowner':
         case 'addown':
         case 'delowner':
         case 'delown': {
            if (!isOwn()) return
            let num
            if (m.isGroup && text.match("@")) {
               txt = `@${text.replace(/[@+\s-]/g, '').trim()}`;
               num = conn.parseMention(txt)[0].split('@')[0]
            } else {
               num = `${text.replace(/[@+\s-]/g, '').trim()}`;
            }
            if (/addowner|addown/.test(command)) {
               if (!text) return m.reply(`Masukkan Nomornya contoh\n${prefix+command} 62xxxx atau tag @tag nomornya`);
               setting.ownerNumber.push(num);
               save_setting()
               return m.reply(`Sukses Menambahkan ${num} sebagai owner`);
            } else if (/delowner|delown/.test(command)) {
               if (!text) return m.reply(`Masukkan Nomor yang ingin dihapus dari daftar owner.`);
               const index = setting.ownerNumber.indexOf(num);
               if (index !== -1) {
                  setting.ownerNumber.splice(index, 1);
                  save_setting()
                  m.reply(`Nomor ${num.replace('@', '')} berhasil dihapus dari daftar owner.`);
               } else {
                  return m.reply(`Nomor ${text} tidak ditemukan dalam daftar owner.`);
               }
            }
         }
         break

         case 'db':
         case 'database':
         case 'getdb': {
            if (!isOwn()) return
            m.reply(`Tunggu sedang mengambil file database...`).then(() => {
               conn.sendFile(m.chat, fs.readFileSync('./database.json'), '', m, {
                  document: true,
                  fileName: 'database.json',
                  mimetype: 'application/json'
               })
            })
         }
         break

         case 'addctag':
         case 'addcustomtag':
         case 'delctag':
         case 'delcustomtag': {
            if (!isOwn()) return
            if (!text && !m?.quoted) return m.reply(`masukan nomor atau tag yang mau di isengin (dia ketag terus) \n\ncontoh: ${prefix+command} 62xxxx atau ${prefix+command} @tag atau balas apa saja pesan dia (quoted) sambil ketik ${prefix+command}`)
            const getUser = () => {
               if (m?.quoted) return m.quoted.sender;
               const decoded = conn.decodeNum(text);
               if (!decoded) return null;
               return text?.match('@') ? m.jid(decoded + '@lid') : decoded + '@s.whatsapp.net';
            }
            const user = getUser();
            if (!user) return m.reply(`nomor tidak valid, coba lagi!`);
            if (/addctag|addcustomtag/.test(command)) {
               db.settings.custom_tags.push(user);
               return m.reply(`sukses menambahkan ${user.split('@')[0]} ke custom tag sekarang dia akan ke tag terus 🤣`);
            } else if (/delctag|delcustomtag/.test(command)) {
               const custom = db.settings.custom_tags;
               const index = custom.indexOf(user);
               if (index !== -1) {
                  custom.splice(index, 1);
                  return m.reply(`sukses menghapus ${user.split('@')[0]} dari custom tag, dia udah ga akan ke tag lagi 😁`);
               } else {
                  return m.reply(`${user.split('@')[0]} tidak ditemukan di custom tag!`);
               }
            }
         }
         break

         case 'clearchat':
         case 'hapuschat': {
            if (!isOwn()) return
            if (!isPrivate()) return
            m.reply(`membersihkan semua percakapan group\nMohon tunggu...`);
            const data = Object.keys(db.chats);
            const deletePromises = [];
            for await (let group of data) {
               if (group == 'community') continue
               await sleep(2000);
               deletePromises.push(conn.deleteMessage(m, group));
            };
            await Promise.all(deletePromises);
            m.reply("Semua pesan di group telah dihapus.");
         }
         break

         case 'broadcast':
         case 'bc': {
            if (!isOwn()) return
            if (!text) return m.reply(`Masukan Text Nya Contoh:\n${prefix+command} Informasi ${setting.botName}`);
            let group = Object.keys(db.chats);
            m.reply(`Ok tunggu sedang broadcast ke group`);
            for (let jid of group) {
               if (!jid || jid === 'community') continue
               await Format.sleep(3000);
               conn.reply(jid, text, fake_wa);
            }
         }
         break

         case 'block':
         case 'blok':
         case 'blockir':
         case 'blokir':
         case 'unblock':
         case 'unblok':
         case 'unblockir':
         case 'unblokir': {
            if (!isOwn()) return
            if (!text) return m.reply(`Tag / Masukkan Nomornya yang mau di blok / unblok\nContoh: ${prefix + command} nomor\nContoh: ${prefix + command} 62xxxxx`);
            const num = conn.decodeNum(text) + '@s.whatsapp.net';
            const action = await / (unblock | unblok | unblockir | unblokir) / .test(command.toLowerCase()) ? 'unblock' : 'block';
            await conn.updateBlockStatus(num, action);
            m.reply(`Nomor ${num.split('@')[0]} berhasil di ${action === 'block' ? 'blokir' : 'unblok'}`);
         }
         break

         case 'banned':
         case 'ban': {
            if (!isOwn()) return
            if (!text) return m.reply(`Masukkan Nomor dan alasan nya Contoh: ${prefix+command} @(titik)alasan\nContoh: ${prefix+command} @tag.karena dia toxic atau menghina bot\n\ntitik setelah tag`);
            const number = text.split(".")[0],
               reason = text.split(".")[1];
            if (!reason) return m.reply(`Masukan Alasannya \nContoh: ${prefix+command} @tag.alasan\nContoh: ${prefix+command} @tag.karena dia toxic atau menghina bot\n\ntitik setelah tag`)
            const num = number.startsWith('@') ? conn.parseMention(text)[0] : conn.decodeNum(number) + '@s.whatsapp.net';
            if (!db.users[num]) throw 'Nomor tidak ada dalam database coba untuk ban dari grup'
            db.users[num].banned = true
            db.users[num].bannedReason = reason
            m.reply(`Nomor ${num.split('@')[0]} berhasil di banned\nSekarang Nomor Itu Tidak Bisa Menggunakan Bot Ini\n\nAlasan Di Banned:\n${reason}\n\nUntuk melihat daftar banned ketik .listbanned`);
         }
         break

         case 'backupsc':
         case 'backupscript': {
            if (!isOwn()) return
            if (!isPrivate()) return
            m.reply(`Tunggu sedang backup script...`);
            const data = await Format.backup_script();
            conn.sendFile(m.chat, data, '', m, {
               document: true,
               fileName: 'script_backup.zip',
               mimetype: 'application/zip'
            })
         }
         break

         case 'addpremium':
         case 'addprem': {
            if (!isOwn()) return
            if (!text) return m.reply(`Masukkan / Tag Nomornya\ncontoh: ${prefix + command} nomor.waktu sampainya\ncontoh: ${prefix + command} 62xxxxx.10 juli 2090\ntitik setelah nomor`);
            const parts = text.split("."),
               numberPart = parts[0].trim(),
               time2 = parts[1] ? parts[1].trim() : '';
            if (!time2) return m.reply(`Masukan waktu premium nya \nContoh: ${prefix + command} nomor.tanggal\nContoh: ${prefix + command} 62xxxxx.10 juli 2090\nAtau \nContoh: ${prefix + command} @tag.10 juli 2090`);
            const Number = conn.decodeNum(numberPart);
            if (!Number || isNaN(Number)) return m.reply(`Nomor tidak valid. Silakan masukkan nomor tanpa karakter yang tidak diinginkan.`);
            const num = numberPart.startsWith('@') ? conn.parseMention(text)[0] : conn.decodeNum(numberPart) + '@s.whatsapp.net';
            if (!db.users[num]) throw 'Nomor tidak ada dalam database coba untuk addprem dari grup dan setidaknya dia chat agar database dia masuk'
            db.users[num].premium = true
            db.users[num].premiumTime = time2
            db.users[num].limit += 1000
            m.reply(`Nomor ${num.split('@')[0]} menjadi premium dan mendapatkan bonus utama limit 1000`);
         }
         break

         case 'addlimit':
         case 'tambahlimit':
         case 'addlimitowner':
         case 'cheatlimit': {
            if (!isOwn()) return
            if (command === 'addlimit' || command === 'tambahlimit') {
               if (!text) return m.reply(`Masukkan/ tag nomor dan limitnya \natau tag yang mau di tambahkan limit dan masukan limitnya \nContoh: ${prefix + command} nomor limit\nContoh: ${prefix + command} 62xxxxx 25 \nAtau\nContoh: ${prefix + command} @tag 25`);
               const parts = text.split(" "),
                  limit = parts.pop(),
                  number = parts.join(" ");
               if (!limit || isNaN(limit)) return m.reply(`Masukan limitnya berupa angka \nContoh: ${prefix + command} nomor(spasi)limit\nContoh: ${prefix + command} 62xxxxx 25\nAtau \nContoh: ${prefix + command} @tag 25`);
               const num = number.startsWith('@') ? conn.parseMention(text)[0] : conn.decodeNum(number) + '@s.whatsapp.net';
               if (!db.users[num]) return m.reply(`Pengguna dengan nomor ${num} tidak ditemukan dalam database. Pastikan nomor sudah terdaftar.\natau coba untuk tag contoh \n.addlimit @tag 100`);
               db.users[num].limit += parseInt(limit);
               m.reply(`Berhasil Menambahkan ${limit} Limit Ke ${num.split('@')[0]}`);
            } else if (command === 'addlimitowner' || command === 'cheatlimit') {
               if (!text) return m.reply(`Masukkan limitnya contoh: \n${prefix+command} 100`);
               db.users[m.sender].limit += parseInt(text);
               m.reply(`Cheat Limit ${text} Berhasil`);
            }
         }
         break

         case 'backup':
         case 'restore':
         case 'backupall': {
            if (!isOwn()) return
            if (!text && !(/backupall/.test(command))) {
               const backup = `masukan cloud penyimpanan database nya\ncontoh: ${prefix + command} mongo\n\nterdapat 4 penyimpanan database cloud:\n\nmongo\ngithub\ngitlab\nsupabase\n\npilih salah satunya saja yang mau kamu ${command}\n\n`;
               const restore = `(optional) jika ingin backup semua ke tempat cloud database yang sudah kamu daftar ketik .backupall`;
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
               await Format.backupAllDB(m, list, backupMongo, backupGithub, backupGitlab, backupSupabase);
               return m.reply('Backup semua selesai ✅');
            }
         }
         break

         case 'set':
         case 'setnamebot':
         case 'setbotname':
         case 'setnameowner':
         case 'setnameown':
         case 'setmenu':
         case 'setprefix':
         case 'setfooter':
         case 'setwm':
         case 'setsosmed':
         case 'setram':
         case 'setlink':
         case 'setdelaybox':
         case 'setthumbnail':
         case 'setthumb':
         case 'sthumb':
         case 'setcover':
         case 'setppbot':
         case 'setpp':
         case 'delpp': {
            if (!isOwn()) return
            if (command == 'set') {
               var caption = zw + ' *SETTING OWNER* \n*Perintah tersedia untuk mengatur setting bot berikut ini*\n\n'
               caption += '1 .setnamebot atau .setbotname \nUntuk mengganti nama bot \n\n'
               caption += '2 .setnameowner atau .setnameown \nUntuk mengganti nama owner \n\n'
               caption += '3 .setmenu\nUntuk Mengganti Gaya Menu \n\n'
               caption += '4 .setprefix\nUntuk Mengganti Type Penggunaan Prefix\n\n'
               caption += '5 .setfooter atau .setwm \nUntuk mengganti watermark atau footer \n\n'
               caption += '6 .setsosmed \nUntuk mengganti link sosmed \n\n'
               caption += '7 .setram atau .ram \nUntuk mengganti nilai ram \n\n'
               caption += '8 .setthumb atau .setthumbnail  atau .setcover atau .sthumb \nUntuk mengganti thumbnail utama bot \n\n'
               caption += '9 .setlink \nUntuk mengganti setting link group\n\n'
               caption += '10 .setdelaybox \nUntuk mengganti delay misteri box'
               return m.reply(caption);
            } else if (/setnamebot|setbotname/.test(command)) {
               if (!text) return m.reply(`Masukan Nama Bot nya! \nContoh\n${prefix+command} Maleficent-bot`);
               setting.botName = text
               save_setting();
               return await m.reply(`Sukses mengganti nama bot menjadi ${text}`);
            } else if (/setnameowner|setnameown/.test(command)) {
               if (!text) return m.reply(`Masukan Nama Nya! \nContoh\n${prefix+command} Ruly Henderson`);
               setting.ownerName = text
               save_setting();
               return await m.reply(`Sukses Mengganti Nama Owner Bot Menjadi ${text}\n`);
            } else if (/setfooter|setwm/.test(command)) {
               if (!text) return m.reply(`Masukan nama footer atau watermark nya! \nContoh\n${prefix+command} © Ruhend`);
               setting.footer = text
               save_setting();
               return await m.reply(`Sukses Mengganti Footer atau Watermark Bot Menjadi ${text}`);
            } else if (/setsosmed/.test(command)) {
               if (!text) return m.reply(`Masukan link sosmed nya! \nContoh\n${prefix+command} www.instagram.com/ru_hend_`);
               setting.sosmed = text
               save_setting();
               return await m.reply(`Sukses Mengganti Link Sosmed Menjadi ${text}\n`);
            } else if (/setdelaybox/.test(command)) {
               if (!text) return m.reply(`Masukan nilainya! \nContoh:\n${prefix+command} 300000\n300 rb itu 5 menit jadi sesuaikan ajah jangan terlalu cepat juga`);
               save.global(`global.delay_box = ${delay_box}`, `global.delay_box = ${text}`);
               await m.reply(`Sukses Mengganti Delay Misteri Box Menjadi ${text}\n`);
            } else if (/setram|ram/.test(command)) {
               if (!text) return m.reply(`Masukan nilai ram nya! \nContoh\n${prefix+command} 800 MB`);
               setting.ram = text
               save_setting();
               return await m.reply(`Sukses Mengganti Nilai RAM Menjadi ${text}`);
            } else if (/setlink/.test(command)) {
               if (!text) return m.reply(`Masukan link group nya! \nContoh\n${prefix+command} ${global.link_group}\nAtau link lain juga bisa`);
               const link = global.link_group
               save.global(`global.link_group = '${link}'`, `global.link_group = '${text}'`);
               await m.reply(`Sukses Mengganti Link Setting Menjadi ${text}`);
            } else if (/setmenu/.test(command)) {
               if (!text) return m.reply(`masukan parameternya contoh \n${prefix+command} 1`);
               const available = ['1', '2', '3']
               if (available.includes(text)) {
                  db.settings.menu_type = parseInt(text);
                  m.reply(`Sukses Ganti Menu Type Ke ${text}`);
               } else {
                  return m.reply(`Opsi Menu Type ${text} Tidak Tersedia`);
               }
            } else if (/setprefix/.test(command)) {
               if (!text) return m.reply(`masukan parameternya contoh \n${prefix+command} multi`);
               if (text === 'single') {
                  db.settings.prefix = 'single'
                  m.reply(`Sukses Ganti Prefix Type Ke single`);
               } else if (text === 'multi') {
                  db.settings.prefix = 'multi'
                  m.reply(`Sukses Ganti Prefix Type Ke multi`);
               } else {
                  return m.reply(`Opsi Prefix Type ${text} Tidak Tersedia\nYang Tersedia single dan multi`);
               }
            } else if (/setthumbnail|setthumb|sthumb|setcover/.test(command)) {
               if (/image/.test(mime) || m.mtype === 'imageMessage') {
                  const image = await conn.downloadAndSaveMediaMessage(quoted);
                  m.reply('Process...');
                  const link = (await Scraper.uploadGit(image)).link;
                  db.settings.cover = link, setting.thumbnail = link, save_setting();
                  return m.reply(`Sukses Mengganti Thumbnail Bot`);
               } else if (text.startsWith('https')) {
                  m.reply('Process...');
                  db.settings.cover = text, setting.thumbnail = text, save_setting();
                  return m.reply(`Sukses Mengganti Thumbnail Bot`);
               } else {
                  return m.reply(`Balas Atau Kirim image dengan caption ${prefix+command}\n\nAtau\n\nMasukan link gambar nya contoh ${prefix+command} https://myimage.jpg`)
               }
            } else if (/delpp|hapuspp/.test(command)) {
               return await conn.removeProfilePicture(conn.decodeJid(conn.user.id)), m.reply('👍');
            } else if (/setppbot|setpp/.test(command)) {
               if (/image/.test(mime) || m.mtype === 'imageMessage') {
                  try {
                     const media = await quoted.download()
                     m.react('🖕'), await updateProfilePicture(conn, conn.decodeJid(conn.authState.creds.me.id), media);
                     return m.reply(`Sukses mengganti Foto Profile Bot`)
                  } catch (e) {
                     console.log(e)
                     return m.reply(`Terjadi kesalahan, coba lagi nanti\n${e}`)
                  }
               } else {
                  return m.reply(`Kirim gambar dengan caption *${prefix + command}* atau tag gambar yang sudah dikirim`)
               }
            }
         }
         break

         /** RANDOM **/
         case 'aesthetic':
         case 'bike':
         case 'blackpink':
         case 'car':
         case 'cat':
         case 'cosplay':
         case 'doggo':
         case 'doll':
         case 'islamic':
         case 'justina':
         case 'keyes':
         case 'notnot':
         case 'ppcp':
         case 'ppcouple':
         case 'procfile':
         case 'proc':
         case 'program':
         case 'pubg':
         case 'rose':
         case 'ryujin':
         case 'tatasurya':
         case 'walhp':
         case 'wallpaperhp':
         case 'walml':
         case 'wallpaperml':
         case 'zangboy':
         case 'zanggirl':
         case 'blowjob':
         case 'eba':
         case 'hentai':
         case 'manstrubation':
         case 'manstru':
         case 'milf':
         case 'neko':
         case 'neko2':
         case 'pussy':
         case 'pusy':
         case 'yuri':
         case 'zetai':
         case 'husbu':
         case 'loli':
         case 'megumin':
         case 'naruto':
         case 'shota':
         case 'waifu':
         case 'yuki': {
            let file = '',
               caption = '',
               isSpecial = false,
               specialUrl = ''
            switch (command) {
               case 'aesthetic':
                  file = 'aesthetic.json';
                  caption = '𝗔𝗘𝗦𝗧𝗛𝗘𝗧𝗜𝗖';
                  break
               case 'bike':
                  file = 'bike.json';
                  caption = '𝐁𝐈𝐊𝐄';
                  break
               case 'blackpink':
                  file = 'blackpink.json';
                  caption = '𝐁𝐋𝐀𝐂𝐊𝐏𝐈𝐍𝐊';
                  break
               case 'car':
                  file = 'car.json';
                  caption = '𝐂𝐀𝐑';
                  break
               case 'cat':
                  file = 'cat.json';
                  caption = '𝐂𝐀𝐓';
                  break
               case 'cosplay':
                  file = 'cosplay.json';
                  caption = '𝐂𝐎𝐒𝐏𝐋𝐀𝐘';
                  break
               case 'doggo':
                  file = 'doggo.json';
                  caption = '𝐃𝐎𝐆𝐆𝐎';
                  break
               case 'doll':
                  file = 'doll.json';
                  caption = '𝐃𝐎𝐋𝐋';
                  break
               case 'islamic':
                  file = 'islamic.json';
                  caption = '𝐈𝐒𝐋𝐀𝐌𝐈𝐂';
                  break
               case 'justina':
                  file = 'justina.json';
                  caption = '𝐉𝐔𝐒𝐓𝐈𝐍𝐀';
                  break
               case 'keyes':
                  file = 'keyes.json';
                  caption = '𝐊𝐄𝐘𝐄𝐒';
                  break
               case 'notnot':
                  file = 'notnot.json';
                  caption = '𝐍𝐎𝐓𝐍𝐎𝐓';
                  break
               case 'ppcp':
               case 'ppcouple':
                  file = 'ppcp.json';
                  caption = '𝐏𝐏𝐂𝐏';
                  break
               case 'procfile':
               case 'proc':
                  file = 'procfile.json';
                  caption = '𝐏𝐑𝐎𝐂𝐅𝐈𝐋𝐄';
                  break
               case 'program':
                  file = 'program.json';
                  caption = '𝐏𝐑𝐎𝐆𝐑𝐀𝐌';
                  break
               case 'pubg':
                  file = 'pubg.json';
                  caption = '𝐏𝐔𝐁𝐆';
                  break
               case 'rose':
                  file = 'rose.json';
                  caption = '𝐑𝐎𝐒𝐄';
                  break
               case 'ryujin':
                  file = 'ryujin.json';
                  caption = '𝐑𝐘𝐔𝐉𝐈𝐍';
                  break
               case 'tatasurya':
                  file = 'tatasurya.json';
                  caption = '𝐓𝐀𝐓𝐀 𝐒𝐔𝐑𝐘𝐀';
                  break
               case 'walhp':
               case 'wallpaperhp':
                  file = 'walhp.json';
                  caption = '𝐖𝐀𝐋𝐋𝐏𝐀𝐏𝐄𝐑 𝐇𝐏';
                  break
               case 'walml':
               case 'wallpaperml':
                  file = 'walml.json';
                  caption = '𝐖𝐀𝐋𝐋𝐏𝐀𝐏𝐄𝐑 𝐇𝐏';
                  break
               case 'zangboy':
                  file = 'zangboy.json';
                  caption = '𝐙𝐀𝐍𝐆𝐁𝐎𝐘';
                  break
               case 'zanggirl':
                  file = 'zanggirl.json';
                  caption = '𝐙𝐀𝐍𝐆𝐆𝐈𝐑𝐋';
                  break
               case 'blowjob':
                  file = 'blowjob.json';
                  caption = '𝐁𝐋𝐎𝐖𝐉𝐎𝐁';
                  break
               case 'eba':
                  file = 'eba.json';
                  caption = '𝐄𝐁𝐀';
                  break
               case 'hentai':
                  file = 'hentai.json';
                  caption = '𝐇𝐄𝐍𝐓𝐀𝐈';
                  break
               case 'manstrubation':
               case 'manstru':
                  file = 'manstrubation.json';
                  caption = '𝐌𝐀𝐍𝐒𝐓𝐑𝐔𝐁𝐀𝐓𝐈𝐎𝐍';
                  break
               case 'milf':
                  file = 'milf.json';
                  caption = '𝐌𝐈𝐋𝐅';
                  break
               case 'neko':
                  file = 'neko.json';
                  caption = '𝐍𝐄𝐊𝐎';
                  break
               case 'neko2':
                  isSpecial = true
                  specialUrl = 'https://nekos.life/api/v2/img/waifu'
                  caption = '𝐍𝐄𝐊𝐎'
                  break
               case 'pussy':
               case 'pusy':
                  file = 'pussy.json';
                  caption = '𝐏𝐔𝐒𝐒𝐘';
                  break
               case 'yuri':
                  file = 'yuri.json';
                  caption = '𝐘𝐔𝐑𝐈';
                  break
               case 'zetai':
                  file = 'zetai.json';
                  caption = '𝐙𝐄𝐓𝐀𝐈';
                  break
               case 'husbu':
                  file = 'husbu.json';
                  caption = '𝐇𝐔𝐒𝐁𝐔';
                  break
               case 'loli':
                  file = 'loli.json';
                  caption = '𝐋𝐎𝐋𝐈';
                  break
               case 'megumin':
                  file = 'megumin.json';
                  caption = '𝐌𝐄𝐆𝐔𝐌𝐈𝐍';
                  break
               case 'naruto':
                  file = 'naruto.json';
                  caption = '𝐍𝐀𝐑𝐔𝐓𝐎';
                  break
               case 'shota':
                  file = 'shota.json';
                  caption = '𝐒𝐇𝐎𝐓𝐀';
                  break
               case 'waifu':
                  file = 'waifu.json';
                  caption = '𝐖𝐀𝐈𝐅𝐔';
                  break
               case 'yuki':
                  file = 'yuki.json';
                  caption = '𝐘𝐔𝐊𝐈';
                  break
            }
            if (!isLimit()) return
            if (!file && !isSpecial) break
            await conn.adReply(m.chat, loading, cover, m)
            if (isSpecial) {
               const data = await toJSON(specialUrl)
               conn.sendFile(m.chat, data.url, caption, m)
            } else {
               const data = await toJSON(`https://raw.githubusercontent.com/ruhend/database/main/random/${file}`)
               for await (let v of data) await conn.sendFile(m.chat, v, '', m)
               m.reply('👆 ' + caption)
            }
            useLimit(2)
         }
         break

         /** STICKER **/
         case 'stickerwm':
         case 'swm':
         case 'wm':
         case 'take': {
            if (!isLimit()) return
            const pack = text.split('|')[0] ? text.split('|')[0] : undefined;
            const own = text.split('|')[1] ? text.split('|')[1] : undefined;
            let author;
            if (own === undefined) author = isPremium ? undefined : sticker_wm;
            else author = isPremium ? own : `${own}\n${sticker_wm}`;
            if (/webp|sticker|image|video/.test(mime) || m.mtype === 'stickerMessage' || m.mtype === 'imageMessage') {
               m.react('😆');
               const buffer = await quoted.download();
               if (text) {
                  conn.sendSticker(m.chat, buffer, m, {
                     packname: pack,
                     author: author !== undefined ? author + `\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}` : `\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
                  }).catch(async () => {
                     const p = `./tmp/${Date.now()}.webp`;
                     await fs.promises.writeFile(p, buffer);
                     const media = (await Format.webp2mp4File(p)).result;
                     conn.sendSticker(m.chat, media, m, {
                        packname: pack,
                        author: author !== undefined ? author + `\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}` : `\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
                     })
                  })
               } else {
                  conn.sendSticker(m.chat, buffer, m, {
                     packname: setting.botName,
                     author: `${setting.footer === '' || setting.footer === undefined ? sticker_wm : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
                  }).catch(async () => {
                     const p = `./tmp/${Date.now()}.webp`;
                     await fs.promises.writeFile(p, buffer);
                     const media = (await Format.webp2mp4File(p)).result;
                     conn.sendSticker(m.chat, media, m, {
                        packname: pack,
                        author: `${setting.footer === '' || setting.footer === undefined ? sticker_wm : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
                     })
                  })
               }
            } else if (/lottie/.test(mime)) {
               throw 'Belum support sticker animasi dari WhatsApp resmi';
            } else {
               return m.reply(`Balas stiker dengan caption ${prefix + command}\ngunakan | sebagai pemisahan (optional)`);
            }
            useLimit(2)
         }
         break

         case 'tomp4':
         case 'tovideo': {
            if (!isLimit()) return
            if (!/webp/.test(mime)) return m.reply(`balas stiker dengan caption *${prefix + command}*`)
            conn.adReply(m.chat, loading, cover, m);
            const media = await conn.downloadAndSaveMediaMessage(quoted)
            const webpToMp4 = await Format.webp2mp4File(media)
            await conn.sendFile(m.chat, webpToMp4.result, {
               caption: "Berhasil Ke Video ✔",
               quoted: m
            })
            useLimit(2)
         }
         break

         case 'toimg':
         case 'toimage': {
            if (!isLimit()) return
            if (!/webp|image/.test(mime)) return m.reply(`balas stiker dengan caption *${prefix + command}*`);
            const media = await conn.downloadAndSaveMediaMessage(quoted);
            const ran = `tmp/${Date.now()}.png`;
            await conn.adReply(m.chat, loading, cover, m);
            exec(`ffmpeg -i ${media} ${ran}`, (err) => {
               if (err) return m.reply(`${err}`);
               const buffer = fs.readFileSync(ran);
               conn.sendFile(m.chat, buffer, {
                  caption: "Berhasil Ke Image ✔",
                  quoted: m
               })
            })
            useLimit(2)
         }
         break

         case 'sticker':
         case 's':
         case 'stiker': {
            if (!isLimit()) return
            const pack = setting.botName;
            const own = setting.footer;
            if (/webp|image|video/.test(mime) || m.mtype === 'imageMessage' || m.mtype === 'videoMessage') {
               const buffer = await quoted.download();
               conn.sendSticker(m.chat, buffer, m, {
                  packname: pack,
                  author: `${own === '' ? sticker_wm : own}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
               }).catch(async () => {
                  const p = `./tmp/${Date.now()}.webp`;
                  await fs.promises.writeFile(p, buffer);
                  const media = (await Format.webp2mp4File(p)).result;
                  conn.sendSticker(m.chat, media, m, {
                     packname: pack,
                     author: `${own === '' ? sticker_wm : own}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
                  })
               })
            } else {
               return m.reply(`Kirim gambar atau video dengan caption ${prefix + command} atau balas gambar yang sudah dikirim`);
            }
         }
         useLimit(2)
         break

         case 'qc': {
            const pack = setting.botName
            const own = setting.footer
            if (!text) return m.reply(`Kirim perintah ${prefix+command} teksnya`)
            const randomColor = ['#ef1a11', '#89cff0', '#660000', '#87a96b', '#e9f6ff', '#ffe7f7', '#ca86b0', '#83a3ee', '#abcc88', '#80bd76', '#6a84bd', '#5d8d7f', '#530101', '#863434', '#013337', '#133700', '#2f3641', '#cc4291', '#7c4848', '#8a496b', '#722f37', '#0fc163', '#2f3641', '#e7a6cb', '#64c987', '#e6e6fa', '#ffa500'];
            const apiColor = randomColor[Math.floor(Math.random() * randomColor.length)];
            const pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => setting.thumbnail)
            const nama = await m.pushName
            const objBody = {
               "type": "quote",
               "format": "png",
               "backgroundColor": apiColor,
               "width": 512,
               "height": 768,
               "scale": 2,
               "messages": [{
                  "entities": [],
                  "avatar": true,
                  "from": {
                     "id": 1,
                     "name": nama,
                     "photo": {
                        "url": pp
                     }
                  },
                  "text": text,
                  "replyMessage": {}
               }]
            };
            const json = await axios.post('https://bot.lyo.su/quote/generate', objBody, {
               headers: {
                  'Content-Type': 'application/json'
               }
            });
            const buffer = await Buffer.from(json.data.result.image, 'base64')
            conn.adReply(m.chat, loading, cover, m).then(() => {
               conn.sendSticker(m.chat, buffer, m, {
                  packname: pack,
                  author: `${setting.footer === '' ? sticker_wm : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
               })
            })
         }
         break

         case 'stickermeme':
         case 'smeme':
         case 'memek': {
            if (!isLimit()) return
            if (/(webp|image|video)/.test(mime)) {
               if (!text) return m.reply(`Balas Atau Kirim image dengan caption ${prefix + command} text1 | text2`);
               await m.react('🕒')
               const up = text.split('|')[0] ? text.split('|')[0] : ' '
               const down = text.split('|')[1] ? text.split('|')[1] : ' '
               const media = await Scraper.uploadUgu(await conn.download(quoted));
               const data = mime == 'video/mp4' ? await Format.smeme(await toBuffer(media), up, down, 'video') : await toBuffer(`https://api.memegen.link/images/custom/${encodeURIComponent(up ? up : '')}/${encodeURIComponent(down ? down : '')}.png?background=${media}`);
               conn.sendSticker(m.chat, data, m, {
                  packname: setting.botName,
                  author: `${setting.footer === '' ? sticker_wm : setting.footer}\ncreated: \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
               })
            } else {
               return m.reply(`Balas Atau Kirim Gambar dengan caption ${prefix + command} text1 | text2`)
            }
            useLimit(2)
         }
         break

         case 'bratvid':
         case 'bratvideo': {
            if (!isLimit()) return
            if (!text) return m.reply(`Kirim perintah ${prefix + command} text\ncontoh: ${prefix + command} ${setting.botName}`);
            await conn.adReply(m.chat, loading, cover, m);
            await conn.sendSticker(m.chat, await Format.bratvid(text), m, {
               packname: setting.botName,
               author: `${setting.footer === '' ? sticker_wm : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
            })
            useLimit(2)
         }
         break

         case 'brat': {
            if (!isLimit()) return
            if (!text) return m.reply(`Kirim perintah ${prefix+command} text\ncontoh: ${prefix+command} ${setting.botName}`);
            const result = await toBuffer(`https://aqul-brat.hf.space/?text=${text}`);
            await conn.adReply(m.chat, loading, cover, m).then(async () => {
               await conn.sendImageAsSticker(m.chat, result, m, {
                  packname: setting.botName,
                  author: `${setting.footer === '' ? sticker_wm : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
               })
            })
            useLimit(2)
         }
         break

         case 'attp':
         case 'ttp': {
            if (!isLimit()) return
            if (!text) return m.reply(`Kirim perintah ${prefix+command} text\ncontoh: ${prefix+command} ${setting.botName}`);
            const result = await ttp(text);
            await conn.adReply(m.chat, loading, cover, m).then(async () => {
               await conn.sendImageAsSticker(m.chat, result.url, m, {
                  packname: setting.botName,
                  author: `${setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
               })
            })
            useLimit(2)
         }
         break

         /** TOOLS **/
         case 'volume':
         case 'vol': {
            if (/audio|video|document/.test(mime)) {
               m.reply(loading)
               const buffer = await quoted.download()
               const media = await Format.volume(buffer, text);
               conn.sendFile(m.chat, media, '', m);
            } else {
               return m.reply(`balas audio atau kirim audio yang mau volume nya di naikan atau di turunkan \n\nmenggunakan titik(.) untuk naik atau turun satu tingkat\n\ncontoh untuk naik volume: ${prefix+command} 1.2, 1.5, 2.0 dan seterusnya\n\ncontoh untuk turun volume: ${prefix+command} 0.9, 0.8, 0.5 dan seterusnya\nrekomen dari 0\n\ncontoh: ${prefix+command} 1.4\n\nkalo volume nya lagi misalnya setelah dinaikan / diturunkan tapi mau dinaikan / diturunkan lagi \npada original file / audio nya ya agar bersih hasilnya ny`)
            }
         }
         break

         case 'upload': {
            if (!isLimit()) return
            if (/image|video|audio|webp/.test(mime)) {
               m.reply(loading)
               const result = await Scraper.uploadMoe(await conn.download(quoted));
               const caption = `Upload Berhasil √ \n${result}`
               conn.adReply(m.chat, caption, cover, m);
            } else {
               return m.reply(`Balas Media Atau Kirim Media Dengan Caption ${prefix}upload atau ${prefix}upl`);
            }
            useLimit(2)
         }
         break

         case 'tts':
         case 'gtts': {
            if (!isLimit()) return
            if (!text) throw `Masukan suara negara (optional) dan teksnya (titik) . sebagai pemisah\ncontoh: ${prefix + command} id.aku cinta kamu`;
            let parts = text.split(".");
            let region, write;
            if (parts.length > 1 && parts.length === 2) {
               region = text.slice(0, 2);
               write = parts.slice(1).join(" ");
            } else {
               region = 'id';
               write = text
            }
            if (!parts) {
               const audio = await tts.getAudioUrl(text, {
                  lang: 'id',
                  slow: false,
                  host: host
               });
               conn.sendFile(m.chat, audio, {
                  ptt: true,
                  quoted: m
               });
            } else {
               const audio = await tts.getAudioUrl(write, {
                  lang: region,
                  slow: false,
                  host: host
               });
               conn.sendFile(m.chat, audio, {
                  ptt: true,
                  quoted: m
               });
            }
            useLimit(2)
         }
         break

         case 'translate':
         case 'tr': {
            if (!isLimit()) return
            if (!text) return m.reply('Masukan Text Nya Goblok')
            var lang, text2
            if (args.length >= 2) {
               lang = args[0] ? args[0] : 'id', text2 = args.slice(1).join(' ')
            } else if (m.quoted && m.quoted.text) {
               lang = args[0] ? args[0] : 'id', text2 = m.quoted.text
            } else m.reply(`contoh: ${prefix + command} id hello i am robot`)
            let res = await translate(text2, {
               to: lang,
               autoCorrect: true
            }).catch(_ => null)
            if (!res) return m.reply(`Error : Bahasa "${lang}" Tidak Support`)
            var Translate = `*Terdeteksi Bahasa:* ${res.from.language.iso}\n*Ke Bahasa:* ${lang}\n\n*Terjemahan:* ${res.text}`.trim()
            conn.adReply(m.chat, Translate, cover, m);
            useLimit(2)
         }
         break

         case 'totag': {
            if (!isAdm()) return
            const members = participants.map(i => i.id);
            if (/audio|video|image|document|sticker/.test(mime)) {
               const media = await quoted.download();
               conn.sendFile(m.chat, media, quoted.text ? quoted.text : '', m, {
                  ptt: quoted.ptt ? true : false,
                  mentions: members
               });
            } else {
               m.reply(quoted.text, {
                  mentions: members
               })
            }
         }
         break

         case 'tomp3':
         case 'toaudio':
         case 'toptt':
         case 'tovn': {
            if (!isLimit()) return
            if (/audio|video|document/.test(mime) || m.mtype === 'videoMessage' || m.mtype === 'documentMessage' || m.mtype === 'audioMessage') {
               m.reply(loading)
               const media = await quoted.download();
               const audio = await Format.mp3(media);
               if (/toptt|tovn/.test(command)) {
                  conn.sendFile(m.chat, audio, '', m, {
                     ...opus
                  })
               } else conn.sendFile(m.chat, audio, '', m);
            } else {
               return m.reply(`reply balas audio, video, atau dokumen dengan pesan ${prefix+command}`)
            }
            useLimit(2)
         }
         break

         case 'tomedia': {
            if (!isLimit()) return
            if (m?.quoted?.fakeObj?.message?.documentMessage?.mtype === 'documentMessage') {
               m.reply(loading)
               const media = await quoted.download();
               conn.sendFile(m.chat, media, m?.quoted?.fakeObj?.message?.documentMessage?.fileName || '', m);
            } else if (m.mtype === 'documentMessage') {
               m.reply(loading)
               const media = await conn.download(quoted);
               conn.sendFile(m.chat, media, m?.body, m);
            } else {
               return m.reply(`Balas document Atau Kirim document Dengan Caption ${prefix+command} yang ingin di convert ke media`);
            }
            useLimit(2)
         }
         break

         case 'tome':
         case 'rvome': {
            return await conn.viewOnce(m, m.sender)
         }
         break

         case 'todocument':
         case 'todoc': {
            if (!isLimit()) return
            if (!text) return m.reply('Kirim Media / Balas Media nya dan Masukan Masukan Nama File Nya contoh ' + `${prefix+command} gambarku`)
            const name = text.trim()
            m.reply(loading);
            const media = await quoted.download();
            if (/audio/.test(mime) || m.mtype === 'audioMessage') {
               conn.sendFile(m.chat, media, '', m, {
                  document: true,
                  fileName: name + '.mp3',
                  mimetype: 'audio/mpeg'
               })
            } else if (/video/.test(mime) || m.mtype === 'videoMessage') {
               conn.sendFile(m.chat, media, '', m, {
                  document: true,
                  fileName: name + '.mp4',
                  mimetype: 'video/mp4'
               })
            } else if (/image/.test(mime) || m.mtype === 'imageMessage') {
               conn.sendFile(m.chat, media, '', m, {
                  document: true,
                  fileName: name + '.jpg',
                  mimetype: 'image/jpg'
               })
            } else {
               return m.reply(`Balas atau kirim media dengan caption ${prefix+command} namafile contoh\n${prefix+command} gambarku`)
            }
            useLimit(2)
         }
         break

         case 'ssweb': {
            if (!isLimit()) return
            if (!text) return m.reply('Masukan link atau url yang mau di screenshot webnya\ncontoh: ' + prefix + command + ' ' + link_group);
            await conn.sendFile(m.chat, await toBuffer('https://image.thum.io/get/width/1900/crop/1000/fullpage/' + text), text, m);
            useLimit(2)
         }
         break

         case 'speedsong':
         case 'ssong': {
            if (/audio|video|document/.test(mime)) {
               m.reply(loading)
               const buffer = await quoted.download()
               const media = await Format.speed_song(buffer, text);
               conn.sendFile(m.chat, media, '', m);
            } else {
               return m.reply(`balas audio atau kirim audio yang mau speed nya di cepatkan atau di lambatkan \n\nmenggunakan titik(.) untuk naik atau turun satu tingkat\n\ncontoh untuk naik speed: ${prefix+command} 1.2, 1.5, 2.0 dan seterusnya\n\ncontoh untuk turun speed: ${prefix+command} 0.9, 0.8, 0.5 dan seterusnya\nrekomen dari 0\n\ncontoh: ${prefix+command} 1.4\n\nkalo speed nya lagi misalnya setelah dicepatkan / dilambatkan tapi mau dicepatkan / dilambatkan lagi \npada original file / audio nya ya agar bersih hasilnya ny`);
            }
         }
         break

         case 'rvo':
         case 'readviewonce':
         case 'lihat':
         case '👍': {
            if (!m.quoted && body === '👍') return false
            else if (m.quoted && body === '👍' && !m?.quoted?.viewOnce) return false
            if (!m.quoted) return m.reply('Balas pesan 1x lihatnya');
            return await conn.viewOnce(m, m.chat, m.quoted.fakeObj);
         }
         break

         case 'removebg':
         case 'rbg': {
            if (!isLimit()) return
            if (!(/image/.test(mime))) {
               return m.reply('balas atau kirim gambar nya!')
            } else if (/image/.test(mime)) {
               const data = await Scraper.removeBG(await conn.download(quoted))
               await m.reply(data)
            }
            useLimit(2)
         }
         break

         case 'remini':
         case 'hd':
         case 'hdr': {
            if (!isLimit()) return
            if (/image|webp/.test(mime) || m.mtype === 'imageMessage' || m.mtype === 'stickerMessage') {
               if (!m.isGroup && !isPremium) return m.reply('HD Di Private Chat Hanya Pengguna Premium Saja\nHubungi Owner Untuk Upgrade Ke Premium .owner');
               m.react('🕒');
               const media = await toBuffer(await conn.download(quoted));
               conn.adReply(m.chat, loading, cover, m);
               const data = await Scraper.ihancer(media, {
                  size: isPremium ? 'high' : 'medium'
               });
               await conn.sendFile(m.chat, data, `${star} Berhasil`, m);
            } else {
               return m.reply(`Balas Atau Kirim image dengan caption ${prefix+command}`)
            }
            useLimit(5)
         }
         break

         case 'myip':
         case 'ip': {
            if (!isOwn()) return
            return m.reply(await Format.ip_address())
         }
         break

         case 'circle':
         case 'bulat': {
            if (!isLimit()) return
            if (/image/.test(mime) || m.mtype === 'imageMessage') {
               try {
                  m.react('🕒');
                  const content = await quoted.download();
                  conn.adReply(m.chat, loading, cover, m);
                  const image = text ? await Format.circle_photo(content, parseInt(text)) : await Format.circle_photo(content);
                  await conn.sendFile(m.chat, image, '', m);
               } catch (e) {
                  throw 'Error when converting! ' + e
               }
            } else {
               return m.reply(`Balas atau kirim gambar dengan caption ${prefix+command} yang mau di jadikan ke bulat\noptional kamu dapat menyesuaikan ukuran gambar contoh:\n${prefix+command} 300`)
            }
            useLimit(2)
         }
         break

         case 'getpp': {
            if (m?.quoted?.sender) {
               m.react('🕒')
               const data = await conn.profilePictureUrl(m.quoted.sender, 'image').catch(() => 'https://files.catbox.moe/a9911x.jpg')
               conn.sendFile(m.chat, data, '', m);
            } else if (text) {
               m.react('🕒')
               const number = text.startsWith('@') ? conn.parseMention(text)[0] : conn.decodeNum(text) + '@s.whatsapp.net';
               const data = await conn.profilePictureUrl(number, 'image').catch(() => 'https://files.catbox.moe/a9911x.jpg')
               conn.sendFile(m.chat, data, '', m);
            } else if (!text || !m?.quoted?.sender) {
               return m.reply(`balas salah satu pesan dia jika ingin pp getpp dia atau tag atau masukan nomor nya \ncontoh: ${prefix+command} @tag\natau: ${prefix+command} 62xxxx`);
            }
         }
         break

         case 'q':
         case 'quoted': {
            if (!m.quoted) return m.reply('balas pesan yang mengandung quoted');
            try {
               return await store.loadMessage(m.chat, m.quoted.id).then(async (update) => {
                  const sender = update.quoted.fakeObj.participant
                  const caption = update.quoted.text || ''
                  let buffer
                  try {
                     buffer = await conn.downloadMediaMessage(update.quoted)
                  } catch {
                     buffer = null
                  }
                  if (Buffer.isBuffer(buffer)) {
                     const ptt = update?.quoted?.ptt ? opus : {
                        ptt: false
                     }
                     conn.sendFile(m.chat, buffer, caption, m, {
                        ...ptt,
                        mentions: [sender, ...conn.parseMention(caption)]
                     })
                  } else {
                     m.reply(caption)
                  }
               })
            } catch (e) {
               throw 'unable to get quoted or quoted has expired\n' + e
            }
         }
         break

         case 'exif':
         case 'getexif': {
            if (!m.quoted) return m.reply('Balas stikernya!')
            if (/sticker/.test(m.quoted.mtype)) {
               const img = new Image();
               await img.load(await m.quoted.download());
               const data = JSON.parse(img.exif.slice(22).toString())
               const result = JSON.stringify(data, null, 2)
               conn.reply(m.chat, result, m);
            }
         }
         break

         case 'delete':
         case 'del':
         case 'd': {
            if (!isPrem()) return
            if (!m.quoted) return m.reply('Balas pesan yang mau di hapus! \n\nreply to the message you want to delete!');
            return await conn.removeMessage(m)
         }
         break

         case 'cutaudio':
         case 'pangkasaudio':
         case 'cutvideo':
         case 'pangkasvideo': {
            if (/cutaudio|pangkasaudio/.test(command)) {
               if (/audio|document/.test(mime) || m.mtype === 'audioMessage' || m.mtype === 'documentMessage') {
                  const time_1 = text.split(' ')[0]
                  if (!time_1) return m.reply(`contoh ${prefix+command} awal akhir\ncontoh ${prefix+command} 00:01 01:25\n\nsesuaikan saja waktunya perhatikan juga panjang waktu audionya\n\njika ingin jadi voice note tambahkan di belakang\n--vn atau --ptt\n\ncontoh\n${prefix+command} 00:01 01:25 --vn\natau\n${prefix+command} 00:01 01:25 --ptt`);
                  const time_2 = text.split(' ')[1]
                  if (!time_2) return m.reply(`contoh ${prefix+command} awal akhir\ncontoh ${prefix+command} 00:01 01:25\n\nsesuaikan saja waktunya perhatikan juga panjang waktu audionya\n\njika ingin jadi voice note tambahkan di belakang\n--vn atau --ptt\n\ncontoh\n${prefix+command} 00:01 01:25 --vn\natau\n${prefix+command} 00:01 01:25 --ptt`);
                  m.reply('Tunggu Sedang Di Proses..');
                  const audio = await conn.download(quoted);
                  const data = await Format.crop_audio(audio, time_1, time_2);
                  m.reply('Done')
                  conn.sendFile(m.chat, data, '', m, {
                     ptt: text.includes('--vn') || text.includes('--ptt') ? true : false
                  })
               } else {
                  return m.reply('Balas audio nya Mana ?')
               }
            } else if (/cutvideo|pangkasvideo/.test(command)) {
               if (/video|document/.test(mime) || m.mtype === 'videoMessage' || m.mtype === 'documentMessage') {
                  const time_1 = text.split(' ')[0]
                  if (!time_1) return m.reply(`contoh ${prefix+command} awal akhir\ncontoh ${prefix+command} 00:01 01:25\n\nsesuaikan saja waktunya perhatikan juga panjang waktu videonya`);
                  const time_2 = text.split(' ')[1]
                  if (!time_2) return m.reply(`contoh ${prefix+command} awal akhir\ncontoh ${prefix+command} 00:01 01:25\n\nsesuaikan saja waktunya perhatikan juga panjang waktu videonya`);
                  m.reply('Tunggu Sedang Di Proses..');
                  const video = await conn.download(quoted);
                  const data = await Format.crop_video(video, time_1, time_2);
                  m.reply('Done')
                  conn.sendFile(m.chat, data, '', m)
               } else {
                  return m.reply('Balas audio / video nya Mana ?')
               }
            }
         }
         break

         case 'crop':
         case 'resize': {
            if (/image/.test(mime) || m.mtype === 'imageMessage') {
               if (!text) return m.reply(`balas atau kirim photo dengan text \ncontoh ${prefix+command} lebar panjang\ncontoh ${prefix+command} 480 480`)
               const s_1 = text.split(' ')[0]
               if (!s_1) throw `contoh ${prefix+command} lebar\ncontoh ${prefix+command} 480 480`
               const s_2 = text.split(' ')[1]
               if (!s_2) throw `contoh ${prefix+command} panjang\ncontoh ${prefix+command} 480 480`
               m.reply('Tunggu Sedang Di Proses..')
               const image = await conn.download(quoted)
               const data = await Format.crop(image, s_1, s_2)
               conn.sendFile(m.chat, data, 'Done!', m);
            } else {
               throw 'Photonya Mana ?'
            }
         }
         break

         case 'bass':
         case 'blown':
         case 'deep':
         case 'earrape':
         case 'fast':
         case 'nightcore':
         case 'reverse':
         case 'robot':
         case 'slow':
         case 'smooth':
         case 'tupai': {
            if (!isLimit()) return
            let set;
            if (/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20'
            if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
            if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
            if (/earrape/.test(command)) set = '-af volume=12'
            if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
            if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
            if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
            if (/reverse/.test(command)) set = '-filter_complex "areverse"'
            if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
            if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
            if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
            if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
            if (/audio|document|video/.test(mime) || m.mtype === 'documentMessage' || m.mtype === 'audioMessage' || m.mtype === 'videoMessage') {
               m.react('🎻');
               const media = await conn.download(quoted);
               const ran = './tmp/' + Format.getRandom('.mp3')
               exec(`ffmpeg -i ${media} ${set} ${ran}`, async (err, stderr, stdout) => {
                  if (err) return m.reply(`${err}`)
                  const buff = await fs.promises.readFile(ran);
                  conn.sendFile(m.chat, await Format.mp3(buff), {
                     ...opus,
                     quoted: m
                  })
               })
            } else {
               return m.reply(`Balas audio yang ingin diubah dengan caption *${prefix + command}*`)
            }
            useLimit(1)
         }
         break

         case 'tambah':
         case 'kurang':
         case 'kali':
         case 'bagi': {
            if (!text) return m.reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`);
            var num_one = text.split(' ')[0];
            var num_two = text.split(' ')[1];
            if (!num_one) return m.reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`);
            if (!num_two) return m.reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`);
            var nilai_one = Number(num_one);
            var nilai_two = Number(num_two);
            if (command == 'tambah') m.reply(`${nilai_one + nilai_two}`);
            else if (command == 'kurang') m.reply(`${nilai_one - nilai_two}`);
            else if (command == 'kali') m.reply(`${nilai_one * nilai_two}`);
            else if (command == 'bagi') m.reply(`${nilai_one / nilai_two}`);
         }
         break

         case 'on':
         case 'off':
         case 'enable':
         case 'disable': {
            const cmd_on = ['on', 'enable']
            const cmd_off = ['off', 'disable']
            const owner_admin = isOwner || isAdmins
            const $ = `${prefix + command} `
            let caption = `*List Options ${command}*\n*contoh:* \n\n`
            caption += $ + `welcome \n`
            caption += $ + `antilink \n`
            caption += $ + `viewonce / once \n`
            caption += $ + `antitoxic / toxic \n`
            caption += $ + `antiphoto \n`
            caption += $ + `antibot \n`
            caption += $ + `antitagsw \n\n`;
            if (isOwner) {
               caption += zw + ` *OWNER* \n`
               caption += $ + `antispam / spam \n`
               caption += $ + `hd / remini\n`
               caption += $ + `sholat / autosholat\n`
               caption += $ + `blockpc / autoblockpc\n`
               caption += $ + `autodl / auto_down \n`
               caption += $ + `autobackup \n`
               caption += $ + `anticall \n`
               caption += $ + `autoreadsw / readsw\n`
               caption += $ + `autoreactsw / reactsw\n`
               caption += $ + `chat_ai / ai \n`
               caption += $ + `auto_sticker / sticker\n\n`
               caption += $ + `*jadibot*\nUntuk menyalakan atau mematikan fitur jadibot\n\n`
               caption += $ + `*autobackupall* \nuntuk menyalakan atau mematikan semua auto backup database\n\n`
               caption += $ + `*grouponly / gconly*\nUntuk mengganti akses bot ke mode group atau keduanya private and group\n\n`
               caption += $ + `*respononlygroup / respononlygc*\nUntuk mematikan dan mengaktifkan respon message groupOnly\n\n`
               caption += $ + '*adreply*\nUntuk mengaktifkan mode pesan dengan thumbnail atau photo\n\n'
               caption += $ + '*limitpesan*\nUntuk mengaktifkan pesan limit yang di gunakan\n\n'
               caption += $ + '*limitadreply*\nUntuk mengaktifkan pesan limit yang di gunakan dengan cover atau foto thumbnail\n\n'
               caption += $ + '*mystery / misteri*\nUntuk mematikan dan mengaktifkan misteri box\n\n'
               caption += $ + '*typinggc / typinggroup*\nUntuk mematikan dan mengaktifkan typing atau mengetik di group\n\n'
               caption += $ + '*typingpc / typingprivate*\nUntuk mematikan dan mengaktifkan typing atau mengetik di private chat\n\n'
               caption += $ + '*recordinggc / recordinggroup*\nUntuk mematikan dan mengaktifkan recording atau merekam di group\n\n'
               caption += $ + '*recordingpc / recordingprivate*\nUntuk mematikan dan mengaktifkan recording atau merekam di private chat\n\n'
               caption += $ + '*readgc / readgroup*\nUntuk mematikan dan mengaktifkan read atau membaca chat di group\n\n'
               caption += $ + '*readpc / readprivate*\nUntuk mematikan dan mengaktifkan read atau membaca chat di private chat\n\n'
               caption += $ + `*auto_clear_chat / clearchat*\nUntuk mengaktifkan dan mematikan clear chat (membersihkan chat ke group)\n\n`
               caption += 'Untuk mengubah pengaturan lain ada juga di menu .set'
            };
            if (!text) return m.reply(caption.trim());
            switch (text.toLowerCase()) {
               case 'welcome': {
                  if (!m.isGroup) return m.reply(mess.group);
                  if (!owner_admin) return m.reply(mess.admin);
                  if (cmd_on.includes(command)) {
                     db.chats[m.chat].welcome = true
                     m.reply(`Welcome Berhasil Di Nyalakan Di Group ${groupName}`)
                  } else if (cmd_off.includes(command)) {
                     db.chats[m.chat].welcome = false
                     m.reply(`Welcome Berhasil Di Matikan Di Group ${groupName}`)
                  }
               }
               break
               case 'antilink': {
                  if (!m.isGroup) return m.reply(mess.group);
                  if (!owner_admin) return m.reply(mess.admin);
                  if (cmd_on.includes(command)) {
                     db.chats[m.chat].antilink = true
                     m.reply(`Antilink berhasil diaktifkan di grup ${groupName}`);
                  } else if (cmd_off.includes(command)) {
                     db.chats[m.chat].antilink = false
                     m.reply(`Antilink berhasil matikan di grup ${groupName}`);
                  }
               }
               break
               case 'viewonce':
               case 'once': {
                  if (!m.isGroup) return m.reply(mess.group);
                  if (!owner_admin) return m.reply(mess.admin);
                  if (cmd_on.includes(command)) {
                     db.chats[m.chat].viewOnce = true
                     m.reply(`View Once berhasil diaktifkan di grup ${groupName}`);
                  } else if (cmd_off.includes(command)) {
                     db.chats[m.chat].viewOnce = false
                     m.reply(`View Once berhasil dimatikan di grup ${groupName}`);
                  }
               }
               break
               case 'anticall': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.anticall = false', 'global.anticall = true');
                     m.reply('anti call berhasil di aktifkan')
                  } else if (cmd_off.includes(command)) {
                     save.global('global.anticall = true', 'global.anticall = false');
                     m.reply('anti call berhasil di matikan')
                  }
               }
               break
               case 'blockpc':
               case 'autoblockpc': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     db.settings.block_pc = true
                     m.reply('auto block private chat berhasil di aktifkan')
                  } else if (cmd_off.includes(command)) {
                     db.settings.block_pc = false
                     m.reply('auto block private chat berhasil di matikan')
                  }
               }
               break
               case 'clearchat':
               case 'auto_clear_chat': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     const status = await checkState();
                     if (!status) return m.reply('auto clear chat gagal di aktifkan karena file state di folder sessions hilang atau tidak ada');
                     db.settings.auto_clear_chat = true
                     m.reply('auto clear chat berhasil di aktifkan')
                  } else if (cmd_off.includes(command)) {
                     db.settings.auto_clear_chat = false
                     m.reply('auto clear chat berhasil di matikan')
                  }
               }
               break
               case 'sholat':
               case 'autosholat': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.auto_sholat = false', 'global.auto_sholat = true');
                     m.reply('auto sholat berhasil di aktifkan')
                  } else if (cmd_off.includes(command)) {
                     save.global('global.auto_sholat = true', 'global.auto_sholat = false');
                     m.reply('auto sholat berhasil di matikan')
                  }
               }
               break
               case 'autodl':
               case 'auto_down': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     db.settings.auto_down = true
                     m.reply(`auto download berhasil diaktifkan`);
                  } else if (cmd_off.includes(command)) {
                     db.settings.auto_down = false
                     m.reply(`auto download berhasil matikan`);
                  }
               }
               break
               case 'auto_sticker':
               case 'sticker':
               case 'stiker': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     db.settings.auto_sticker = true
                     m.reply(`auto sticker berhasil diaktifkan\nsekarang kamu dapat membuat stiker hanya dengan mengirim foto`);
                  } else if (cmd_off.includes(command)) {
                     db.settings.auto_sticker = false
                     m.reply(`auto sticker berhasil matikan`);
                  }
               }
               break
               case 'antitoxic':
               case 'toxic': {
                  if (!m.isGroup) return m.reply(mess.group);
                  if (!owner_admin) return m.reply(mess.admin);
                  if (cmd_on.includes(command)) {
                     db.chats[m.chat].antiToxic = true
                     m.reply(`Anti Toxic berhasil diaktifkan di grup ${groupName}`);
                  } else if (cmd_off.includes(command)) {
                     db.chats[m.chat].antiToxic = false
                     m.reply(`Anti Toxic berhasil dimatikan di grup ${groupName}`);
                  }
               }
               break
               case 'antiphoto': {
                  if (!m.isGroup) return m.reply(mess.group);
                  if (!owner_admin) return m.reply(mess.admin);
                  if (cmd_on.includes(command)) {
                     db.chats[m.chat].antiPhoto = true
                     m.reply(`Anti Photo berhasil diaktifkan di grup ${groupName}`);
                  } else if (cmd_off.includes(command)) {
                     db.chats[m.chat].antiPhoto = false
                     m.reply(`Anti Photo berhasil dimatikan di grup ${groupName}`);
                  }
               }
               break
               case 'antibot': {
                  if (!m.isGroup) return m.reply(mess.group);
                  if (!owner_admin) return m.reply(mess.admin);
                  if (cmd_on.includes(command)) {
                     db.chats[m.chat].antiBot = true
                     m.reply(`Anti Bot berhasil diaktifkan di grup ${groupName}`);
                  } else if (cmd_off.includes(command)) {
                     db.chats[m.chat].antiBot = false
                     m.reply(`Anti Bot berhasil dimatikan di grup ${groupName}`);
                  }
               }
               break
               case 'antitagsw': {
                  if (!m.isGroup) return m.reply(mess.group);
                  if (!owner_admin) return m.reply(mess.admin);
                  if (cmd_on.includes(command)) {
                     db.chats[m.chat].tagsw = true
                     m.reply(`Anti Tag SW berhasil diaktifkan di grup ${groupName}`);
                  } else if (cmd_off.includes(command)) {
                     db.chats[m.chat].tagsw = false
                     m.reply(`Anti Tag SW berhasil dimatikan di grup ${groupName}`);
                  }
               }
               break
               case 'hd':
               case 'remini': {
                  if (!m.isGroup) return m.reply(mess.group);
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     db.chats[m.chat].hd = true
                     m.reply(`HD / Remini berhasil diaktifkan di grup ${groupName}`);
                  } else if (cmd_off.includes(command)) {
                     db.chats[m.chat].hd = false
                     m.reply(`HD / Remini berhasil dimatikan di grup ${groupName}`);
                  }
               }
               break
               case 'autoreadsw':
               case 'readsw': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     db.settings.readsw = true
                     m.reply(`auto readsw berhasil diaktifkan`);
                  } else if (cmd_off.includes(command)) {
                     db.settings.readsw = false
                     m.reply(`auto readsw berhasil dimatikan`);
                  }
               }
               break
               case 'autoreactsw':
               case 'reactsw': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     db.settings.reactsw = true
                     m.reply(`auto reactsw berhasil diaktifkan`);
                  } else if (cmd_off.includes(command)) {
                     db.settings.reactsw = false
                     m.reply(`auto reactsw berhasil dimatikan`);
                  }
               }
               break
               
               case 'antispam':
               case 'spam': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     db.settings.antispam = true
                     m.reply(`anti spam berhasil diaktifkan`);
                  } else if (cmd_off.includes(command)) {
                     db.settings.antispam = false
                     m.reply(`anti spam berhasil dimatikan`);
                  }
               }
               break
               case 'chat_ai':
               case 'ai': {
                  if (!m.isGroup && !isPremium) return m.reply(mess.premium)
                  if (m.isGroup && !owner_admin) return m.reply(mess.admin);
                  if (!m.isGroup && cmd_on.includes(command)) {
                     db.users[m.sender].chat_ai = true
                     m.reply(`Auto Chat AI Berhasil Di Nyalakan`);
                  } else if (m.isGroup && cmd_on.includes(command)) {
                     db.chats[m.chat].chat_ai = true
                     m.reply(`Auto Chat AI Berhasil Di Nyalakan Di Group ${groupName}`);
                  } else if (!m.isGroup && cmd_off.includes(command)) {
                     db.users[m.sender].chat_ai = false
                     m.reply(`Auto Chat AI Berhasil Di Matikan`);
                  } else if (m.isGroup && cmd_off.includes(command)) {
                     db.chats[m.chat].chat_ai = false
                     m.reply(`Auto Chat AI Berhasil Di Matikan Di Group ${groupName}`);
                  }
               }
               break
               case 'jadibot': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.jadibot_engine = false', 'global.jadibot_engine = true');
                     m.reply(`Fitur jadibot sekarang di aktifan\njadibot siap digunakan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.jadibot_engine = true', 'global.jadibot_engine = false');
                     m.reply(`Fitur jadibot sukses di matikan`);
                  }
               }
               break
               case 'grouponly':
               case 'gconly': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.group_mode = false', 'global.group_mode = true');
                     m.reply(`Sukses Mengubah Ke Group Mode \nPrivate Chat Tidak Bisa Di Akses Kecuali Aku , Owner Dan Premium`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.group_mode = true', 'global.group_mode = false');
                     m.reply(`Sukses Mematikan Group Mode Sekarang Private Chat Dapat Diakses Semua Orang`);
                  }
               }
               break
               case 'respononlygroup':
               case 'respononlygc': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.group_only_message = false', 'global.group_only_message = true');
                     m.reply(`Sukses Mengaktifkan Respon ${mess.groupOnly} Pada Chat Pribadi\nJika Mode Group Aktif Dan Jika Ada Pesan Datang Di Pribadi Chat, Kecuali Aku, Owner, Dan Premium Maka Akan Merespon ${mess.groupOnly}\n`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.group_only_message = true', 'global.group_only_message = false');
                     m.reply(`Sukses Mematikan Respon Pesan ${mess.groupOnly} Pada Chat Pribadi\nJika Mode Group Aktif Dan Jika Ada Pesan Datang Di Pribadi Chat, Kecuali Aku, Owner, Dan Premium Maka Sama Sekali Tidak Akan Merespon Apapun\n`);
                  }
               }
               break
               case 'adreply': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.adReply = false', 'global.adReply = true');
                     m.reply(`adReply Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.adReply = true', 'global.adReply = false');
                     m.reply(`adReply Berhasil Di Matifkan`);
                  }
               }
               break
               case 'limitadreply': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.limit_adReply = false', 'global.limit_adReply = true');
                     m.reply(`Limit adReply Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.limit_adReply = true', 'global.limit_adReply = false');
                     m.reply(`Limit adReply Berhasil Di Matifkan`);
                  }
               }
               break
               case 'limitpesan': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.use_limit_message = false', 'global.use_limit_message = true');
                     m.reply(`Limit Pesan Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.use_limit_message = true', 'global.use_limit_message = false');
                     m.reply(`Limit Pesan Berhasil Di Matifkan`);
                  }
               }
               break
               case 'mystery':
               case 'misteri': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.mystery_box = false', 'global.mystery_box = true');
                     m.reply(`Mystery Box Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.mystery_box = true', 'global.mystery_box = false');
                     m.reply(`Mystery Box Berhasil Di Matikan`);
                  }
               }
               break
               case 'typinggc':
               case 'typinggroup': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.typing_group = false', 'global.typing_group = true');
                     m.reply(`Typing Group / Mengetik Di Group Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.typing_group = true', 'global.typing_group = false');
                     m.reply(`Typing Group / Mengetik Di Group Berhasil Di Matikan`);
                  }
               }
               break
               case 'typingpc':
               case 'typingprivate': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.typing_private = false', 'global.typing_private = true');
                     m.reply(`Typing Private / Mengetik Di Private Chat Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.typing_private = true', 'global.typing_private = false');
                     m.reply(`Typing Private / Mengetik Di Private Chat Berhasil Di Matikan`);
                  }
               }
               break
               case 'recordinggc':
               case 'recordinggroup': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.recording_group = false', 'global.recording_group = true');
                     m.reply(`Recording Group / Merekam Di Group Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.recording_group = true', 'global.recording_group = false');
                     m.reply(`Recording Group / Merekam Di Group Berhasil Di Matikan`);
                  }
               }
               break
               case 'recordingpc':
               case 'recordingprivate': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.recording_private = false', 'global.recording_private = true');
                     m.reply(`Recording Private / Merekam Di Private Chat Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.recording_private = true', 'global.recording_private = false');
                     m.reply(`Recording Private / Merekam Di Private Chat Berhasil Di Matikan`);
                  }
               }
               break
               case 'readgc':
               case 'readgroup': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.read_group = false', 'global.read_group = true');
                     m.reply(`Read Group / Membaca Di Group Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.read_group = true', 'global.read_group = false');
                     m.reply(`Read Group / Membaca Di Group Berhasil Di Matikan`);
                  }
               }
               break
               case 'readpc':
               case 'readprivate': {
                  if (!isOwner) return m.reply(mess.owner);
                  if (cmd_on.includes(command)) {
                     save.global('global.read_private = false', 'global.read_private = true');
                     m.reply(`Read Private / Membaca Di Private Chat Berhasil Di Aktifkan`);
                  } else if (cmd_off.includes(command)) {
                     save.global('global.read_private = true', 'global.read_private = false');
                     m.reply(`Read Private / Membaca Di Private Chat Berhasil Di Matikan`);
                  }
               }
               break
            };

            const off = async () => {
               await save.global('global.backup_mongo = true', 'global.backup_mongo = false');
               await save.global('global.backup_github = true', 'global.backup_github = false');
               await save.global('global.backup_gitlab = true', 'global.backup_gitlab = false');
               await save.global('global.backup_supabase = true', 'global.backup_supabase = false');
            };
            if (cmd_off.includes(command) && /autobackupall/g.test(text)) {
               if (!isOwner) return m.reply(mess.owner);
               await m.reply('Mematikan semua auto backup...');
               await off();
               return m.reply('Semua auto backup berhasil dimatikan ✅');
            };
            if (cmd_on.includes(command) && /autobackupall/g.test(text)) {
               if (!isOwner) return m.reply(mess.owner);
               const pick = text.split(" ")[1];
               const order = ['mongo', 'github', 'gitlab', 'supabase'];
               if (!pick) return m.reply(`masukan database utama kamu dulu\ncontoh:\n${prefix+command} autobackupall mongo`);
               if (!order.includes(pick)) return m.reply('main harus salah satu dari: mongo, github, gitlab, supabase');
               const list = [pick, ...order.filter(x => x !== pick)];
               if (cmd_on.includes(command)) {
                  await m.reply(`Menyalakan auto backup semua database...`)
                  await off();
                  await Format.autoBackupAllDB(m, list, restoreMongo, restoreGithub, restoreGitlab, restoreSupabase);
                  return await m.reply('Semua auto backup database berhasil diproses\nrestarting...'), sleep(2000), reset();
               }
            };

            if (/autobackup/g.test(text) || text.split(" ")[1]) {
               if (!isOwner) return m.reply(mess.owner);
               const pick = text.split(" ")[1];
               const backupall = `\n\n(optional) kamu juga bisa menyalakan atau mematikan semua autobackup dengan mengetik ${prefix+command} autobackupall\ntapi jika semua nya sudah diisi dengan benar dan tempat backup nya memang sudah kamu buat atau sudah jadi`;
               if (!pick) throw `masukan tempat database yang di gunakan contoh:\n${prefix+command} ${text} mongo \n\nhanya tersedia: \n\nmongo\ngithub\ngitlab\nsupabase` + backupall;
               if (!['mongo', 'github', 'gitlab', 'supabase'].includes(pick)) throw 'hanya ada (mongo, github, gitlab, supabase) saja sekarang' + backupall;
               if (cmd_on.includes(command) && pick === 'mongo') {
                  if (backup_mongo) throw 'autobackup monggo audah di aktifkan atau di nyalakan sebelum nya untuk cek ketik .status';
                  m.reply('menyalakan auto backup db ke mongo...')
                  const response = await restoreMongo();
                  if (!response) {
                     return response
                  } else {
                     await save.global('global.backup_mongo = false', 'global.backup_mongo = true');
                     await m.reply('auto backup monggo database berhasil di aktifkan\nrestarting...')
                     reset()
                  }
               } else if (cmd_off.includes(command) && pick === 'mongo') {
                  if (!backup_mongo) throw 'autobackup monggo audah di nonaktifkan atau dimatikan sebelumnya\nuntuk cek ketik .status';
                  await m.reply('mematikan auto backup db ke mongo...')
                  await save.global('global.backup_mongo = true', 'global.backup_mongo = false');
                  return m.reply('auto backup monggo database berhasil di matikan');
               } else if (cmd_on.includes(command) && pick === 'github') {
                  if (backup_github) throw 'autobackup github sudah di aktifkan atau di nyalakan sebelum nya untuk cek ketik .status';
                  m.reply('menyalakan auto backup db ke cloud github...')
                  const data = await restoreGithub();
                  if (!data.status) {
                     await m.reply('Gagal Menyalakan autobackup github')
                     throw data
                  } else if (data.status) {
                     await save.global('global.backup_github = false', 'global.backup_github = true')
                     return await m.reply('auto backup github database berhasil di aktifkan\nrestarting...'), reset()
                  }
               } else if (cmd_off.includes(command) && pick === 'github') {
                  if (!backup_github) throw 'autobackup github sudah di nonaktifkan atau dimatikan sebelumnya\nuntuk cek ketik .status';
                  await m.reply('mematikan auto backup db ke cloud github...')
                  save.global('global.backup_github = true', 'global.backup_github = false');
                  return m.reply('auto backup database github berhasil di matikan')
               } else if (cmd_on.includes(command) && pick === 'gitlab') {
                  if (backup_gitlab) throw 'autobackup gitlab sudah di aktifkan atau di nyalakan sebelum nya untuk cek ketik .status';
                  m.reply('menyalakan auto backup db ke cloud gitlab...')
                  const data = await restoreGitlab();
                  if (!data.status) {
                     await m.reply('Gagal Menyalakan autobackup gitlab')
                     throw data
                  } else if (data.status) {
                     await save.global('global.backup_gitlab = false', 'global.backup_gitlab = true')
                     return await m.reply('auto backup gitlab database berhasil di aktifkan\nrestarting...'), reset()
                  }
               } else if (cmd_off.includes(command) && pick === 'gitlab') {
                  if (!backup_gitlab) throw 'autobackup gitlab sudah di nonaktifkan atau dimatikan sebelumnya\nuntuk cek ketik .status';
                  await m.reply('mematikan auto backup db ke cloud gitlab...')
                  save.global('global.backup_gitlab = true', 'global.backup_gitlab = false');
                  return m.reply('auto backup database gitlab berhasil di matikan')
               } else if (cmd_on.includes(command) && pick === 'supabase') {
                  if (backup_supabase) throw 'autobackup supabase sudah di aktifkan atau di nyalakan sebelum nya untuk cek ketik .status';
                  m.reply('menyalakan auto backup db ke cloud supabase...')
                  const data = await restoreSupabase();
                  if (!data.status) {
                     await m.reply('Gagal Menyalakan autobackup supabase')
                     throw data
                  } else if (data.status) {
                     await save.global('global.backup_supabase = false', 'global.backup_supabase = true')
                     return await m.reply('auto backup supabase database berhasil di aktifkan\nrestarting...'), reset()
                  }
               } else if (cmd_off.includes(command) && pick === 'supabase') {
                  if (!backup_supabase) throw 'autobackup supabase sudah di nonaktifkan atau dimatikan sebelumnya\nuntuk cek ketik .status';
                  await m.reply('mematikan auto backup db ke cloud supabase...')
                  save.global('global.backup_supabase = true', 'global.backup_supabase = false');
                  return m.reply('auto backup database supabase berhasil di matikan')
               }
            }
         }
         break        
      }
      /** END CASE  **/
      if (value(body, ['>', ')'])) {
         if (!isOwner || m.isBaileys) return
         try {
            return await m.reply(format(await eval(`(async()=>{${body.replace(/;/g, '').slice(2)}})()`)))
         } catch (e) {
            return await m.reply(format(e));
         }
      } else if (value(body, ['=>', '->', '~>', '=)', '-)'])) {
         if (!isOwner || m.isBaileys) return
         try {
            return await m.reply(format(await eval(`(async()=> ${body.replace(/;/g, '').slice(3)})()`)));
         } catch (e) {
            return await m.reply(format(e));
         }
      } else if (value(body, ['$', '*'])) {
         if (!isOwner || m.isBaileys) return
         m.reply('> executing...')
         return await exec(body.slice(1) || body.slice(2), async (error, stdout) => {
            if (error) await m.reply(format(error).trim());
            if (stdout) await m.reply(format(stdout).trim());
         })
      }
      if (((!m.isGroup && db.users[m.sender].chat_ai) || (m.isGroup && db.chats[m.chat]?.chat_ai)) && body && !m.isBaileys) {
         const evaluate = ['module', 'exports', '>', '=', '-', '~', '$', ...isPrefix];
         const rejected = evaluate?.some(v => body?.startsWith(v));
         if (!rejected) {
            try {
               const data = await toJSON(`https://api.azbry.com/api/ai/aiko?q=${body}`);
               await conn.reply(m.chat, data.response.replace(/(Saya Aiko!|"Aiko"|Aiko|[*])/g, '').trim(), m);
            } catch (e) {
               console.error(e)
            }
         }
      }
      if (db.settings?.auto_down && !m.isBaileys) {
         const fbLink = body?.match(/(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.gg)\/[^\s]+/)?.[0];
         if (fbLink) {
            if (validatePrefixCmd(body, 'fb|facebook|fbdl')) return
            if (db.users[m.sender].limit < 0) return m.reply(mess.limit);
            m.react('🕒');
            const data = await fbdl(fbLink);
            for await (let media of data) await conn.sendFile(m.chat, media, '*Facebook*', m), await sleep(2000)
            db.users[m.sender].limit -= 3
            m.reply(limit_message.replace('%limit', 3))
         }
         if (body.match(/(https?:\/\/(?:www\.)?instagram\.[a-z\.]{2,6}\/[\w\-\.]+(\/[^\s]*)?)/g)) {
            if (validatePrefixCmd(body, 'ig|instagram|insta|igdl')) return
            if (db.users[m.sender].limit < 0) return m.reply(mess.limit);
            m.react('🕘')
            const data = await igdl(body);
            for await (let v of data) {
               const video = await conn.getMime(v)
               if (/video/.test(video)) {
                  await conn.sendFile(m.chat, v, '', m)
               } else {
                  const media = (await conn.getFile(v)).res;
                  const outPath = media.replace(/\.\w+$/, '.png');
                  await new Promise(async (resolve, reject) => {
                     await exec(`ffmpeg -i ${media} ${outPath}`, (err) => {
                        if (err) reject(err);
                        else resolve();
                     })
                  })
                  await m.reply(await toBuffer(outPath));
               }
            }
            db.users[m.sender].limit -= 3
            m.reply(limit_message.replace('%limit', 3));
         }
         const ttLink = /(http(?:s)?:\/\/)?(?:www\.)?(?:tiktok\.com\/@[^\/]+\/video\/(\d+))|(http(?:s)?:\/\/)?vm\.tiktok\.com\/([^\s&]+)|(http(?:s)?:\/\/)?vt\.tiktok\.com\/([^\s&]+)/g;
         if (ttLink.test(body)) {
            if (validatePrefixCmd(body, 'tt|tiktok|ttdl')) return
            if (db.users[m.sender].limit < 0) return m.reply(mess.limit);
            const tiktokLinks = body.match(ttLink);
            for (let tiktokLink of tiktokLinks) {
               m.react('🕒');
               const {
                  title,
                  author,
                  like,
                  comment,
                  share,
                  video
               } = await ttdl(tiktokLink);
               let caption = `🎗 𝐓𝐈𝐊𝐓𝐎𝐊\n`
               caption += `⭔ Name: ${author}\n`
               caption += `⭔ Like: ${like}\n`
               caption += `⭔ Comment: ${comment}\n`
               caption += `⭔ Description : ${title}\n`
               caption += `${star} ${setting.botName}`
               await conn.sendFile(m.chat, video, caption, m);
               db.users[m.sender].limit -= 3;
               m.reply(limit_message.replace('%limit', 3));
            }
         }
         const linksRegex = /(http(?:s)?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/g;
         const shortsRegex = /(http(?:s)?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^\s&]+)/g;
         const linkMatch = body.match(linksRegex) || body.match(shortsRegex);
         if (linkMatch) {
            if (validatePrefixCmd(body, 'yt|ytv|yta|ytmp3|ytmp4|play|ytmp4doc|ytvdoc')) return
            if (db.users[m.sender].limit < 0) return m.reply(mess.limit);
            m.react('⏰');
            const data = await Scraper.ocean(linkMatch[0], 'mp4', 720)
               .catch(async () => await Scraper.ocean(linkMatch[0], 'mp4', 1080))
               .catch(async () => await Scraper.ocean(linkMatch[0], 'mp4', 480))
               .catch(async () => await Scraper.ocean(linkMatch[0], 'mp4', 360))
            const caption = `🎬 *YouTube* \n${data.title}`;
            await conn.sendFile(m.chat, data.media, caption, m);
            db.users[m.sender].limit -= 3;
            m.reply(limit_message.replace('%limit', 3));
         }
      }
      const prayerTimes = {
         '04:37': 'Subuh',
         '12:04': 'Zuhur',
         '15:13': 'Ashar',
         '18:12': 'Maghrib',
         '19:23': 'Isya'
      };
      if (prayerTimes[waktu.time] && !running && !m.isBaileys) {
         const caption = `Hai Ka @${m.sender.split("@")[0]} waktu ${prayerTimes[waktu.time]} telah tiba silahkan ambil air wudhu dan segera laksanakan sholat`;
         conn.reply(m.chat, caption, m, {
            mentions: [m.sender]
         }), running = true
         await Format.sleep(60000).then(() => running = false, console.log(running));
      }
      if (word(body, 'open') && gift[m.chat] && m.isGroup && !m.isBaileys) {
         if (gift[m.chat]) gift[m.chat].lastActive = Date.now();
         await m.reply('Tunggu Sedang Membuka Kotak');
         const caption = `🎁 *Selamat @${m.sender.split('@')[0]} Kamu Mendapatkan* 🎉\n` +
            `*+${gift[m.chat].hadiah.limit} Limit* 🎟\n` +
            `*+${gift[m.chat].hadiah.uang} Uang* 💰\n` +
            `*Mystery Box Akan Ada Lagi Selanjutnya* ♻`;
         conn.reply(m.chat, caption, gift[m.chat].msg, {
            contextInfo: {
               mentionedJid: [m.sender]
            }
         });
         db.users[m.sender].limit += parseInt(gift[m.chat].hadiah.limit);
         db.users[m.sender].uang += parseInt(gift[m.chat].hadiah.uang);
         await Format.sleep(1000);
         await m.delete(gift[m.chat].msg.key);
         delete gift[m.chat];
      } else if (word(body, 'open') && !gift[m.chat] && m.isGroup && !m.isBaileys) {
         m.reply('Ups Kotak Mystery Mungkin Sudah Kadaluwarsa, Tunggu Selanjutnya!');
      }
      if (caklontong.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.cak') && !body.includes('.caklontong') && !m.isBaileys) {
         const rewards = {
            limit: 15,
            uang: 25
         }
         const lon = Math.floor(Math.random() * 3)
         const tong = ['❎ Salah', '😵 Kurang Tepat', '😪 Belum Benar'][lon]
         let jawaban = caklontong[m.sender.split('@')[0]]
         let deskripsi = caklontong_desc[m.sender.split('@')[0]]
         if (body.toLowerCase() === jawaban) {
            await conn.adReply(m.chat, `Jawaban Benar 🎉 \n*${deskripsi}* \nKamu mendapatkan:\n+ ${rewards.limit} limit 🎟\n+ ${rewards.uang} uang 💰`, setting.thumbnail, m)
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            delete caklontong[m.sender.split('@')[0]]
            delete caklontong_desc[m.sender.split('@')[0]]
         } else {
            return m.reply(tong)
         }
      } else if (('family100' + m.chat in family100) && body && !body.includes('.family100') && !body.includes('.family') && !m.isBaileys) {
         const rewards = {
            limit: 10,
            uang: 30
         }
         const room = family100['family100' + m.chat]
         const teks = body.toLowerCase().replace(/[^\w\s\-]+/, '')
         const isSurender = /^((me)?nyerah|surr?ender)$/i.test(body)
         if (!isSurender) {
            const index = room.jawaban.findIndex(v => v.toLowerCase().replace(/[^\w\s\-]+/, '') === teks)
            if (room.terjawab[index]) return !0
            room.terjawab[index] = m.sender
         }
         const isWin = room.terjawab.length === room.terjawab.filter(v => v).length
         const caption = `Jawablah Pertanyaan Berikut :\n\n*${room.soal}*\n\nTerdapat ${room.jawaban.length} Jawaban ${room.jawaban.find(v => v.includes(' ')) ? `(beberapa Jawaban Terdapat Spasi)` : ''} ${isWin ? `\n*Selamat 🎉 Semua Jawaban Terjawab*\n*Setiap Jawaban Benar Bernilai*\n*+ ${rewards.limit} limit* 🎟\n*+ ${rewards.uang} Uang* 💰\n` : isSurender ? 'Menyerah!' : ''}\n${Array.from(room.jawaban, (jawaban, index) => {
            return isSurender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false
         }).filter(v => v).join('\n')}
         ${isSurender ? '' : ` `}`.trim()
         conn.sendText(m.chat, caption, m, {
            contextInfo: {
               mentionedJid: m.isLid ? conn.parseMentionLid(caption) : conn.parseMention(caption)
            }
         }).then(mes => {
            return family100['family100' + m.chat].pesan = mes
         }).catch(_ => _)
         const users = m.isLid ? conn.parseMentionLid(caption) : conn.parseMention(caption)
         const givingAway = async () => {
            for (let i of users) {
               await Format.sleep(2000)
               db.users[i].limit += rewards.limit
               db.users[i].uang += rewards.uang
            }
         }
         if (isWin) {
            await givingAway()
            delete family100['family100' + m.chat]
         } else if (isSurender) {
            delete family100['family100' + m.chat]
         }
      } else if (boom[m.chat] && body && !m.isBaileys) {
         let rewards = {
            limit: 20,
            uang: 40
         }
         let failed = {
            uang: 3
         }
         let id = m.chat
         let timeout = 120000
         let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(body)

         if (isSurrender && boom && (id in boom)) {
            await m.reply(`Yah Menyerah 🐷`)
            clearTimeout(boom[id][2])
            delete boom[id]
            return
         }

         let json = boom[id][1].find(v => v.position == body)
         let player = boom[id][1].find(v => v.player == m.sender)
         if (!player) return
         if (!json) return
         if (body === false || body < 1 || body > 9) {
            return m.reply(`🙉 Masukkan angka antara 1 - 9.`)
         }

         if (json.emot == '💥') {
            json.state = true
            let bomb = boom[id][1]
            let teks = `💣 *B O M B*\n@${m.sender.split('@')[0]}\n\n`
            teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
            teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
            teks += `*Permainan selesai!*\nkotak berisi bom terbuka 🐽\n❌ Uang Kamu Berkurang - ${failed.uang}💲\nMain Lagi .boom`
            conn.sendMessage(m.chat, {
               text: teks,
               mentions: [m.sender]
            }, {
               quoted: boom[id][0],
               ...conn.exp
            }).then(() => {
               delete boom[id]
               db.users[m.sender].uang -= failed.uang
               clearTimeout(boom[id])
            })
         } else if (json.state) {
            return conn.reply(m.chat, `💣 Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`, boom[id][0])
         } else {
            json.state = true
            let changes = boom[id][1]
            let open = changes.filter(v => v.state && v.emot != '💥').length
            if (open >= 8) {
               let teks = `💣  *B O M B*\n@${m.sender.split('@')[0]}\n\n`
               teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
               teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
               teks += `*Permainan selesai!* kotak berisi bom tidak terbuka `
               let _a = `${teks}\n\nHadiah 🎉:\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`
               conn.sendMessage(m.chat, {
                  text: _a,
                  mentions: [m.sender]
               }, {
                  quoted: boom[id][0],
                  ...conn.exp
               }).then(() => {
                  db.users[m.sender].uang += rewards.uang
                  db.users[m.sender].limit += rewards.limit
                  clearTimeout(boom[id][2])
                  delete boom[id]
               })
            } else {
               let teks = `💣  *B O M B*\n@${m.sender.split('@')[0]}\n`
               teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
               teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
               teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
               conn.sendMessage(m.chat, {
                  text: teks,
                  mentions: [m.sender]
               }, {
                  quoted: m,
                  ...conn.exp
               })
            }
         }
      } else if (kuismath.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.kuishmath') && !body.includes('.math') && !body.includes('.matematika') && !m.isBaileys) {
         const rewards = {
            limit: 10,
            uang: 30
         }
         const jawaban = kuismath[m.sender.split('@')[0]]
         if (body.toLowerCase() == jawaban) {
            delete kuismath[m.sender.split('@')[0]]
            conn.adReply(m.chat, `*Kuis Matematika*\n\nJawaban Benar\nHadiah :\n *+${rewards.limit} Limit*\n *+${rewards.uang} Uang*\n\nIngin bermain lagi? \nketik .math mode\nPilih Mode:\n- ${Object.keys(modes).join(' \n- ')}\n\nContoh penggunaan:\n\n.math easy`, setting.thumbnail, m).then(async () => {
               db.users[m.sender].limit += rewards.limit
               db.users[m.sender].uang += rewards.uang
            })
         } else {
            return m.reply('Salah!')
         }
      } else if (siapakahaku.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.siapakahaku') && !body.includes('.siapaaku') && !m.isBaileys) {
         const rewards = {
            limit: 20,
            uang: 40
         }
         const jawaban = siapakahaku[m.sender.split('@')[0]]
         if (body.toLowerCase() === jawaban) {
            delete siapakahaku[m.sender.split('@')[0]]
            conn.adReply(m.chat, `Benar 🎊 \nkamu mendapatkan:\n+ ${rewards.limit} limit 🎟\n+ ${rewards.uang} uang 💵`, setting.thumbnail, m)
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
         } else {
            return m.reply('❎ Salah')
         }
      } else if (susunkata.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.susunkata') && !m.isBaileys) {
         const rewards = {
            limit: 15,
            uang: 30
         }
         const miss = Math.floor(Math.random() * 3)
         const wrong = ['❎ Salah', '🤯 Kurang Tepat', '🥵 Belum Benar'][miss]
         const jawaban = susunkata[m.sender.split('@')[0]]
         if (body.toLowerCase() === jawaban) {
            delete susunkata[m.sender.split('@')[0]]
            conn.adReply(m.chat, `Benar 🎊 \nkamu mendapatkan:\n+ ${rewards.limit} limit 🎟\n+ ${rewards.uang} uang 💵`, setting.thumbnail, m)
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
         } else {
            return m.reply(wrong)
         }
      } else if (tebakbendera.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.tebakbendera') && !m.isBaileys) {
         const rewards = {
            limit: 25,
            uang: 50
         }
         const jawaban = tebakbendera[m.sender.split('@')[0]]
         if (body.toLowerCase() == jawaban) {
            delete tebakbendera[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `🎮 Tebak Bendera \n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, setting.thumbnail, m)
         } else {
            return m.reply('Salah')
         }
      } else if (tebakgambar.hasOwnProperty(m.sender.split('@')[0]) && body && !m.isBaileys) {
         const rewards = {
            limit: 10,
            uang: 20
         }
         const mistaken = Math.floor(Math.random() * 3)
         const message = ['💩 Salah', '🐽 Kurang Tepat', '🍌 Belum Benar'][mistaken]
         const jawaban = tebakgambar[m.sender.split('@')[0]]
         if (body.toLowerCase() === jawaban) {
            conn.adReply(m.chat, `Benar 🌈\nkamu mendapatkan:\n+${rewards.limit} Limit\n+${rewards.uang} Uang`, setting.thumbnail, m)
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            delete tebakgambar[m.sender.split('@')[0]]
         } else {
            return m.reply(message)
         }
      } else if (tebakgame.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.tebakgame') && !m.isBaileys) {
         const rewards = {
            limit: 25,
            uang: 50
         }
         const jawaban = tebakgame[m.sender.split('@')[0]]
         if (body.toLowerCase() == jawaban) {
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            delete tebakgame[m.sender.split('@')[0]]
            conn.adReply(m.chat, `🎮 Tebak Game \n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, setting.thumbnail, m)
         } else {
            return m.reply('Salah ❌')
         }
      } else if (tebakkalimat.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.tebakkalimat') && !m.isBaileys) {
         const rewards = {
            limit: 20,
            uang: 50
         }
         const kal = Math.floor(Math.random() * 3)
         const imat = ['Salah', 'Kurang Tepat ', 'Belum Benar '][kal]
         const jawaban = tebakkalimat[m.sender.split('@')[0]].trim()
         if (body.toLowerCase() === jawaban) {
            delete tebakkalimat[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `Jawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, setting.thumbnail, m)
         } else {
            return m.reply(imat)
         }
      } else if (tebakkata.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.tebakkata') && !body.includes('.teka') && !m.isBaileys) {
         const rewards = {
            limit: 20,
            uang: 40
         }
         const kat = Math.floor(Math.random() * 3)
         const ta = ['Salah', 'Kurang Tepat', 'Belum Benar'][kat]
         const jawaban = tebakkata[m.sender.split('@')[0]]
         if (body.toLowerCase() == jawaban) {
            delete tebakkata[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `🎮 Tebak Kata 🎮\n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, setting.thumbnail, m)
         } else {
            return m.reply(ta)
         }
      } else if (tebaktebakan.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.tebaktebakan') && !body.includes('.tebakan') && !m.isBaileys) {
         const rewards = {
            limit: 10,
            uang: 35
         }
         const jawaban = tebaktebakan[m.sender.split('@')[0]]
         if (body.toLowerCase() == jawaban) {
            delete tebaktebakan[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `Tebak Tebakan 🎮\n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, setting.thumbnail, m)
         } else {
            return m.reply('Salah ❌')
         }
      } else if (tekateki.hasOwnProperty(m.sender.split('@')[0]) && body && !body.includes('.tekateki') && !m.isBaileys) {
         const rewards = {
            limit: 15,
            uang: 30
         }
         const jawaban = tekateki[m.sender.split('@')[0]]
         if (body.toLowerCase() == jawaban) {
            delete tekateki[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `Teka Teki 🎮\n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, setting.thumbnail, m)
         } else {
            return m.reply('Salah ❎')
         }
      } else if (Object.values(tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')) {
         const rewards = {
            limit: 15,
            uang: 30
         }
         let room = Object.values(tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
         let ok
         let isWin = !1
         let isTie = !1
         let isSurrender = !1
         if (!/^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i.test(m.text)) return
         isSurrender = !/^[1-9]$/.test(m.text)
         if (m.sender !== room.game.currentTurn) {
            if (!isSurrender) return !0
         }
         if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
            m.reply({
               '-3': 'Game telah berakhir',
               '-2': 'Invalid',
               '-1': 'Posisi Invalid / Salah',
               0: 'Posisi Invalid / Salah',
            } [ok])
            return !0
         }
         if (m.sender === room.game.winner) isWin = true
         else if (room.game.board === 511) isTie = true
         const arr = room.game.render().map(v => {
            return {
               X: '❌',
               O: '⭕',
               1: '1️⃣',
               2: '2️⃣',
               3: '3️⃣',
               4: '4️⃣',
               5: '5️⃣',
               6: '6️⃣',
               7: '7️⃣',
               8: '8️⃣',
               9: '9️⃣'
            } [v]
         })
         if (isSurrender) {
            room.game._currentTurn = m.sender === room.game.playerX
            isWin = true
         }
         const winner = isSurrender ? room.game.currentTurn : room.game.winner
         const str = `Room ID: ${room.id}\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n${isWin ? `\n\n@${winner.split('@')[0]} Menang!\nGame berakhir\n@${winner.split('@')[0]} Mendapat Hadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰\n` : isTie ? `Game berakhir gak ada yang menang / seri` : `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}\n❌: @${room.game.playerX.split('@')[0]}\n⭕: @${room.game.playerO.split('@')[0]}\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`
         if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
            room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
         if (room.x !== room.o) await conn.sendText(room.x, str, m, {
            mentions: m.isLid ? conn.parseMentionLid(str) : conn.parseMention(str)
         })
         await conn.sendText(room.o, str, m, {
            mentions: m.isLid ? conn.parseMentionLid(str) : conn.parseMention(str)
         })
         if (isTie || isWin) {
            if (isWin) {
               db.users[winner].limit += rewards.limit
               db.users[winner].uang += rewards.uang
            }
            delete tictactoe[room.id]
         }
      }
      const menfess = global.db.menfess
      const mf = Object.values(menfess).find(v => v.status === true && v.penerima == m.sender)
      const mf_from = Object.values(menfess).find(v => v.status === true && v.dari == m.sender)
      if (mf && !m.isBaileys) {
         if (body === '' || m.text === '') return false
         const text = `Hai kak @${mf.dari.split('@')[0]}, kamu menerima balasan nih.\ndari: @${mf.penerima.split('@')[0]}\nPesan balasannya:\n${m.text}\n\n> kamu bisa langsung balas`.trim();
         await conn.sendMessage(mf.dari, {
            text: text,
            mentions: [mf.dari, mf.penerima]
         }, {
            quoted: fake_wa,
            ...conn.exp
         }).then(async () => {
            if (m.isBaileys || m.isGroup) {} else {
               const pesan = {
                  waktu: `${waktu.tanggal} ${waktu.time}`,
                  nama: m.pushName,
                  number: `${mf.penerima.split('@')[0]}`,
                  pesan: m.text
               }
               mf.pesan.push(pesan)
               await conn.reply(m.chat, 'Berhasil mengirim balasan.', m)
            }
         })
      } else if (mf_from && !m.isBaileys) {
         if (command == 'menfessclose' || command == 'tutupmenfess' || command == 'akhirimenfess') return false
         if (body === '' || m.text === '') return false
         const text = `Hai kak @${mf_from.penerima.split('@')[0]}, kamu menerima balasan nih.\n\nPesan balasannya:\n${m.text}\n\n> kamu bisa langsung balas`.trim();
         await conn.sendMessage(mf_from.penerima, {
            text: text,
            mentions: [mf_from.penerima]
         }, {
            quoted: fake_wa,
            ...conn.exp
         }).then(async () => {
            if (m.isBaileys || m.isGroup) {} else {
               const pesan = {
                  waktu: `${waktu.tanggal} ${waktu.time}`,
                  nama: m.pushName,
                  number: `${mf_from.dari.split('@')[0]}`,
                  pesan: m.text
               }
               mf_from.pesan.push(pesan)
               await conn.reply(m.chat, 'Berhasil mengirim balasan.\n\n> jika serasa menfess sudah atau cukup kamu dapat mengakhiri memfess dengan mengetik .menfessclose atau .tutupmenfess', m)
            }
         })
      }
      const timeAfk = db.users[m.sender].afkTime
      const reasonAfk = db.users[m.sender].afkReason
      const senderBackAfk = timeAfk === -1;
      if (!senderBackAfk && body && !m.isBaileys) {
         const caption = `*Kamu Berhenti AFK*\n*Setelah:* ${reasonAfk === "" ? "" : `${reasonAfk}`}\n*Selama:*\n${clockString(new Date() - timeAfk)}`
         const m_tag = [m.sender]
         const tags = m.isLid ? conn.parseMentionLid2(reasonAfk) || [`@${m.sender.split('@')[0]}`] : conn.parseMention(reasonAfk) || [`@${m.sender.split('@')[0]}`];
         const isTags = m_tag.concat(tags) || m_tag;
         conn.adReply(m.chat, caption, cover, m, {
            mentions: isTags
         }).then(() => {
            db.users[m.sender].afkTime = -1
            db.users[m.sender].afkReason = ''
         })
      };
      if (body) {
         let user
         try {
            user = m.message.extendedTextMessage.contextInfo.participant || '0@s.whatsapp.net'
         } catch {
            user = ''
         }
         const _u = '@' + user.substring(0).split('@')[0];
         const __u = m.isLid ? conn.parseMentionLid2(_u) : conn.parseMention(_u);
         __u.forEach(i => {
            const u = m.jid(i)
            let _timeAfk;
            try {
               _timeAfk = db.users[u].afkTime
            } catch {
               _timeAfk = -1
            }
            const v = (_timeAfk !== -1);
            if (v && !m.isBaileys) {
               const x = [u];
               x.forEach((z) => {
                  const d = db.users[z].afkTime
                  const e = db.users[z].afkReason;
                  const caption = `*Jangan Tag* *@${z.split('@')[0]}*\n*Dia Sedang Afk*\n*Dengan Alasan:* ${e === "" ? "" : `${e}`}\n*Selama:*\n${clockString(new Date() - d)}`
                  const tag = [z];
                  const m_tag = [m.sender];
                  const tags = m.isLid ? conn.parseMentionLid2(e) : conn.parseMention(e);
                  const isTags = m_tag.concat(tag).concat(tags) || m_tag;
                  conn.adReply(m.chat, caption, cover, m, {
                     mentions: isTags
                  })
               })
            }
         });
         const userAfks = m.isLid ? conn.parseMentionLid2(body) : conn.parseMention(body);
         userAfks.forEach(i => {
            const usr = m.jid(i)
            let _timeAfk;
            try {
               _timeAfk = db.users[usr].afkTime
            } catch {
               _timeAfk = -1
            }
            const v = (_timeAfk !== -1);
            if (v && !m.isBaileys) {
               const x = [usr];
               x.forEach((z) => {
                  const d = db.users[z].afkTime
                  const e = db.users[z].afkReason;
                  const caption = `*Jangan Tag* *@${z.split('@')[0]}*\n*Dia Sedang Afk*\n*Dengan Alasan:* ${e === "" ? "" : `${e}`}\n*Selama:*\n${clockString(new Date() - d)}`
                  const tag = [z];
                  const m_tag = [m.sender];
                  const tags = m.isLid ? conn.parseMentionLid2(e) : conn.parseMention(e);
                  const isTags = m_tag.concat(tag).concat(tags) || m_tag;
                  conn.adReply(m.chat, caption, cover, m, {
                     mentions: isTags
                  })
               })
            }
         })
      }
      if (word(body, "🗿")) {
         //return m.react("Lu ngapain emot muka lu sendiri")
         return m.react("🍌")
      }
      if (word(body, 'tes')) {
         return m.reply('Apa Monyet 🐒 ?');
      }
      if (word(body, 'hadir') && db.chats[m.chat]?.absen) {
         if (db.chats[m.chat]?.absen_user.includes(m.sender)) {
            return m.reply('kamu sudah absen ketik .cekabsen')
         } else if (!(db.chats[m.chat]?.absen_user.includes(m.sender))) {
            db.chats[m.chat].absen_user.push(m.sender)
            db.chats[m.chat].absen_count += 1
            const text = `• ${m.pushName || ""} @${m.sender.split('@')[0]}\n`
            db.chats[m.chat].absen_text += text
            conn.adReply(m.chat, zw + ` *ABSEN*\n\nketik .absen atau hadir\nuntuk mengakhiri absen ketik .tutupabsen\n\nTotal Hadir: ${db.chats[m.chat]?.absen_count}\n\n` + db.chats[m.chat]?.absen_text, 'https://qu.ax/WSojV.jpeg', m, {
               mentions: conn.parseMention(db.chats[m.chat]?.absen_text)
            })
         }
      }
      if (db.settings.auto_clear_chat) {
         if (m.isGroup) conn.deleteMessage(m, m.chat)
      }
      if (command && !m.isBaileys) {
         const mean = Format.command_mean(command, cmd_plugins);
         if (mean && !(mean === command)) {
            if (isPrefix.find(p => body.startsWith(p))) {
               conn.adReply(m.chat, `*❗mungkin maksud kamu:*\n ${java} *${prefix+mean}*`, cover, m);
            }
         }
      }
      if (db.settings?.auto_sticker && m.mtype === 'imageMessage' && !m.isBaileys) {
         const ignore = ['remini', 'hd', 'sticker', 's', 'stiker', 'smeme'];
         if (ignore.includes(command)) return m.react('❎');
         if (!m.fromMe && db.users[m.sender].limit < 0) return m.reply(mess.limit);
         m.react('🐽');
         conn.sendImageAsSticker(m.chat, await quoted.download(), m, {
            packname: setting.botName,
            author: `${setting.footer === '' ? sticker_wm : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
         }).then(() => {
            if (!m.fromMe) {
               db.users[m.sender].limit -= 2
               m.reply(limit_message.replace('%limit', 2))
            }
         })
      }
      if ((!m.isGroup || db.chats[m.chat]?.antiToxic) && toxic?.some(word => body?.toLowerCase()?.includes(word))) {
         //  if (agree.some(v => body.toLowerCase().includes(v))) return
         if (m.fromMe || m.isBaileys || isAdmins || isOwner) return
         conn.adReply(m.chat, `Hey Ketikannya Di Jaga Ya Monyet!`, cover, m);
      }
      if (m?.mtype === 'groupStatusMentionMessage' && !m.isBaileys) {
         if (isOwner) return console.log('Owner sending status mentions');
         if (isAdmins) return console.log('Admin sending status mentions');
         await m.reply(`*Terdeteksi Pansos Caper Tag Status Ke Group Atau Ngemis Penonton*\n*Silahkan Klik Laporkan dan Blokir Orang Ini*\n*@${m.sender.split("@")[0]}*\n*Agar Status Gak Guna atau Status Sampah Dia Itu Tidak Muncul Di Menu Status Pembaruan Kalian!*`, {
            contextInfo: {
               mentionedJid: [m.sender]
            }
         });
         if (isBotAdmins) await m.delete(m.key), await Format.sleep(3000), await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
         conn.updateBlockStatus(m.sender, 'block'), console.log(m.sender.split('@')[0], 'Blocked Cause Sending Status Mention In Group!');
      }
      if (db.chats[m.chat]?.antilink && !m.fromMe && !m.isBaileys) {
         try {
            if (body.includes('https://chat.whatsapp.com')) {
               if (isAdmins) return m.reply('You have the authority to send the link as an admin.');
               if (isOwner) return m.reply('Sending the link is something you are free to do since you are my owner.');
               conn.adReply(m.chat, `@${m.sender.split("@")[0]} Terdeteksi Mengirim Kata Kata Aneh!`, cover, m, {
                  mentions: [m.sender]
               }).then(async () => {
                  if (isBotAdmins) {
                     const url = await conn.groupInviteCode(m.chat);
                     if (!body.includes(url)) {
                        m.delete(m.key)
                        // await Format.sleep(2000);
                        // conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');                  
                     } else if (body.includes(url)) {
                        m.reply('Oh Ternyata Link Group Ini Hampir Ajh Aku Delete and Kick');
                     }
                  }
               })
            }
         } catch {
            console.error(e)
         }
      }      
   } catch (e) {
      console.error(e)
      return conn.reply(m.chat, format(e), m)
   }
}