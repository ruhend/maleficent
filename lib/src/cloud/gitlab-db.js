const { GitlabDB } = require('mf-system');
/**
 * jika mau menggunakan gitlab db sebagai tempat database gitlab.com
 * ganti dengan username gitlab dan token kamu hanya 2 itu saja
 * buat token atau generate gitlab token pintasan cepatnya https://gitlab.com/-/user_settings/personal_access_tokens?state=active&sort=expires_asc
 * di bawah contoh dan ganti dengan token clasic atau legacy gitlab yang kamu bikin 
 * centang semua ya pas buat generate token baru agar tidak error dan set setahun karna mentoknya emank setahun ga bisa no expired , jadi kalo expired setahun tinggal generate baru lagi
 **/
const USER_NAME = 'username' 
const GITLAB_TOKEN = 'token'
const options = {   
   USER_NAME: USER_NAME,
   GITLAB_TOKEN: GITLAB_TOKEN   
};
const backupGitlab = async () => await GitlabDB.Backup(options);
const restoreGitlab = async () => await GitlabDB.Restore(options);
if (backup_gitlab) {
   console.log('AutoBackup GitLab Aktif');
   GitlabDB.AutoBackup(options);
};
module.exports = { backupGitlab, restoreGitlab }
/**
 * untuk melihat hasil jika salin dan buka 
 * https://gitlab.com/usernamekamu/database 
**/