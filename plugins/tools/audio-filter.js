const { exec } = require('child_process');
exports.default = {
   tags: 'tools',
   help: ['bass', 'blown', 'deep', 'earrape', 'fast', 'fat', 'nightcore', 'reverse', 'robot', 'slow', 'smooth', 'tupai'],
   command: ['bass', 'blown', 'deep', 'earrape', 'fast', 'fat', 'nightcore', 'reverse', 'robot', 'slow', 'smooth', 'tupai'],
   start: async (m, {
      conn,
      prefix,
      command
   }) => {
      let set
      if (/bass/.test(command))
         set = '-af equalizer=f=54:width_type=o:width=2:g=20'
      if (/blown/.test(command))
         set = '-af acrusher=.1:1:64:0:log'
      if (/deep/.test(command))
         set = '-af atempo=4/4,asetrate=44500*2/3'
      if (/earrape/.test(command))
         set = '-af volume=12'
      if (/fast/.test(command))
         set = '-filter:a "atempo=1.63,asetrate=44100"'
      if (/fat/.test(command))
         set = '-filter:a "atempo=1.6,asetrate=22100"'
      if (/nightcore/.test(command))
         set = '-filter:a "atempo=1.06,asetrate=44100*1.25"'
      if (/reverse/.test(command))
         set = '-filter_complex "areverse"'
      if (/robot/.test(command))
         set = `-filter_complex "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75"`
      if (/slow/.test(command))
         set = '-filter:a "atempo=0.7,asetrate=44100"'
      if (/smooth/.test(command))
         set = `-filter:v "minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120'"`
      if (/tupai/.test(command))
         set = '-filter:a "atempo=0.5,asetrate=65100"'
      if (!set)
         return m.reply(`Efek tidak ditemukan.`)
      if (/audio|document|video/.test(m.quoted ? m.quoted.mtype : m.type)) {         
         const media = m.quoted ? await conn.getFile(m.quoted.content) : await conn.getFile(m.content)
         m.react('🎻')
         const ran = './tmp/' + Date.now() + '.opus'
         await exec(`ffmpeg -i "${media}" ${set} "${ran}"`, (err) => {
            if (err) return m.reply(`${err}`)
            conn.sendFile(m.chat, ran, '', m, { ptt: true })
         })
      } else {
         return m.reply(`Balas audio yang ingin diubah dengan caption *${prefix + command}*`)
      }
   }
}