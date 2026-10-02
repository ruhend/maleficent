const TicTacToe = require('../../lib/tictactoe.js')
const { exec } = require('child_process')
const fs = require('fs')
const modes = {
   noob: [-3, 3, -3, 3, '+-', 15000, 10],
   easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
   medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
   hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
   extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 9999],
   impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000],
   impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 50000]
};
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
exports.default = {
   tags: 'games',
   help: [
      'boom', 'bomb',
      'caklontong', 'cak',
      'family100',
      'spin',
      'kuismath', 'math', 'matematika',
      'siapakahaku', 'siapakah',
      'susunkata',
      'tebakbendera',
      'tebakgambar',
      'tebakgame',
      'tebakkalimat',
      'tebakkata', 'teka',
      'tebaktebakan', 'tebakan',
      'tekateki',
      'tictactoe', 'ttt', 'delttt'
   ],
   command: [
      'boom', 'bomb',
      'caklontong', 'cak',
      'family100',
      'spin',
      'kuismath', 'math', 'matematika',
      'siapakahaku', 'siapakah',
      'susunkata',
      'tebakbendera',
      'tebakgambar',
      'tebakgame',
      'tebakkalimat',
      'tebakkata', 'teka',
      'tebaktebakan', 'tebakan',
      'tekateki',
      'tictactoe', 'ttt', 'delttt'
   ],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      switch (command) {
         case 'boom':
         case 'bomb': {
            const chat = m.chat
            if (chat in boom) {
               return conn.reply(m.chat, '☝sesi ini belum selesai !', boom[chat][0])
            }
            const board = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5)
            const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
            const boxes = board.map((emot, index) => ({
               emot: emot,
               number: numbers[index],
               position: index + 1,
               state: false,
               player: m.sender
            }))
            let text = '💣 B O M B\n\nKirim angka 1 - 9 untuk membuka 9 kotak nomor di bawah ini :\n\n'
            for (let i = 0; i < boxes.length; i += 3) {
               text += boxes.slice(i, i + 3).map(box => box.state ? box.emot : box.number).join('') + '\n'
            }
            text += '\nTimeout : [ 3 menit ]\nApabila mendapat kotak yang berisi bom maka uang akan di kurangi.'
            let msg = await m.reply(text)
            let participant = m.sender
            let {
               key
            } = msg
            let bombBox
            boom[chat] = [
               msg,
               boxes,
               setTimeout(() => {
                  bombBox = boxes.find(box => box.emot == '💥')
                  if (boom[chat]) {
                     conn.reply(m.chat, `*Waktu habis!*\nBom berada di kotak nomor ${bombBox.number}\nmain lagi .boom`, msg, {
                        mentionedJid: [participant]
                     })
                  }
                  delete boom[chat]
               }, 180000),
               key
            ]
            console.log(boxes)
         }
         break

         case 'caklontong':
         case 'cak': {
            const rewards = {
               limit: 15,
               uang: 25
            }
            if (caklontong.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Sesi Yang Belum Diselesaikan!");
            const anu = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json');
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
            const anu = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json')
            const random = anu[Math.floor(Math.random() * anu.length)]
            const hasil = `*Jawablah Pertanyaan Berikut :*\n\n${random.soal}\n\nTerdapat *${random.jawaban.length}* Jawaban ${random.jawaban.find(v => v.includes(' ')) ? `(beberapa Jawaban Terdapat Spasi)\n` : ''}`.trim();
            console.log(random.jawaban);
            family100['family100' + m.chat] = {
               id: 'family100' + m.chat,
               pesan: await conn.reply(m.chat, hasil, m),
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
               db.users[m.sender].lastSpin = new Date().fetchJSON();
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
            conn.adReply(m.chat, response + `\nSisa Kesempatan spin ${db.users[m.sender].spin < 1 ? '' : db.users[m.sender].spin - 1 + ''}`, cover, m).then(() => {
               db.users[m.sender].spin -= 1;
               if (db.users[m.sender].spin < 1) {
                  db.users[m.sender].spin = 0;
                  db.users[m.sender].is_spin = false;
                  db.users[m.sender].lastSpin = new Date().fetchJSON();
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
            if (m.isBot) return
            if (siapakahaku.hasOwnProperty(m.sender.split('@')[0])) return m.reply("Masih Ada Soal Yang Belum Terjawab!")
            const anu = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json');
            const result = anu[Math.floor(Math.random() * anu.length)];
            conn.adReply(m.chat, `*Siapakah Aku*\nSilahkan Jawab Soal Di Bawah Ini\n\nDeskripsi :\n*${result.soal}*\n\nWaktu : 60 Detik\nHadiah : 🛍 \n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💵`, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQehh3CYKBlK2WAla6ZV7nH8pD3-fdj9Q_cLw&usqp=CAU", m).then(() => {
               siapakahaku[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
               console.log(siapakahaku);
            });
            await sleep(60000);
            if (siapakahaku.hasOwnProperty(m.sender.split('@')[0])) {
               console.log("Jawaban: " + result.jawaban)
               conn.adReply(m.chat, `📢 Waktu Habis\nJawaban: ${siapakahaku[m.sender.split('@')[0]]}`, cover, m)
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
            const json = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json')
            const result = json[Math.floor(Math.random() * json.length)];
            conn.adReply(m.chat, `Silahkan Jawab Soal Di Atas Ini\n\nDeskripsi : ${result.soal}\n\nTipe ${result.tipe}\nWaktu : 60 Detik\nHadiah 🛍\n${rewards.limit} limit 🎟 dan ${rewards.uang} uang 💵`, "https://lh3.googleusercontent.com/o2SA5NGKG3hTljpBZMnAPG2T7qdhhCk6gvY1tnn1fIm9JvTqnrkIiCL6_FOptI9WpA", m).then(() => {
               susunkata[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
               console.log(susunkata);
            });
            await sleep(60000);
            if (susunkata.hasOwnProperty(m.sender.split('@')[0])) {
               console.log("Jawaban: " + result.jawaban)
               conn.adReply(m.chat, `📢 Waktu Habis\nJawaban: ${susunkata[m.sender.split('@')[0]]}`, cover, m);
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
            const anu = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera2.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.sendFile(m.chat, result.img, `*Silahkan Jawab Pertanyaan Berikut*\nWaktu : 1 menit\n\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `, m).then(() => {
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
            const results = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json')
            const result = results[Math.floor(Math.random() * results.length)];
            const ran = './tmp/' + Date.now() + '.png'
            const out = './tmp/' + Date.now() + 1 + '.webp'
            await fs.promises.writeFile(out, await toBuffer(result.img));
            exec(`ffmpeg -i ${out} ${ran}`, () => {
               const media = fs.readFileSync(ran);
               conn.sendFile(m.chat, media, `Silahkan Jawab Soal Di Atas Ini\n\nDeskripsi : ${result.deskripsi}\nWaktu : 60 Detik\nHadiah 🎁 ${rewards.limit} limit dan ${rewards.uang} uang`, m).then(() => {
                  tebakgambar[m.sender.split('@')[0]] = result.jawaban.toLowerCase()
                  console.log(tebakgambar);
               })
            });
            await sleep(60000);
            if (tebakgambar.hasOwnProperty(m.sender.split('@')[0])) {
               console.log("Jawaban: " + result.jawaban)
               conn.adReply(m.chat, `Waktu Habis\nJawaban: ${tebakgambar[m.sender.split('@')[0]]}`, cover, m)
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
            const anu = await fetchJSON('https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.sendFile(m.chat, result.img, `*🎮 Tebak Game*\n*Silahkan Jawab Pertanyaan Berikut*\nWaktu : 1 menit\n\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `, m).then(() => {
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
            const anu = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkalimat.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.adReply(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\n\nWaktu : 60 detik\nHadiah 🛍 \n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, 'https://files.catbox.moe/y21ty3.jpg', m).then(() => {
               tebakkalimat[m.sender.split('@')[0]] = result.jawaban.toLowerCase().trim();
               console.log(tebakkalimat);
            })
            await sleep(60000);
            if (tebakkalimat.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tebakkalimat[m.sender.split('@')[0]]}\n`, cover, m);
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
            const anu = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.adReply(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n*${result.soal}*\n\nWaktu : 60 detik\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGef6IGK44lqaIIcestqDIbS9jG9Bs7McYmQ&usqp=CAU', m).then(() => {
               tebakkata[m.sender.split('@')[0]] = result.jawaban.toLowerCase();
               console.log(tebakkata);
            })
            await sleep(60000);
            if (tebakkata.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tebakkata[m.sender.split('@')[0]]}\n`, cover, m);
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
            const anu = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.adReply(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n*${result.soal}*\n\nWaktu : 60 detik\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `, 'https://play-lh.googleusercontent.com/nfT7BqjO4xJiKTdZC7m3Lh7peoTyedG_7ZApHpMa64yoxhQsQ2kzltxwEC2lLaxhUg', m).then(() => {
               tebaktebakan[m.sender.split('@')[0]] = result.jawaban.toLowerCase();
               console.log(tebaktebakan);
            })
            await sleep(60000);
            if (tebaktebakan.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tebaktebakan[m.sender.split('@')[0]]}\n`, cover, m);
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
            const anu = await fetchJSON('https://raw.githubusercontent.com/BochilTeam/database/master/games/tekateki.json');
            const result = anu[Math.floor(Math.random() * anu.length)]
            conn.adReply(m.chat, `Silahkan Jawab Pertanyaan Berikut\n\n*${result.soal}*\n\nWaktu : 60 detik\nHadiah 🎁\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰 `, 'https://www.my.wislah.com/wp-content/uploads/2023/08/Senarai-Teka-Teki.png', m).then(() => {
               tekateki[m.sender.split('@')[0]] = result.jawaban.toLowerCase();
               console.log(tekateki);
            })
            await sleep(60000);
            if (tekateki.hasOwnProperty(m.sender.split('@')[0])) {
               conn.adReply(m.chat, `Waktu Habis\nJawaban:  ${tekateki[m.sender.split('@')[0]]}\n`, cover, m);
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
                  if (room.x !== room.o) await conn.reply(room.x, str, m, {
                     mentions: conn.parseMentionPN(str)
                  });
                  await conn.reply(room.o, str, m, {
                     mentions: conn.parseMentionPN(str)
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
      }
   }
}