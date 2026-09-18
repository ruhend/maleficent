const { GithubDB } = require('mf-system');
/**
 * ganti dengan username gitHub dan token kamu hanya 2 itu saja
 * buat token atau generate github token cari tutorial nya di google atau youtube, atau pintasan cepatnya https://github.com/settings/tokens
 * di bawah contoh dan ganti dengan token clasic github kamu centang semua ya pas buat atau generate token baru agar tidak error dan set no expired 
 **/
const USER_NAME = 'username'
const GITHUB_TOKEN = 'token' 
const options = {   
   USER_NAME: USER_NAME,   
   GITHUB_TOKEN: GITHUB_TOKEN   
};
const backupGithub = async () => await GithubDB.Backup(options);
const restoreGithub = async () => await GithubDB.Restore(options);
if (backup_github) {
   console.log('AutoBackup Github Aktif');
   GithubDB.AutoBackup(options)
};
module.exports = { backupGithub, restoreGithub };
/* 
 * untuk melihat hasil jika sukses salin dan buka 
 * https://github.com/gantiusernamekamu/database 
 **/