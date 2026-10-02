exports.default = {
   tags: 'info',
   help: ['harga', 'premium', 'sewa', 'sewabot'],
   command: ['harga', 'premium', 'sewa', 'sewabot'],
   start: async (m, {
      conn
   }) => {
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

      let hub = `*📢 Hubungi Owner* \n@${setting.owner[0].split('@')[0]}\n`

      conn.adReply(m.chat, price + '\n' + sewa + hub, cover, m, {
         mentions: setting.owner.map(v => v + '@s.whatsapp.net')
      })
   }
}