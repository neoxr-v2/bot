exports.run = {
   usage: 'reset',
   category: 'owner',
   async exec(m, {
      client
   }) {
      try {
         Object.entries(global.db.users).filter(([jid, data]) => !data.premium).map(([jid, data]) => data.limit = global.limit)
         client.reply(m.chat, Func.texted('bold', `🚩 Successfully reset limit for user free to default.`), m)
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   owner: true,
   location: __filename
}