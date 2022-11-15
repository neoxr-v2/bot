exports.run = {
   usage: ['fibonacci'],
   hidden: ['fibo'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.deret = client.deret ? client.deret : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.deret) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.deret[id][0])
      const json = await Func.fetchJson('https://yt.nxr.my.id/fibonacci')
      if (!json.status) return client.reply(m.chat, Func.texted('bold', '🚩 Failed to make a question.'), m)
      let teks = `乂  *F I B O N A C C I*\n\n`
      teks += `Complete the series of numbers below :\n`
      teks += `➠ ${json.data.question.map(v => v).join(' ').replace(RegExp(json.data.answer, 'i'), '_')}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `Reply this message to answer, send *${isPrefix}fiboskip* to skip this question.`
      client.deret[id] = [
         await client.reply(m.chat, teks, m),
         json.data.answer, 3,
         setTimeout(() => {
            if (client.deret[id]) client.reply(m.chat, `*Time is up!, the answer is* : ${client.deret[id][1]}`, client.deret[id][0])
            delete client.deret[id]
         }, timeout)
      ]
   },
   group: true,
   game: true
}