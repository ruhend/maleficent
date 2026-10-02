exports.default = {
   tags: 'islam',
   help: ['adzan', 'bacaansholat', 'mandiwajib', 'mandijunub', 'niatsholat', 'solatjumat', 'sojum'],
   command: ['adzan', 'bacaansholat', 'mandiwajib', 'mandijunub', 'niatsholat', 'solatjumat', 'sojum'],
   start: async (m, {
      conn,
      command
   }) => {
      if (command === 'adzan') {
         const adzan = `
Arab:

(٢x) اَللهُ اَكْبَرُ،اَللهُ اَكْبَرُ
(٢x) أَشْهَدُ اَنْ لاَ إِلٰهَ إِلَّااللهُ
(٢x) اَشْهَدُ اَنَّ مُحَمَّدًا رَسُوْلُ اللهِ
(٢x) حَيَّ عَلَى الصَّلاَةِ
(٢x) حَيَّ عَلَى الْفَلاَحِ
(١x) اَللهُ اَكْبَرُ ،اَللهُ اَكْبَرُ
(١x) لَا إِلَهَ إِلَّااللهُ

Latin:

Allaahu Akbar, Allaahu Akbar (2x)
Asyhadu allaa illaaha illallaah. (2x)
Asyhadu anna Muhammadar rasuulullah. (2x)
Hayya 'alashshalaah (2x)
Hayya 'alalfalaah. (2x)
Allaahu Akbar, Allaahu Akbar (1x)
Laa ilaaha illallaah (1x)

Artinya :

Allah Maha Besar, Allah Maha Besar
Aku menyaksikan bahwa tiada Tuhan selain Allah
Aku menyaksikan bahwa nabi Muhammad itu adalah utusan Allah
Marilah Sholat
Marilah menuju kepada kejayaan
Allah Maha Besar, Allah Maha Besar
Tiada Tuhan selain Allah

Kemudian, untuk lafadz adzan subuh ada kalimat yang ditambahkan, yakni

Arab: اَلصَّلاَةُ خَيْرٌ مِنَ النَّوْمِ

Latin: Ash-shalaatu khairum minan-nauum

Artinya: Sholat itu lebih baik dari pada tidur

dan dibaca 2x setelah lafadz Hayya 'alalfalaah

Nah, semoga kita semua bisa memaknai lafadz adzan dengan betul ya!
`
         return conn.adReply(m.chat, adzan, cover, m)
      } else if (command === 'bacaansholat') {
         const bacaansholat = `
1. Takhbiratul ikhram

*Allâhu Akbar*

2. Iftitah

*Allaahu akbar Kabiroo Walhamdulillaahi Katsiiraa, Wa Subhaanallaahi Bukratan Wa'ashiilaa, Innii Wajjahtu Wajhiya Lilladzii Fatharas Samaawaati Wal Ardha Haniifan Musliman Wamaa Anaa Minal Musyrikiin. Inna Shalaatii Wa Nusukii Wa Mahyaaya Wa Mamaatii Lillaahi Rabbil 'Aalamiina. Laa Syariikalahu Wa Bidzaalika Umirtu Wa Ana Minal Muslimiin*

3. Ruku

*Subhana rabbiyal adhimi wa bihamdihi* 3x

4. I-tidal berdiri setelah Ruku

*Sami allahu liman hamidah*

5. Sujud

*Subhana rabbiyal a-laa wa bi hamdih*

6. Duduk di antara dua sujud 

*Rabighfirlii, Warhamnii, Wajburnii, Warfa'ni, Warzuqnii, Wahdini, Wa'aafinii, Wa'fuannii*

7. Membaca Tasyahud awal

*Attahiyyaatul mubaarakaatush shalawaatuth thoyyibaatulillaah. Assalaamu•alaika ayyuhan nabiyyu warahmatullaahi wabarakaatuh, Assalaamu•alaina waalaa ibaadillaahishaalihiin. Asyhaduallaa ilaaha illallaah, wa asyhadu anna Muhammad Rasuulullaah. Allahumma shalli •alaa sayyidinaa muhammad*

8. Membaca Tasyahud Akhir

*Attahiyyaatul mubaarakaatush shalawaatuth thoyyibaatulillaah. Assalaamu•alaika ayyuhan nabiyyu warahmatullaahi wabarakaatuh, Assalaamu•alaina waalaa ibaadillaahishaalihiin. Asyhaduallaa ilaaha illallaah, wa asyhadu anna Muhammad Rasuulullaah. Allahumma shalli •alaa sayyidinaa muhammad Wa alaa aali sayyidina muhammad. Kamaa shallaita 'alaa sayyidinaa Ibraahim wa'alaa aali sayyidinaa ibraahim wabaarik 'alaa sayyidinaa muhammad wa 'alaa aali sayyidina muhammad. Kamaa baarakta 'alaa sayyidinaa ibraahiim wa 'alaa aali sayyidinaa Ibraahiim fil•aalamiina innaka hamiidum majiid*

9. salam

*Assalaamu alaikum wa rahmatullah* 2x kanan kiri
`
         return conn.adReply(m.chat, bacaansholat, cover, m)
      } else if (command === 'mandiwajib' || command === 'mandijunub') {
         const text = ` Tata Cara Mandi Wajib Laki-laki
Mengacu pada sumber yang sama, berikut merupakan langkah-langkah melaksanakan mandi wajib laki-laki sesuai dengan sunnah.

1. Melafalkan niat mandi wajib, berikut bacaannya:
نَوَيْتُ الْغُسْلَ لِرَفْعِ اْلحَدَثِ اْلأَكْبَرِ مِنَ اْلِجنَابَةِ فَرْضًا لِلهِ تَعَالَى

"Nawaitul-ghusla lirafil ḫadatsil-akbari fardlan lillâhi ta'ala"

 Atau

"Nawaitul-ghusla lirafil ḫadatsil-akbari minal-jinâbati fardlan lillâhi ta'ala"

Artinya: "Aku berniat mandi besar untuk menghilangkan hadats besar fardhu karena Allah ta'ala,"

2. Membersihkan telapak tangan sebanyak tiga kali
3. Membersihkan kotoran tersembunyi dengan menggunakan tangan kiri, seperti kemaluan, dubur, bawah ketiak, pusar, dan lain sebagainya
4. Mencuci tangan dengan cara menggosokkan ke sabun atau tanah
5. Berwudhu seperti akan melaksanakan sholat
6. Sela pangkal rambut menggunakan jari-jari tangan yang telah dibasuh air hingga menyentuh kulit kepala
7. Membasuh seluruh tubuh dengan air yang dimulai dari sisi kanan, lalu ke sisi kiri
8. Memastikan seluruh lipatan kulit serta bagian yang tersembunyi ikut dibersihkan
`
         return conn.adReply(m.chat, text, cover, m)
      } else if (command === 'niatsholat') {
         const niatsholat = ` 
*Niat Sholat*

1. *Niat Sholat Subuh*
اُصَلِّى فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhosh shubhi rok'ataini mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu Shubuh dua raka'at menghadap kiblat karena Allah Ta'ala

2. *Niat Sholat Dzuhur*
اُصَلِّى فَرْضَ الظُّهْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhodl dhuhri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu Dzuhur empat raka'at menghadap kiblat karena Allah Ta'ala

3. *Niat Sholat Ashar*
اُصَلِّى فَرْضَ الْعَصْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhol 'ashri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu 'Ashar empat raka'at menghadap kiblat karena Allah Ta'ala

4. *Niat Sholat Maghrib*
اُصَلِّى فَرْضَ الْمَغْرِبِ ثَلاَثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhol maghribi tsalaata raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu Maghrib tiga raka'at menghadap kiblat karena Allah Ta'ala

5. *Niat Sholat Isya*
اُصَلِّى فَرْضَ الْعِشَاءِ اَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى
*Ushalli fardhol 'isyaa-i arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala*
Aku berniat shalat fardhu Isya empat raka'at menghadap kiblat karena Allah Ta'ala

_Suatu ibadah akan diterima bila memenuhi dua hal, yaitu niat dan contoh dari rasulullah saw:_
*_"إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ ...[رواه البخاري ومسلم]رَ"_*

Artinya: *_Sesungguhnya (sahnya) amal itu tergantung kepada niat ... [Hadits Riwayat al-Bukhari dan Muslim]_*
`
         return conn.adReply(m.chat, niatsholat, cover, m)
      } else if (command === 'solatjumat' || command === 'sojum') {
         const sojum = `Apakah solat Jumaat?
Solat jumaat adalah solat fardhu, dua rakaat yang dilakukan pada hari Jumaat untuk menggantikan solat Zuhur. Niat solat jumaat juga berbeza dengan solat fardhu yang lain. Ia haruslah dilakukan secara berjemaah selepas mendengar khutbah Jumaat.

*Syarat wajib solat Jumat*
Islam – tidak wajib bagi orang kafir
Baligh – tidak wajib bagi kanak-kanak belum baligh
Berakal – tidak wajib bagi orang yang gila
Merdeka – tidak wajib ke atas hamba abdi
Lelaki – tidak diwajibkan berjemaah untuk orang perempuan
Sihat – tidak wajib berjemaah bagi orang yang uzur, dan berhalangan
Bermastautin atau bermukim – tidak wajib berjemaah bagi orang yang musafir

*Syarat sah solat Jumat*
- Didirikan di dalam waktu Zuhur
- Tempat mendirikan solat Jumaat itu mestilah di suatu tempat yang telah ditetapkan seperti masjid, dewan, padang, dan sebagainya
- Mestilah berjemaah dengan sekurang-kurangnya 40 orang yang beriman yang tinggal di kawasan itu
- Didahului dengan dua khutbah

*"Usolli fardol jum'ati rak'ataini makmuman lillahi taala"*

`
         return conn.adReply(m.chat, sojum, 'https://akuislam.com/wp-content/uploads/2023/01/Niat-Solat-Jumaat@2x-768x321.png', m)
      }
   }
}