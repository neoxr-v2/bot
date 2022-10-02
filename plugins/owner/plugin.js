exports.run = {
   usage: 'plugen',
   alias: ['plugdis'],
   use: 'plugin',
   category: 'owner',
   async exec(m, {
      client,
      args,
      command,
      participants
   }) {
      let pluginDisable = global.db.setting.pluginDisable
      if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'tiktok'), m)
      let render = global.p.commands.filter(v => v.run.location),
         _render = []
      for (let name of render) _render.push(name)
      let plugins = Func.arrayJoin(Object.values(Object.fromEntries(_render)).map(v => Func.basename(v.run.location)))
      if (!plugins.includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 Plugin ${args[0]}.js not found.`), m)
      if (command == 'plugdis') {
         if (pluginDisable.includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 Plugin ${args[0]}.js previously has been disabled.`), m)
         pluginDisable.push(args[0])
         client.reply(m.chat, Func.texted('bold', `🚩 Plugin ${args[0]}.js successfully disabled.`), m)
      } else if (command == 'plugen') {
         if (!pluginDisable.includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 Plugin ${args[0]}.js not found.`), m)
         pluginDisable.forEach((data, index) => {
            if (data === args[0]) pluginDisable.splice(index, 1)
         })
         client.reply(m.chat, Func.texted('bold', `🚩 Plugin ${args[0]}.js successfully enable.`), m)
      }
   },
   error: false,
   owner: true,
   location: __filename
}