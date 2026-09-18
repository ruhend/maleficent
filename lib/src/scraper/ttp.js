const fetch = require('node-fetch');
const cheerio = require('cheerio');
const ttp = async (text) => {
   try {
      const response = await fetch("https://www.picturetopeople.org/p2p/text_effects_generator.p2p/transparent_text_effect", {
         method: "POST",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
            Cookie: "_ga=GA1.2.1700500160.1741585476; _gid=GA1.2.748301512.1741585476; __gads=ID=365d23f6824f5ae1:T=1741585507:RT=1741585507:S=ALNI_MZQsGy32Raru8_Vv3D0joNPo0zXSA; __gpi=UID=0000105a94f31ca5:T=1741585507:RT=1741585507:S=ALNI_MaWy_qb0hv_BH-tgjWcR939gYRvhw; __eoi=ID=62aafa0c438daaaa:T=1741585507:RT=1741585507:S=AA-AfjYBoalW3Ccj6kh7cnylFmll; _gat_gtag_UA_6584688_1=1",
         },
         body: new URLSearchParams({
            TextToRender: text,
            FontSize: "100",
            Margin: "30",
            LayoutStyle: "0",
            TextRotation: "0",
            TextColor: "ffffff",
            TextTransparency: "0",
            OutlineThickness: "3",
            OutlineColor: "000000",
            FontName: "Lekton",
            ResultType: "view",
         }).toString(),
      });
      const bodyText = await response.text();
      const $ = cheerio.load(bodyText);
      var result
      $('form[name="MyForm"]').each((index, formElement) => {
         const resultFile = $(formElement).find('#idResultFile').attr('value');
         const refTS = $(formElement).find('#idRefTS').attr('value');
         result = {
            url: 'https://www.picturetopeople.org' + resultFile,
            title: refTS
         }
      });
      return result
   } catch (error) {
      throw error
   }
}
module.exports = { ttp }