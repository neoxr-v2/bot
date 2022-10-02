exports.run = {
   name: Func.basename(__filename),
   regex: /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/,
   async exec(m, {
      client,
      body,
      prefixes
   }) {
      try {
         const regex = /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/;
         const extract = body ? Func.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => v.match(regex))
            if (links.length != 0) {
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               Func.hitstat('fb', m.sender)
               links.map(async link => {
                  let json = await Api.fb(link)
                  if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
                  let result = json.data.find(v => v.quality == 'HD')
                  if (result) {
                     client.sendFile(m.chat, result.url, Func.filename('mp4'), `◦ *Quality* : HD`, m)
                  } else {
                     let result = json.data.find(v => v.quality == 'SD')
                     if (!result) return client.reply(m.chat, global.status.fail, m)
                     client.sendFile(m.chat, result.url, Func.filename('mp4'), `◦ *Quality* : SD`, m)
                  }
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