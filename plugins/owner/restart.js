exports.run = {
   usage: 'restart',
   category: 'owner',
   async exec(m, {
      client
   }) {
      await client.reply(m.chat, Func.texted('bold', 'Restarting . . .'), m).then(async () => {
         await props.save()
         process.send('reset')
      })
   },
   error: false,
   owner: true,
   location: __filename
}