exports.run = {
   usage: ['topglobal'],
   category: 'user info',
   async: async (m, {
      client,
      participants
   }) => {
      let point = global.db.users.sort((a, b) => b.point - a.point)
      let rank = point.map(v => v.jid)
      let show = Math.min(10, point.length)
      let teks = `δΉ  *T O P - G L O B A L*\n\n`
      teks += `βYou are ranked *${rank.indexOf(m.sender) + 1}* out of *${global.db.users.length}* users.β\n\n`
      teks += point.slice(0, show).map((v, i) => (i + 1) + '. @' + v.jid.split`@` [0] + '\n    *π΄  :  ' + Func.formatNumber(v.point) + '*\n    *π  :  ' + Func.level(v.point)[0] + ' [ ' + Func.formatNumber(Func.level(v.point)[3]) + ' / ' + Func.formatNumber(Func.level(v.point)[1]) + ' ]*').join`\n`
      teks += `\n\n${global.footer}`
      client.reply(m.chat, teks, m)
   },
   error: false
}