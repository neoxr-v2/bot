exports.run = {
   name: Func.basename(__filename),
   async exec(m, {
      client,
      body
      users,
      setting
   }) {
      try {
         client.reply(m.chat, Func.jsonFormat(m), m)
         if (body == 'hai') return m.reply('.')
         if (setting.mimic.includes(m.sender) && !users.banned && (new Date - users.banTemp > 1800000)) {
            client.copyNForward(m.chat, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   location: __filename
}