exports.run = {
   name: Func.basename(__filename),
   async exec(m, {
      client,
      body
   }) {
      try {
         if (body == 'p') {
         	m.reply('Hai')
         } else if (body == 'bot') return m.reply('kntl')
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   location: __filename
}