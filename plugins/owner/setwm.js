exports.run = {
   usage: 'setwm',
   use: 'packname | author',
   category: 'owner',
   async exec(m, {
      client,
      text,
      isPrefix,
      command
   }) {
      try {
         let setting = global.db.setting
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'Sticker by | @neoxrs'), m)
         let [packname, ...author] = text.split`|`
         author = (author || []).join`|`
         setting.sk_pack = packname || ''
         setting.sk_author = author || ''
         client.reply(m.chat, Func.texted('bold', `🚩 Sticker Watermark successfully set.`), m)
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   owner: true,
   location: __filename
}