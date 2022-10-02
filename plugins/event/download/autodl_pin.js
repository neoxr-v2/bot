exports.run = {
   name: Func.basename(__filename),
   regex: /pin(?:terest)?(?:\.it|\.com)/,
   async exec(m, {
      client,
      body,
      prefixes
   }) {
      try {
         const regex = /pin(?:terest)?(?:\.it|\.com)/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => v.match(regex))
            if (links.length != 0) {
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               Func.hitstat('pin', m.sender)
               links.map(async link => {
                  let json = await Api.pin(link)
                  if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
                  if (/jpg|mp4/.test(json.data.type)) return client.sendFile(m.chat, json.data.url, '', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
                  if (json.data.type == 'gif') return client.sendFile(m.chat, json.data.url, '', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m, {
                     gif: true
                  })
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