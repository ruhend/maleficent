const fs = require('fs')
global.namebot = setting.botName
global.footer = setting.footer
global.loading = pickRandom([mess.wait, 'Sabakh...', 'Tunggu Sebentar...', 'Hold On...', 'Tahan...']);
global.ed = ["🕐", "🕑", "🕒", "🕒", "🕓", "🕓", "🕔", "🕔", "🕕", "🕖", "🕘", "🕙", "🕙", "🕚", "🕛"] //conn.edReply(m.chat, global.ed, "last_text", delay, m) example conn.edReply(m.chat, global.ed, "Succes", 500, m);
global.java = '⭔'
global.javi = '⬣'
global.star = '✨'
global.love = '💕'
global.zw = 'ㄊ'
global.sticker_wm = '© Ruhend'
global.logo_premium = 'Ⓟ'
global.logo_limit = 'Ⓛ'
global.header = '┌────'
global.middle = '│'
global.pointer = '⭓'
global.bottom = '└──────────⭓'
global.LP = logo_premium || 'Ⓟ'
global.LL = logo_limit || 'Ⓛ'
global.isPrefix = ['.', ',', '#', '?', '/']
global.wm = `By ${setting.footer}`
global.logo_title = '═┅═┅═[ x ]═┅═┅═'
global.gcbot_short = 'http://surl.li/qgkhyu'
global.hyd_gcbot = ['Join group', gcbot_short] 
// link_group bisa kalian ganti link group kalian sendiri kalo punya, atau bisa link chanel juga kalo punya, atau bisa di isi dengan link lain , kalo dari bot ketik .setlink 
global.link_group = 'https://chat.whatsapp.com/CqI6MyI0eLJ9sG1NvQCzoD'
global.group_welcome = '*Selamat Datang 🐷*\n*%user* \n*Di %subject*\n*Kenalan dulu yuk*\n*Nama:*\n*Umur:*\n*Asal Kota:*\n*Hoby:*\n*Merek HP:*\n'
global.group_bye = '*Bye 🐽*\n*%user* \n*Has Left The %subject Group*'
global.image_daftar = 'https://telegra.ph/file/ab9beaa8589f6af8887e0.jpg';  
global.text_daftar = '*Pendaftaran*';
global.button_daftar = [
   ['Daftar Otomatis', '.daftar %auto'],
   ['Daftar Manual', '.daftar']
];
// adReply is message with photo (cover)
global.adReply = true
// untuk owner limit akan tetap di kenakan fitur .addlimit dan lainya biar ga lupa ajah cheat ajh .addlimitowner 999999 atau .cheatlimit
global.use_limit_message = true
global.limit_message = '%limit limit terpakai ✅'
// limit_adReply = send message limit with photo or cover 
global.limit_adReply = false
// mystery box true untuk menyalakan misteri box kalo dari bot ketik .on misteri on atau off
global.mystery_box = false
// ini 5 menit delay pengiriman kotak misteri ke group jangan di bawah 3 menit takut spam nantinya 
global.delay_box = 300000 //5 menit = 3 ratus rb , kalo ganti dari bot ketik .setdelaybox
// untuk pengingat sholat, false untuk matikan, kalo dari boty ketik .off sholat
global.auto_sholat = true
/**
 * there's some places cloud to backup database
 * backup_mongo if u wanna use mongodb change configuration on lib/src/cloud/mongo-db.js
 * setting langsung dari bot ketik .set atau .on atau lihat di menunya ketik .menu owner cobain satu satu biar paham 🐽
 **/
global.backup_mongo = false
global.backup_github = false
global.backup_gitlab = false
global.backup_supabase = false
/** self response only this bot and owner or premium **/
global.self = false
global.group_mode = false
global.anticall = true
global.group_only_message = false
/** Untuk Fitur Jadibot .jadibot **/
global.jadibot_engine = true
// 4 untuk ram 1 GB kalo lebih ya sesuain ajh
global.jadibot_maximum = 4
/**
 * group_only_message is response message groupOnly when group mode is active in private chat.
 * true if wanna respond with groupOnly message
 * false if don't wanna respond message groupOnly in private chat ketik .set ada penjelasan nya atau lihat plugins/owner/owner-set.js",
 * untuk cek keterangan status bot setinganya ketik .status
 * kalo misalnya di log nya ada macam ni tengok https://files.catbox.moe/9pgsin.jpg
 * nah itu normal itu lagi ngebentuk sessions key nomor nomor member yang ada di grup juga, pokoknya nomor nomor sender, lama enggak nya tergantung jumlah member group / spek panel klen semakin besar semakin cepat write file prekey / session nya
**/
/** sc ini cocok untuk dipake .self (nomor pribadi utama) dan public bot group **/
global.read_group = true
global.read_private = false
global.typing_group = false
global.typing_private = false
global.recording_group = false
global.recording_private = true

//global.plugins_status = async (conn, jid, msg, m) => await conn.adReply(jid, msg, cover, m);
global.caklontong = {}, caklontong_desc = {}, boom = {}, family100 = {}, tebakkata = {}, tekateki = {}, tictactoe = {}, gift = {}, kuismath = {}, siapakahaku = {}, susunkata = {}, tebakbendera = {}, tebakgambar = {}, tebakgame = {}, tebakkalimat = {}, tebaktebakan = {};
const fn = '0@s.whatsapp.net'
const fake_wa = {
   key: {
      remoteJid: fn,
      fromMe: false,
      id: 'CAK_LONTONG'
   },
   pushName: 'WhatsApp',
   broadcast: true,
   sender: fn,
   message: {
      extendedTextMessage: {
         text: global.namebot,
         contextInfo: {
            mentionedJid: [fn],
            remoteJid: fn
         }
      }
   }
};
global.fake_wa = fake_wa;
global.baileys_bot = ["CLUTCH", "JAG", "Z4PH","ILSYM","NARUYA","7EPP","SUK","SANKA","TIX","IZUMI","24","AD","META","RMC","Laurine","FTG","RYZEN","Fiz","SSA","FELZ","BAE5","3EB0","B1EY","NXR","NEO","AKIRA"]
const prayerTimes = {
   '04:37': 'Subuh',
   '11:57': 'Zuhur',
   '15:13': 'Ashar',
   '17:47': 'Maghrib',
   '19:10': 'Isya'
};
global.prayerTimes = prayerTimes;
exports.connections = (conn) => {
    conn.ws.on('CB:call', async (update) => {
       const call = update.content[0].attrs['call-creator'];
       console.log('someone calling bot:', call);
       if (!global.anticall) return
       const phoneNumber = conn.decodeJid(await conn.signalRepository.lidMapping.getPNForLID(call));
       if (setting.ownerNumber.includes(phoneNumber.split('@')[0])) return console.log('isOwner:', phoneNumber);
       return conn.updateBlockStatus(call, 'block');
   });
   conn.sendMystery = (jid) => {
      return conn.sendMessage(jid, { image: { url: 'https://files.catbox.moe/u5rmu8.jpg' }, caption: 'Mystery Box Tiba\nAda Hadiah Nih\nSilahkan balas *open*' }, { fileLength: 1024, ...conn.exp, quoted: fake_wa });
   };
   conn.sendPrayer = (jid, time) => {
      const caption = `*Waktu ${time} Telah Tiba Silahkan Ambilah Air Wudhu Dan Segera Laksanakan Sholat*\n`
      return conn.adReply(jid, caption.trim(), global?.cover || setting.thumbnail, fake_wa);
   };
}
fs.loadFileSync(require.resolve(__filename));