var querystring = require('querystring');
var fetch = require('node-fetch');
var languages = require('./languages');

function extract(key, res) {
   var re = new RegExp(`"${key}":".*?"`);
   var result = re.exec(res);
   if (result !== null) {
      return result[0].replace(`"${key}":"`, '').slice(0, -1);
   }
   return '';
}

async function translate(text, opts, fetchOpts) {
   opts = opts || {};
   fetchOpts = fetchOpts || {};
   var e;
   [opts.from, opts.to].forEach(function(lang) {
      if (lang && !languages.isSupported(lang)) {
         e = new Error();
         e.code = 400;
         e.message = 'The language \'' + lang + '\' is not supported';
      }
   });
   if (e) {
      return Promise.reject(e);
   }

   opts.from = opts.from || 'auto';
   opts.to = opts.to || 'en';
   opts.tld = opts.tld || 'com';
   opts.autoCorrect = opts.autoCorrect === undefined ? false : Boolean(opts.autoCorrect);

   opts.from = languages.getCode(opts.from);
   opts.to = languages.getCode(opts.to);

   var url = 'https://translate.google.' + opts.tld;

   var rpcids = 'MkEWBc';
   return await fetch(url, fetchOpts).then(async function(res) {
      return await res.text().then(function(body) {
         var data = {
            'rpcids': rpcids,
            'source-path': '/',
            'f.sid': extract('FdrFJe', body),
            'bl': extract('cfb2h', body),
            'hl': 'en-US',
            'soc-app': 1,
            'soc-platform': 1,
            'soc-device': 1,
            '_reqid': Math.floor(1000 + (Math.random() * 9000)),
            'rt': 'c'
         };
         return data;
      });
   }).then(async function(data) {
      url = url + '/_/TranslateWebserverUi/data/batchexecute?' + querystring.stringify(data);
      var freq = [
         [
            [rpcids, JSON.stringify([
               [text, opts.from, opts.to, opts.autoCorrect],
               [null]
            ]), null, 'generic']
         ]
      ];
      fetchOpts.method = 'POST';
      fetchOpts.body = 'f.req=' + encodeURIComponent(JSON.stringify(freq)) + '&';
      fetchOpts.headers = {
         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      };

      return await fetch(url, fetchOpts).then(function(res) {
         if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
         }
         return res.text();
      }).then(function(json) {
         json = json.slice(6);
         var length = '';

         var result = {
            text: '',
            pronunciation: '',
            from: {
               language: {
                  didYouMean: false,
                  iso: ''
               },
               text: {
                  autoCorrected: false,
                  value: '',
                  didYouMean: false
               }
            },
            raw: ''
         };

         try {
            length = /^\d+/.exec(json)[0];
            json = JSON.parse(json.slice(length.length, parseInt(length, 10) + length.length));
            json = JSON.parse(json[0][2]);
            result.raw = json;
         } catch (e) {
            return result;
         }

         if (json[1][0][0][5] === undefined || json[1][0][0][5] === null) {
            result.text = json[1][0][0][0];
         } else {
            result.text = json[1][0][0][5]
               .map(function(obj) {
                  return obj[0];
               })
               .filter(Boolean)
               .join(' ');
         }
         result.pronunciation = json[1][0][0][1];

         // From language
         if (json[0] && json[0][1] && json[0][1][1]) {
            result.from.language.didYouMean = true;
            result.from.language.iso = json[0][1][1][0];
         } else if (json[1][3] === 'auto') {
            result.from.language.iso = json[2];
         } else {
            result.from.language.iso = json[1][3];
         }

         // Did you mean & autocorrect
         if (json[0] && json[0][1] && json[0][1][0]) {
            var str = json[0][1][0][0][1];
            str = str.replace(/<b>(<i>)?/g, '[');
            str = str.replace(/(<\/i>)?<\/b>/g, ']');
            result.from.text.value = str;
            if (json[0][1][0][2] === 1) {
               result.from.text.autoCorrected = true;
            } else {
               result.from.text.didYouMean = true;
            }
         }

         return result;
      }).catch(function(err) {
         err.message += `\nUrl: ${url}`;
         throw err;
      });
   });
}

module.exports = translate;
module.exports.languages = languages;