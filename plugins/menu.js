exports.run = {
   usage: 'menu',
   alias: ['help', 'bot'],
   hidden: ['menutype'],
   async exec(m, {
      client,
      args,
      isPrefix,
      command
   }) {
      try {
         if (args && args[0]) {
            const cmd = global.p.commands.filter(cmd => cmd.run.usage && cmd.run.category == args[0].toLowerCase())
            let usage = [],
               keys = cmd.keys()
            for (let k of keys) usage.push(k)
            if (usage.length == 0) return client.reply(m.chat, Func.texted('bold', `🚩 Category not available.`), m)
            let commands = []
            cmd.map(v => {
               commands.push({
                  usage: v.run.usage,
                  use: v.run.use ? Func.texted('bold', v.run.use) : ''
               })
               if (v.run.alias) v.run.alias.map(x => commands.push({
                  usage: x,
                  use: v.run.use ? Func.texted('bold', v.run.use) : ''
               }))
            })
            const print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map(v => `◦  ${isPrefix + v.usage} ${v.use}`).join('\n')
            return m.reply(print)
         } else {
            const cmds = global.p.commands.keys()
            let category = []
            for (let cmd of cmds) {
               let obj = global.p.commands.get(cmd).run
               if (!cmd) continue
               if (!obj.category) continue
               if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
               else {
                  category[obj.category] = []
                  category[obj.category].push(obj)
               }
            }
            let rows = []
            const keys = Object.keys(category).sort()
            for (let k of keys) {
               rows.push({
                  title: k.toUpperCase(),
                  rowId: `${isPrefix}menutype ${k}`,
                  description: ``
               })
            }
            await client.sendList(m.chat, '', global.db.setting.msg, `© neoxr-bot v${global.version}`, 'Tap!', [{
               rows
            }], m)
         }
      } catch (e) {
         m.reply(e.message)
      }
   },
   error: false,
   location: __filename
}