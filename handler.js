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
      require('./system/logs')(client, m, myPrefix)
      if (m.isBot || m.chat.endsWith('broadcast')) return
      let isPrefix
      if (body && body.length != 1 && (isPrefix = (myPrefix || '')[0])) {
         let args = body.replace(isPrefix, '').split` `.filter(v => v)
         let command = args.shift().toLowerCase()
         let start = body.replace(isPrefix, '')
         let clean = start.trim().split` `.slice(1)
         let text = clean.join` `
         let prefixes = global.db.setting.multiprefix ? global.db.setting.prefix : [global.db.setting.onlyprefix]
         let is_commands = global.p.commands.get(command) || global.p.commands.filter(v => v.run.usage).find(v => v.run.usage && v.run.usage == command) || global.p.commands.filter(v => v.run.hidden).find(v => v.run.hidden && v.run.hidden.some(v => v == command)) || global.p.commands.filter(v => v.run.alias).find(v => v.run.alias && v.run.alias.some(v => v == command))
         const cmd = is_commands.run || {}
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
      } else if (global.p.commands.filter(v => v.run.regex).find(v => v.run.regex && body.match(v.run.regex))) {
         let is_events = global.p.commands.filter(v => v.run.regex).find(v => v.run.regex && body.match(v.run.regex))
         let prefixes = setting.multiprefix ? setting.prefix : [setting.onlyprefix]
         const ev = is_events.run || {}
         if (ev.error) return client.reply(m.chat, global.status.errorF, m)
         if (ev.owner && !isOwner) return client.reply(m.chat, global.status.owner, m)
         if (ev.premium && !isPrem) return client.reply(m.chat, global.status.premium, m)
         if (ev.limit && users.limit < 1) return client.reply(m.chat, `🚩 Your bot usage has reached the limit and will be reset at 00.00\n\nTo get more limits, upgrade to a premium plan send *${prefixes[0]}premium*`, m).then(() => users.premium = false)
         if (ev.limit && users.limit > 0) {
            let limit = ev.limit.constructor.name == 'Boolean' ? 1 : ev.limit
            if (users.limit >= limit) {
               users.limit -= limit
            } else {
               return client.reply(m.chat, Func.texted('bold', `🚩 Your limit is not enough to use this feature.`), m)
            }
         }
         ev.exec(m, {
            client,
            body,
            prefixes
         })
      }
   } catch (e) {
      m.reply(Func.jsonFormat(e))
   }
}