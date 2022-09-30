module.exports = {
   name: 'menu',
   alias: ['help', 'bot'],
   category: 'main',
   desc: '',
   use: '',
   async exec(m, sock) {
      try {
         await m.reply(`Test!!`)
      } catch (e) {
         m.reply(e.message)
      }
   }
}