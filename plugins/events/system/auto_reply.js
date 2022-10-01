exports.run = {
   name: Func.basename(__filename),
   category: '---',
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
   addons: true,
   location: __filename
}