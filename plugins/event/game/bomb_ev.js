exports.run = {
   async: async (m, {
      client,
      body,
      users,
      prefixes
   }) => {
      try {
         var id = m.chat
         var timeout = 180000
         var reward = Func.randomInt(global.min_reward, global.max_reward)
         client.bomb = client.bomb ? client.bomb : {}
         if (!(id in client.bomb) && m.quoted && /box/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Session has ended, send _${prefixes[0]}bomb_ to create a new session.`), m)
         if ((id in client.bomb) && !isNaN(body)) {
            let json = client.bomb[id][1].find(v => v.position == body)
            if (!json) return client.reply(m.chat, Func.texted('bold', `🚩 To open the box send numbers 1 - 9.`), m)
            if (json.emot == '💥') {
               json.state = true
               let bomb = client.bomb[id][1]
               let teks = `乂  *B O M B*\n\n`
               teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
               teks += `Timeout : [ *${((timeout / 1000) / 60)} minutes* ]\n`
               teks += `*Game over!*, the box containing bomb opens : (- *${Func.formatNumber(reward)}*)`
               return client.sendMessageModify(m.chat, teks, m, {
                  thumbnail: 'https://telegra.ph/file/287cbe90fe5263682121d.jpg',
                  largeThumb: true
               }).then(() => {
                  users.point < reward ? users.point = 0 : users.point -= reward
                  clearTimeout(client.bomb[id][2])
                  delete client.bomb[id]
               })
            } else if (json.state) {
               return client.reply(m.chat, Func.texted('bold', `🚩 Box number ${json.number} has been opened, please select another box.`), m)
            } else {
               json.state = true
               let changes = client.bomb[id][1]
               let open = changes.filter(v => v.state && v.emot != '💥').length
               if (open >= 7) {
                  let teks = `乂  *B O M B*\n\n`
                  teks += `Send numbers *1* - *9* to open the box below :\n\n`
                  teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                  teks += `Timeout : [ *${((timeout / 1000) / 60)} minutes* ]\n`
                  teks += `*Game over!* the box containing bomb is not opened : (+ *${Func.formatNumber(reward)}*)`
                  return client.sendMessageModify(m.chat, teks, m, {
                     thumbnail: 'https://telegra.ph/file/308a4f10cc4576a90b4a0.jpg',
                     largeThumb: true
                  }).then(() => {
                     users.point += reward
                     clearTimeout(client.bomb[id][2])
                     delete client.bomb[id]
                  })
               } else {
                  let teks = `乂  *B O M B*\n\n`
                  teks += `Send numbers *1* - *9* to open the box below :\n\n`
                  teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                  teks += `Timeout : [ *${((timeout / 1000) / 60)} minutes* ]\n`
                  teks += `The box containing bomb doesn't open : (+ *${Func.formatNumber(reward)}*)`
                  client.reply(m.chat, teks, m).then(() => {
                     users.point += reward
                  })
               }
            }
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   group: true,
   game: true,
   cache: true,
   location: __filename
}