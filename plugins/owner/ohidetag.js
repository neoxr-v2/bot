exports.run = {
   usage: 'ohidetag',
   hidden: ['o'],
   use: 'text',
   category: 'owner',
   async exec(m, {
      client,
      text,
      participants
   }) {
      let users = participants.map(u => u.id)
      await client.reply(m.chat, text, null, {
         mentions: users
      })
   },
   error: false,
   owner: true,
   group: true,
   location: __filename
}