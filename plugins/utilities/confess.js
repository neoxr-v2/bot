exports.run = {
   usage: ['confess'],
   use: 'number | text',
   category: 'utilities',
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      blockList
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, '62852xxx | iove u'), m)
         let [number, ...msg] = text.split`|`
         msg = (msg || []).join`|`
         const p = await client.onWhatsApp(number)
         if (p.length == 0) return client.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
         if (blockList.includes(p[0].jid)) return client.reply(m.chat, Func.texted('bold', `🚩 Cannot send message.`), m)
         if (msg.length < 6) return client.reply(m.chat, Func.texted('bold', `🚩 Give a message of at least 6 characters.`), m)
         let message = `📩 you got *+1* incoming message from *${m.pushName}* : \n\n`
         message += `“${msg.trim()}”`
         return client.sendButtonText(p[0].jid, message, global.botname, [{
            buttonId: `${isPrefix + command}`,
            buttonText: {
               displayText: 'Send Message'
            },
            type: 1
         }]).then(() => client.reply(m.chat, Func.texted('bold', `✅ Message sent successfully to @${p[0].jid.replace(/@.+/,'')}`), m))
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   private: true,
   premium: true
}