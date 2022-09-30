module.exports = async (sock, m) => {
   try {
      require('./system/database')(m)
      const isOwner = [global.owner, ...global.db.setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isPrem = (typeof global.db.users[m.sender] != 'undefined' && global.db.users[m.sender].premium) || isOwner
      const groupMetadata = m.isGroup ? await sock.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata.participants : [] || []
      // const adminList = m.isGroup ? await sock.groupAdmin(m.chat) : [] || []
      // const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      // const isBotAdmin = m.isGroup ? adminList.includes((sock.user.id.split`:` [0]) + '@s.whatsapp.net') : false
      const blockList = typeof await (await sock.fetchBlocklist()) != 'undefined' ? await (await sock.fetchBlocklist()) : []
      const groupSet = global.db.groups[m.chat],
         chats = global.db.chats[m.chat],
         users = global.db.users[m.sender],
         setting = global.db.setting
      sock.sendPresenceUpdate('available', m.chat)
      const body = typeof m.text == 'string' ? m.text : false
      require('./system/exec')(sock, m, isOwner)
      const getPrefix = body ? body.charAt(0) : ''
      const myPrefix = (setting.multiprefix ? setting.prefix.includes(getPrefix) : setting.onlyprefix == getPrefix) ? getPrefix : undefined
      let isPrefix
      if (body && body.length != 1 && (isPrefix = (myPrefix || '')[0])) {
         let args = body.replace(isPrefix, '').split` `.filter(v => v)
         let command = args.shift().toLowerCase()
         let start = body.replace(isPrefix, '')
         let clean = start.trim().split` `.slice(1)
         let text = clean.join` `
         let prefixes = global.db.setting.multiprefix ? global.db.setting.prefix : [global.db.setting.onlyprefix]
         const cmd = global.p.commands.get(command) || global.p.commands.find((cmd) => cmd.alias && cmd.alias.includes(command))
         try {
           if (cmd.owner && !isOwner) return sock.reply(m.chat, global.status.owner, m)	
           cmd.exec(m, {
               sock,
               args,
               text,
               isPrefix,
               command,
               participants,
               blockList,
               isOwner
            })
         } catch (e) {
            console.error("[CMD ERROR] ", e);
         }
      }
   } catch (e) {
      console.log("[CHATS ERROR] ", String(e))
   }
}