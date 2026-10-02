exports.default = {
   tags: 'download',
   help: ['iqc', 'qcphone'],
   command: ['iqc', 'qcphone'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) throw `gunakan : .iqc pesan\ncontoh : ${prefix+command} hai`;
      m.react('🕒')
      const battery = Math.floor(Math.random() * 100) + 1;
      const image = await toBuffer(`https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(waktu.time)}&batteryPercentage=${battery}&carrierName=Smartfren&messageText=${text}&emojiStyle=apple`)
      await conn.sendFile(m.chat, image, '', m);           
   },
   limit: 2
}