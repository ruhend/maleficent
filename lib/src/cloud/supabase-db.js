const { SupabaseDB } = require('mf-system');
const options = {
  SUPABASE: {
    URL: "https://xxxx.supabase.co",
    KEY: "sb_xxxx"
  }
};
const backupSupabase = async () => await SupabaseDB.Backup(options);
const restoreSupabase = async () => await SupabaseDB.Restore(options);
if (backup_supabase) {
  console.log('AutoBackup Supabase Aktif');
  SupabaseDB.AutoBackup(options);
};
module.exports = { backupSupabase, restoreSupabase };
/** 
 * https://supabase.com 
 * jika ingin menggunakan cloud supabase sebagai penyimpanan database silahkan daftar akun lalu kamu cuma perlu mengisi 2 parameter di atas itu  
 * yaitu url dan apikey nya  2 itu saja
 * cara membuat dan melihat nya udh daftar dulu ya intinya daftar nya pake email biasa ajh
 * 1. pertama pasti disuruh buat organisasi kek gini namanya bebas ya https://files.catbox.moe/qmc4y7.jpg
 * 2. kaya gini kalo udh https://files.catbox.moe/4xebbd.jpg  https://supabase.com/dashboard/organizations
 * 3. kalo udh create project atau new project nya https://files.catbox.moe/s4bl78.jpg
 * 4. nah isi nama database wajib dan kalo password nya bikin terserah https://files.catbox.moe/vjptex.jpg
 * 5. kalo udh scroll kebawah dan create new project https://files.catbox.moe/cuuf6t.jpg
 * 6. nah trs copy URL nya itu project url dan pastekan di atas https://files.catbox.moe/pm5zig.jpg
 * 7. terus geser ke bawah klik apikeys https://files.catbox.moe/ln0lyc.jpg
 * 8. geser kebawah lagi dan salin yang secret keys klik tanda mata dulu baru klik salin nya https://files.catbox.moe/mer7b9.jpg
 * 9. terus pencet kembali atau back dan klik gatis 3 slide kanan atas https://files.catbox.moe/vdix7t.jpg
 * 10. dan pilih yang storage https://files.catbox.moe/o3o2k1.jpg
 * 11. pilih yang files https://files.catbox.moe/a19uz1.jpg
 * 12. kalo udh create new bucket https://files.catbox.moe/dedxft.jpg
 * 13. namanya database dan langsung klik create https://files.catbox.moe/xc6yne.jpg
 * 14. nah udh semua, sekarang kalo yg atas 2 URL dan KEY udh di isi dengan benar sekarang tinggal backup dari bot ketik .backup supabase dan kalo mau restore ketik .restore supabase dan kalo mau nyalain auto backup nya ketik .on autobackup supabase dan matiin .off autobackup supabase
 * 15. Done!
 **/