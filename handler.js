module.exports = async (client, m) => {
   try {
      require('./system/database')(m)
      const isOwner = [global.owner, ...global.db.setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isPrem = (typeof global.db.users[m.sender] != 'undefined' && global.db.users[m.sender].premium) || isOwner
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata.participants : [] || []
      const adminList = m.isGroup ? await client.groupAdmin(m.chat) : [] || []
      const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      const isBotAdmin = m.isGroup ? adminList.includes((client.user.id.split`:` [0]) + '@s.whatsapp.net') : false
      const blockList = typeof await (await client.fetchBlocklist()) != 'undefined' ? await (await client.fetchBlocklist()) : []
      const groupSet = global.db.groups[m.chat],
         chats = global.db.chats[m.chat],
         users = global.db.users[m.sender],
         setting = global.db.setting
      client.sendPresenceUpdate('available', m.chat)
      const body = typeof m.text == 'string' ? m.text : false
      require('./system/exec')(client, m, isOwner)
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
         let is_commands = global.p.commands.get(command) || global.p.commands.filter((cmd) => cmd.run.usage).find((cmd) => cmd.run.usage && cmd.run.usage.includes(command)) || global.p.commands.filter((cmd) => cmd.run.hidden).find((cmd) => cmd.run.hidden && cmd.run.hidden.includes(command))
         try {
            const cmd = is_commands.run
            if (cmd.error) return client.reply(m.chat, global.status.errorF, m)
            if (cmd.owner && !isOwner) return client.reply(m.chat, global.status.owner, m)
            if (cmd.premium && !isPrem) return client.reply(m.chat, global.status.premium, m)
            if (cmd.limit && users.limit < 1) return client.reply(m.chat, `🚩 Your bot usage has reached the limit and will be reset at 00.00\n\nTo get more limits, upgrade to a premium plan send *${prefixes[0]}premium*`, m).then(() => users.premium = false)
            if (cmd.limit && users.limit > 0) {
               let limit = cmd.limit.constructor.name == 'Boolean' ? 1 : cmd.limit
               if (users.limit >= limit) {
                  users.limit -= limit
               } else {
                  return client.reply(m.chat, Func.texted('bold', `🚩 Your limit is not enough to use this feature.`), m)
               }
            }
            if (cmd.group && !m.isGroup) {
               return client.reply(m.chat, global.status.group, m)
            } else if (cmd.botAdmin && !isBotAdmin) {
               return client.reply(m.chat, global.status.botAdmin, m)
            } else if (cmd.admin && !isAdmin) {
               return client.reply(m.chat, global.status.admin, m)
            }
            if (cmd.private && m.isGroup) return client.reply(m.chat, global.status.private, m)
            cmd.exec(m, {
               client,
               args,
               text,
               isPrefix,
               command,
               participants,
               blockList,
               isAdmin,
               isBotAdmin,
               isOwner
            })
         } catch (e) {
            console.error("[CMD ERROR] ", e);
         }
      } else {
        /* let prefixes = setting.multiprefix ? setting.prefix : [setting.onlyprefix]
         let is_events = global.p.commands.filter(ev => !ev.run.usage)
         let event = is_events.run
         if (event.error) return client.reply(m.chat, global.status.errorF, m)
         if (event.owner && !isOwner) return client.reply(m.chat, global.status.owner, m)
         if (event.premium && !isPrem) return client.reply(m.chat, global.status.premium, m)
         if (event.limit && users.limit < 1) return client.reply(m.chat, `🚩 Your bot usage has reached the limit and will be reset at 00.00\n\nTo get more limits, upgrade to a premium plan send ${prefixes[0]}premium`, m).then(() => users.premium = false)
         if (event.limit && users.limit > 0) {
            let limit = event.limit.constructor.name == 'Boolean' ? 1 : event.limit
            if (users.limit >= limit) {
               users.limit -= limit
            } else {
               return client.reply(m.chat, Func.texted('bold', `🚩 Your limit is not enough to use this feature.`), m)
            }
         }
         if (event.group && !m.isGroup) {
            return client.reply(m.chat, global.status.group, m)
         } else if (event.botAdmin && !isBotAdmin) {
            return client.reply(m.chat, global.status.botAdmin, m)
         } else if (event.admin && !isAdmin) {
            return client.reply(m.chat, global.status.admin, m)
         }
         if (event.private && m.isGroup) return client.reply(m.chat, global.status.private, m)
         event.async(m, {
            client,
            body,
            participants,
            prefixes,
            isOwner,
            isAdmin,
            isBotAdmin,
            users,
            chats,
            groupSet,
            groupMetadata,
            setting
         }) */
      }
   } catch (e) {
      console.log("[CHATS ERROR] ", String(e))
   }
}