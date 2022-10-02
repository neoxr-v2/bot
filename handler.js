const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
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
      const body = typeof m.text == 'string' ? m.text : false
      if (!setting.online) await client.sendPresenceUpdate('unavailable', m.chat)
      if (setting.online) await client.sendPresenceUpdate('available', m.chat)
      if (setting.debug && !m.fromMe && isOwner) client.reply(m.chat, Func.jsonFormat(m), m)
      if (m.isGroup && isBotAdmin) groupSet.localonly = false
      if (m.isGroup && groupSet.autoread) await client.readMessages([m.key])
      if (!m.isGroup) await client.readMessages([m.key])
      if (m.isGroup) groupSet.activity = new Date() * 1
      if (m.chat.endsWith('broadcast') && m.mtype != 'protocolMessage') {
         let caption = `乂  *S T O R I E S*\n\n`
         if (/video|image/.test(m.mtype)) {
            caption += `${body ? body : ''}\n\n`
            caption += `*From : @${m.sender.replace(/@.+/, '')} (${client.getName(m.sender)})*`
            const media = await m.download()
            client.sendFile(global.forwards, media, '', caption)
         } else if (/extended/.test(m.mtype)) {
            caption += `${body ? body : ''}\n\n`
            caption += `*From : @${m.sender.replace(/@.+/, '')} (${client.getName(m.sender)})*`
            client.reply(global.forwards, caption)
         }
      }
      if (users) users.lastseen = new Date() * 1
      if (chats) {
         chats.lastseen = new Date() * 1
         chats.chat += 1
      }
      if (m.isGroup && !m.isBot && users.afk > -1) {
         client.reply(m.chat, `You are back online after being offline for : ${Func.texted('bold', Func.toTime(new Date - users.afk))}\n\n• ${Func.texted('bold', 'Reason')}: ${users.afkReason ? users.afkReason : '-'}`, m)
         users.afk = -1
         users.afkReason = ''
      }
      if (moment(new Date).format('HH:mm') == '00:00') {
         Object.entries(global.db.users).filter(([_, data]) => !data.limit < 10 && !data.premium).map(([_, data]) => data.limit = global.limit)
         Object.entries(global.db.statistic).map(([_, prop]) => prop.today = 0)
      }
      if (m.isGroup && !m.fromMe) {
         let now = new Date() * 1
         if (!groupSet.member[m.sender]) {
            groupSet.member[m.sender] = {
               lastseen: now,
               warning: 0
            }
         } else {
            groupSet.member[m.sender].lastseen = now
         }
      }
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
         let usage = global.p.commands.filter(v => v.run.usage),
            alias = global.p.commands.filter(v => v.run.alias)
         let _usage = [],
            _alias = []
         for (let name of usage) _usage.push(name)
         for (let name of alias) _alias.push(name)
         let is_usage = Func.arrayJoin(Object.values(Object.fromEntries(_usage)).map(v => v.run.usage)),
            is_alias = Func.arrayJoin(Object.values(Object.fromEntries(_alias)).map(v => v.run.alias))
         let commands = is_usage.concat(is_alias)
         try {
            if (new Date() * 1 - chats.command > (global.cooldown * 1000)) {
               chats.command = new Date() * 1
            } else {
               if (!m.fromMe) return
            }
         } catch (e) {
            global.db.chats[m.chat] = {}
            global.db.chats[m.chat].command = new Date() * 1
            global.db.chats[m.chat].chat = 1
            global.db.chats[m.chat].lastseen = new Date() * 1
         }
         let matcher = Func.matcher(command, commands).filter(v => v.accuracy >= 60)
         if (!commands.includes(command) && matcher.length > 0 && !setting.self) {
            if (!m.isGroup || (m.isGroup && !groupSet.mute)) return client.reply(m.chat, `🚩 Command you are using is wrong, try the following recommendations :\n\n${matcher.map(v => '➠ *' + isPrefix + v.string + '* (' + v.accuracy + '%)').join('\n')}`, m)
         }
         if (setting.error.includes(command) && !setting.self) return client.reply(m.chat, Func.texted('bold', `🚩 Command _${isPrefix + command}_ disabled.`), m)
         if (commands.includes(command)) {
            users.hit += 1
            users.usebot = new Date() * 1
            Func.hitstat(command, m.sender)
         }
         let is_commands = global.p.commands.get(command) || global.p.commands.filter(v => v.run.usage).find(v => v.run.usage && v.run.usage == command) || global.p.commands.filter(v => v.run.hidden).find(v => v.run.hidden && v.run.hidden.some(v => v == command)) || global.p.commands.filter(v => v.run.alias).find(v => v.run.alias && v.run.alias.some(v => v == command))
         if (!is_commands) return
         const cmd = is_commands.run || {}
         if (body && global.evaluate_chars.some(v => body.startsWith(v)) && !body.startsWith(myPrefix)) return
         if (!m.isGroup && global.blocks.some(no => m.sender.startsWith(no))) return client.updateBlockStatus(m.sender, 'block')
         if (setting.self && !isOwner && !m.fromMe) return
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
      } else if (global.p.commands.filter(v => v.run.name && !v.run.regex)) {
         let is_events = global.p.commands.filter(v => v.run.name && !v.run.regex)
         let prefixes = setting.multiprefix ? setting.prefix : [setting.onlyprefix]
         let tmp = []
         for (let obj of is_events) tmp.push(obj)
         let is_obj = Object.fromEntries(tmp)
         for (let name in is_obj) {
            let event = is_obj[name].run
            if (event.error) continue
            event.exec(m, {
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
            })
         }
      } else if (global.p.commands.filter(v => v.run.regex).some(v => v.run.regex) && body && setting.autodownload) {
         const urls = Func.generateLink(body)
         if (!urls) return
         let is_events = global.p.commands.filter(v => v.run.regex).find(v => urls.some(x => x.match(v.run.regex)))
         let prefixes = setting.multiprefix ? setting.prefix : [setting.onlyprefix]
         const event = is_events.run || {}
         if (event.error) return client.reply(m.chat, global.status.errorF, m)
         if (event.owner && !isOwner) return client.reply(m.chat, global.status.owner, m)
         if (event.premium && !isPrem) return client.reply(m.chat, global.status.premium, m)
         if (event.limit && users.limit < 1) return client.reply(m.chat, `🚩 Your bot usage has reached the limit and will be reset at 00.00\n\nTo get more limits, upgrade to a premium plan send *${prefixes[0]}premium*`, m).then(() => users.premium = false)
         if (event.limit && users.limit > 0) {
            let limit = event.limit.constructor.name == 'Boolean' ? 1 : event.limit
            if (users.limit >= limit) {
               users.limit -= limit
            } else {
               return client.reply(m.chat, Func.texted('bold', `🚩 Your limit is not enough to use this feature.`), m)
            }
         }
         event.exec(m, {
            client,
            body,
            prefixes
         })
      }
   } catch (e) {
      if (!m.fromMe) return m.reply(Func.jsonFormat(e))
   }
}