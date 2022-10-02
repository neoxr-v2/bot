exports.run = {
   name: Func.basename(__filename),
   async exec(m, {
      client,
      body
   }) {
      try {
         if (body == 'bot') return m.reply('.')
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   location: __filename
}