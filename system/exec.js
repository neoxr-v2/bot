const util = require('util'),
   exec = require('child_process').exec,
   syntax = require('syntax-error')

module.exports = async (sock, m, isOwner) => {
   if (typeof m.text == 'object') return
   let command, text
   let x = m.text.trim().split`\n`,
      y = ''
   command = x[0].split` ` [0]
   y += x[0].split` `.slice`1`.join` `, y += x.slice`1`.join`\n`
   text = y.trim()
   if (command == '>') {
      if (!isOwner || !text) return
      try {
         evL = await eval(`(async () => { ${text} })()`)
         sock.reply(m.chat, util.format(evL), m)
      } catch (e) {
         let err = await syntax(text)
         sock.reply(m.chat, typeof err != 'undefined' ? Func.texted('monospace', err) + '\n\n' : '' + util.format(e), m)
      }
   } else if (command == '=>') {
      if (!isOwner || !text) return
      try {
         evL = await eval(`(async () => { return ${text} })()`)
         sock.reply(m.chat, util.format(evL), m)
      } catch (e) {
         let err = await syntax(text)
         sock.reply(m.chat, typeof err != 'undefined' ? Func.texted('monospace', err) + '\n\n' : '' + util.format(e), m)
      }
   } else if (command == '$') {
      if (!isOwner || !text) return
      sock.reply(m.chat, Func.texted('bold', 'executing . . .'), m)
      exec(text, (err, stdout) => {
         if (err) return sock.reply(m.chat, err.toString(), m)
         if (stdout) return sock.reply(m.chat, stdout, m)
      })
   }
}