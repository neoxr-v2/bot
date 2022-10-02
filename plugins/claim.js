exports.run = {
   usage: 'claim',
   async exec(m, {
      client
   }) {
      try {
         m.reply('😋')
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   location: __filename
}