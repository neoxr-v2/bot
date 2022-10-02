exports.run = {
   usage: 'setmsg',
   use: 'text',
   category: 'owner',
   async exec(m, {
      client,
      text,
      isPrefix,
      command
   }) {
      try {
         let setting = global.db.setting
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, `Hello, how are you we currently offline now.`), m)
         setting.msg = text
         client.reply(m.chat, Func.texted('bold', `🚩 Greeting Message successfully set.`), m)
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   owner: true,
   location: __filename
}