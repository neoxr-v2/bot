exports.run = {
   name: Func.basename(__filename),
   regex: /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/,
   async exec(m, {
      client,
      body,
      prefixes
   }) {
      try {
         const regex = /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => Func.ttFixed(v).match(regex))
            if (links.length != 0) {
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               // Func.hitstat('tiktok', m.sender)
               links.map(async link => {
                  let json = await Api.tiktok(Func.ttFixed(link))
                  if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
                  client.sendButton(m.chat, json.data.video, `If you want to get the *original sound* press the button below.\n🍟 *Fetching* : ${((new Date - old) * 1)} ms`, ``, m, [{
                     buttonId: `${prefixes[0]}tikmp3 ${link}`,
                     buttonText: {
                        displayText: 'Backsound'
                     },
                     type: 1
                  }])
               })
            }
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true,
   location: __filename
}