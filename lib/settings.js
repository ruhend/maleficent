global.moment = require("moment-timezone")
global.setting = require('../config.json');
global.mess = require('./message.js');
global.wait = mess.wait
global.self = setting.self
global.data_base = { users: {}, chats: {}, settings: {}, menfess: {}, contacts: {}};
global.isTime = () => {
   const jam = moment.tz('Asia/Jakarta').format('HH:mm:ss');
   const tanggal = moment().tz('Asia/Jakarta').format('ll');
   const suasana = moment().tz('Asia/Jakarta').locale('id').format('a');
   const time = moment().tz('Asia/Jakarta').format('HH:mm');
   return global.waktu = { tanggal, jam, suasana, time };
}
global.group_welcome = '*Selamat Datang 🐷*\n*%user* \n*Di %subject*\n*Kenalan dulu yuk*\n*Nama:*\n*Umur:*\n*Asal Kota:*\n*Hoby:*\n*Merek HP:*\n'
global.group_bye = '*Bye 🐽*\n*%user* \n*Has Left The %subject Group*'
global.logo_premium = 'Ⓟ'
global.logo_limit = 'Ⓛ'
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
global.delay_box = 300000 //3 menit = 180 rb , kalo ganti dari bot ketik .setdelaybox
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
global.group_mode = false
global.anticall = true
/**
 * group_only_message is response message groupOnly when group mode is active in private chat.
 * true if wanna respond with groupOnly message
 * false if don't wanna respond message groupOnly in private chat ketik .set ada penjelasan nya atau lihat plugins/owner/owner-set.js",
 * untuk cek keterangan status bot setinganya ketik .status
 * kalo misalnya di log nya ada macam ni tengok https://files.catbox.moe/9pgsin.jpg
 * nah itu normal itu lagi ngebentuk sessions key nomor nomor member yang ada di grup juga, pokoknya nomor nomor sender, lama enggak nya tergantung jumlah member group / spek panel klen semakin besar semakin cepat write file prekey / session nya
**/
/** sc ini cocok untuk dipake .self (nomor pribadi utama) dan public bot group **/
/**global.read_group = false
global.read_private = false
global.typing_group = false
global.typing_private = false
global.recording_group = false
global.recording_private = true
**/
global.isBot = ["CLUTCH", "JAG", "Z4PH","ILSYM","NARUYA","7EPP","SUK","SANKA","TIX","IZUMI","24","AD","META","RMC","Laurine","FTG","RYZEN","Fiz","SSA","FELZ","BAE5","3EB0","B1EY","NXR","NEO","AKIRA"]
global.caklontong = {}, caklontong_desc = {}, boom = {}, family100 = {}, tebakkata = {}, tekateki = {}, tictactoe = {}, gift = {}, kuismath = {}, siapakahaku = {}, susunkata = {}, tebakbendera = {}, tebakgambar = {}, tebakgame = {}, tebakkalimat = {}, tebaktebakan = {};
const fn = '0@s.whatsapp.net'
global.fake_wa = {
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
         text: setting.botName,
         contextInfo: {
            mentionedJid: [fn],
            remoteJid: fn
         }
      }
   }
};
global.prayerTimes = {
   '04:37': 'Subuh',
   '11:57': 'Zuhur',
   '15:13': 'Ashar',
   '17:47': 'Maghrib',
   '19:10': 'Isya'
}
