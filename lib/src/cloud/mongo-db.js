const { MongoDB } = require('mf-system');
/** 
 * Jika Kamu Ingin Memakai Monggo DB sebagai Backup Penyimpanan Dan Bisa Merestore Lagi
 * https://www.mongodb.com
 * disini kalian cuma perlu ganti 2 nilai itu cuma password dan url nya (url udh termasuk ada username nya) kalo nama kan itu udh langsung di berikan otomatis dari url monggonya tutorial setup / setting nya di bawah
 * contoh password database monggo ganti disitu 
 **/
const username = 'username'
const password = 'password'
/* contoh url database yang di berikan monggo ganti disitu*/
const url = `mongodb+srv://${username}:${password}@cluster0.tkxdnlq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const backupMongo = async () => await MongoDB.Backup(url);   
const restoreMongo = async () => await MongoDB.Restore(url)   
/** nyalain .on autobackup matiion off autobackup, kalo error kamu salah masukin info password dan url nya matiin ajh sampe masukinya bener bener bener ga ada info error dari monggo nya **/
if (backup_mongo) {
   console.log('AutoBackup Monggo Aktif');
   MongoDB.AutoBackup(url);
};
module.exports = { backupMongo , restoreMongo }
/** TUTORIAL **/
/**
 * https://www.mongodb.com
 * pas daftar di suruh bikin cluster pilih geser yang paling kanan yang free
 * password database monggo
 * gimana cara menemukan nya? kalian pergi ke Project
 * di Security click Database Access 
 * jika masih kosong buat saja klik create
 * jika sudah ada klik Edit => Edit Password => klik AutoGenerate  Secure Password (terus salin!) => terus paling bawah klik tombol ijo Update User
 * generate and dan salin dan tempel ke yang di const password itu
 * Next 
 * cara mencari url monggo db kamu
 * click Cluster0 lalu click Connect
 * lalu click Driver
 * dan kamu akan melihat url monggo kamu seperti contoh di atas lalu salin
 * ganti <dbpassword> dengan password ${password} contohnya di atas
 * di bagian Security (Network Access) masukin ini salin 0.0.0.0/0
 * contohnya https://files.catbox.moe/yf4mti.jpg
 * pastein nya kek gini https://files.catbox.moe/i1hder.jpg
 * dah gitu ajh setel nya dan selamat sukses akses dari semua panel atau vps 
 * dan jika sudah selesai semua kalian bisa jalankan fitur .backup untuk backup database.json nya ke monggo db dan .restore untuk ambil database yang telah di backup
 * hasil backup bisa kalian lihat di Deployment klik Database => Browse Collections => klik datas => dan lihat Query Results: 1-1 of 1 => klik _id => ubah tanda panahnya ke bawah 🔽 dan taraaaa itu database nya.. sekian 
 **/