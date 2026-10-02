const http = require('http');
const https = require('https');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const tools = require('./fix-link.js');
async function search(args) {
   let res = (await fetch(tools.api(5, '/apps/search', {
      query: args,
      limit: 1000
   })));
   let ress = {}
   res = (await res.json());
   ress = res.datalist.list.map(v => {
      return {
         name: v.name,
         id: v.package
      }
   })
   return ress
}
async function download(id) {
   let res = (await fetch(tools.api(5, '/apps/search', {
      query: id,
      limit: 1
   })));
   res = (await res.json());
   let name = res.datalist.list[0].name
   let package = res.datalist.list[0].package
   let icon = res.datalist.list[0].icon
   let dllink = res.datalist.list[0].file.path
   let lastup = res.datalist.list[0].updated
   let size = await size_url(dllink)
   return {
      name,
      lastup,
      package,
      size,
      icon,
      dllink
   }
}
async function size_url(url) {
   if (!url) return Promise.reject(new Error('Invalid Url'));
   return new Promise(async (res, rej) => {
      try {
         if (url.startsWith('https://') || url.startsWith('http://')) {
            let req = url.startsWith('https://') ? https.get(url) : http.get(url);
            req.once("response", async r => {
               let c = parseInt(r.headers['content-length']);
               if (!isNaN(c) && r.statusCode === 200) res(formatBytes(c));
               else res("Couldn't get file size");
            });
            req.once("error", async e => rej(e));
         } else {
            throw 'error: The address should be http or https'
         }
      } catch (e) {
         throw e
      }
   });
}
function formatBytes(x) {
   let units = ['B', 'KB', 'MB', 'GB', 'TB']
   let bytes = x
   let i;
   for (i = 0; bytes >= 1024 && i < 4; i++) {
      bytes /= 1024;
   }
   return bytes.toFixed(2) + ' ' + units[i];
}
module.exports = { search, download }