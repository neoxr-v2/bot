module.exports = (m) => {
   const isNumber = x => typeof x === 'number' && !isNaN(x)
   let user = global.db.users[m.sender]
   if (user) {
      if (!isNumber(user.afk)) user.afk = -1
      if (!('afkReason' in user)) user.afkReason = ''
      if (!('banned' in user)) user.banned = false
      if (!isNumber(user.banTemp)) user.banTemp = 0
      if (!isNumber(user.banTimes)) user.banTimes = 0
      if (!('whitelist' in user)) user.whitelist = false
      if (!('premium' in user)) user.premium = false
      if (!isNumber(user.hit)) user.hit = 0
      if (!isNumber(user.point)) user.point = 0
      if (!isNumber(user.limit)) user.limit = global.limit
      if (!isNumber(user.quota)) user.quota = global.quota
      if (!isNumber(user.guard)) user.guard = 0
      if (!isNumber(user.lastquota)) user.lastquota = 0
      if (!isNumber(user.lastclaim)) user.lastclaim = 0
      if (!isNumber(user.lastseen)) user.lastseen = 0
      if (!isNumber(user.usebot)) user.usebot = 0
      if (!isNumber(user.spam)) user.spam = 0
      if (!isNumber(user.warning)) user.warning = 0
      if (!('taken' in user)) user.taken = false
      if (!('pasangan' in user)) user.pasangan = ''
      if (!('gender' in user)) user.gender = ''
      if (!isNumber(user.age)) user.age = 0
      if (!('city' in user)) user.city = ''
      if (!('register' in user)) user.register = false
   } else {
      global.db.users[m.sender] = {
         afk: -1,
         afkReason: '',
         banned: false,
         banTemp: 0,
         banTimes: 0,
         whitelist: false,
         banned: false,
         premium: false,
         hit: 0,
         point: 0,
         limit: global.limit,
         quota: global.quota,
         guard: 0,
         lastquota: 0,
         lastclaim: 0,
         lastseen: 0,
         usebot: 0,
         spam: 0,
         warning: 0,
         taken: false,
         pasangan: '',
         gender: '',
         age: 0,
         city: '',
         register: false
      }
   }

   if (m.isGroup) {
      let group = global.db.groups[m.chat]
      if (group) {
         if (!('autosticker' in group)) group.autosticker = true
         if (!isNumber(group.activity)) group.activity = new Date * 1
         if (!('antidelete' in group)) group.antidelete = true
         if (!('captcha' in group)) group.captcha = false
         if (!('mute' in group)) group.mute = false
         if (!('game' in group)) group.game = true
         if (!('welcome' in group)) group.welcome = false
         if (!('textwel' in group)) group.textwel = ''
         if (!('left' in group)) group.left = false
         if (!('textleft' in group)) group.textleft = ''
         if (!('notify' in group)) group.notify = false
         if (!('protect' in group)) group.protect = false
         if (!('localonly' in group)) group.localonly = false
         if (!('filter' in group)) group.filter = false
         if (!('antilink' in group)) group.antilink = false
         if (!('antivirtex' in group)) group.antivirtex = false
         if (!isNumber(group.expired)) group.expired = 0
         if (!('stay' in group)) group.stay = false
         if (!isNumber(group.pao_slot)) group.pao_slot = 2
         if (!isNumber(group.pao_timeout)) group.pao_timeout = 10000
         if (!('member' in group)) group.member = {}
         if (!('FTJ' in group)) group.FTJ = {
            players: [],
            simulate: false,
            state: false,
            action: false,
            judgment: false,
            kill: false,
            stage: 1
         }
      } else {
         global.db.groups[m.chat] = {
            autosticker: false,
            activity: new Date * 1,
            antidelete: true,
            captcha: false,
            mute: false,
            game: true,
            welcome: true,
            textwel: '',
            left: true,
            textleft: '',
            notify: true,
            protect: false,
            localonly: false,
            filter: false,
            antilink: false,
            antivirtex: false,
            expired: 0,
            stay: false,
            pao_slot: 2,
            pao_timeout: 10000,
            member: {},
            FTJ: {
               players: [],
               simulate: false,
               state: false,
               action: false,
               judgment: false,
               kill: false,
               stage: 1
            }
         }
      }
   }

   let chat = global.db.chats[m.chat]
   if (chat) {
      if (!isNumber(chat.command)) chat.command = 0
      if (!isNumber(chat.chat)) chat.chat = 0
      if (!isNumber(chat.lastseen)) chat.lastseen = 0
      if (!isNumber(chat.lastchat)) chat.lastchat = 0
   } else {
      global.db.chats[m.chat] = {
         command: 0,
         chat: 0,
         lastseen: 0,
         lastchat: 0
      }
   }

   let setting = global.db.setting
   if (setting) {
      if (!('asupan' in setting)) setting.asupan = []
      if (!('autodownload' in setting)) setting.autodownload = true
      if (!('chatbot' in setting)) setting.chatbot = true
      if (!('debug' in setting)) setting.debug = false
      if (!('games' in setting)) setting.games = false
      if (!('groupmode' in setting)) setting.groupmode = false
      if (!isNumber(setting.reeetTime)) setting.resetTime = 18000000
      if (!('self' in setting)) setting.self = false
      if (!('error' in setting)) setting.error = []
      if (!('pluginDisable' in setting)) setting.pluginDisable = []
      if (!isNumber(setting.messageSent)) setting.messageSent = 0
      if (!isNumber(setting.messageReceived)) setting.messageReceived = 0
      if (!isNumber(setting.uploadSize)) setting.uploadSize = 0
      if (!isNumber(setting.receiveSize)) setting.receiveSize = 0
      if (!('sk_pack' in setting)) setting.sk_pack = 'Sticker'
      if (!('sk_author' in setting)) setting.sk_author = '@neoxrs'
      if (!('multiprefix' in setting)) setting.multiprefix = true
      if (!('prefix' in setting)) setting.prefix = ['.', '/', '!', '#']
      if (!('onlyprefix' in setting)) setting.onlyprefix = '+'
      if (!('owners' in setting)) setting.owners = ['994408364923']
      if (!('moderators' in setting)) setting.moderators = []
      if (!('online' in setting)) setting.online = true
      if (!('verify' in setting)) setting.verify = true
      if (!('toxic' in setting)) setting.toxic = ["ajg", "ajig", "anjas", "anjg", "anjim", "anjing", "anjrot", "anying", "asw", "autis", "babi", "bacod", "bacot", "bagong", "bajingan", "bangsad", "bangsat", "bastard", "bego", "bgsd", "biadab", "biadap", "bitch", "bngst", "bodoh", "bokep", "cocote", "coli", "colmek", "comli", "dajjal", "dancok", "dongo", "fuck", "gelay", "goblog", "goblok", "guoblog", "guoblok", "hairul", "henceut", "idiot", "itil", "jamet", "jancok", "jembut", "jingan", "kafir", "kanjut", "kanyut", "keparat", "kntl", "kontol", "lana", "loli", "lont", "lonte", "mancing", "meki", "memek", "ngentod", "ngentot", "ngewe", "ngocok", "ngtd", "njeng", "njing", "njinx", "oppai", "pantek", "pantek", "peler", "pepek", "pilat", "pler", "pornhub", "pucek", "puki", "pukimak", "redhub", "sange", "setan", "silit", "telaso", "tempek", "tete", "titit", "toket", "tolol", "tomlol", "tytyd", "wildan", "xnxx"]
      if (!('cover' in setting)) setting.cover = 'https://telegra.ph/file/b277cff79c78eba2d9661.jpg'
      if (!('header' in setting)) setting.header = 'CHATBOT • རཀཛ ནརཛརཀ'
      if (!('msg' in setting)) setting.msg = 'Sistem otomatis (WhatsApp Bot) yang dapat membantu untuk melakukan sesuatu, mencari dan mendapatkan data / informasi hanya dengan melalui WhatsApp.\n\n◦ *Database* : MongoDB\n◦ *Library* : Baileys v4.3.0\n◦ *Rest API* : https://api.neoxr.my.id\n◦ *Source* : https://github.com/neoxr/neoxr-bot\n\nApabila menemukan error atau ingin upgrade ke premium plan silahkan huhungi owner.'
      if (!('label' in setting)) setting.label = '© neoxr-bot v2.2.1 (Public Bot)'
      if (!isNumber(setting.setmenu)) setting.setmenu = 10
      if (!('link' in setting)) setting.link = 'https://chat.whatsapp.com/H2BtTtA5lkEIbqiHL4SJU3'
      if (!('footer' in setting)) setting.footer = 'ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ɴᴇᴏxʀ ッ'
   } else {
      global.db.setting = {
         asupan: [],
         autodownload: true,
         chatbot: true,
         debug: false,
         games: true,
         groupmode: false,
         resetTime: 18000000,
         self: false,
         error: [],
         pluginDisable: [],
         messageSent: 0,
         messageReceived: 0,
         uploadSize: 0,
         receiveSize: 0,
         sk_pack: 'Sticker',
         sk_author: '@neoxrs',
         multiprefix: true,
         prefix: ['.', '#', '!', '/'],
         onlyprefix: '+',
         owners: ['994408364923'],
         moderators: [],
         online: true,
         verify: true,
         toxic: ["ajg", "ajig", "anjas", "anjg", "anjim", "anjing", "anjrot", "anying", "asw", "autis", "babi", "bacod", "bacot", "bagong", "bajingan", "bangsad", "bangsat", "bastard", "bego", "bgsd", "biadab", "biadap", "bitch", "bngst", "bodoh", "bokep", "cocote", "coli", "colmek", "comli", "dajjal", "dancok", "dongo", "fuck", "gelay", "goblog", "goblok", "guoblog", "guoblok", "hairul", "henceut", "idiot", "itil", "jamet", "jancok", "jembut", "jingan", "kafir", "kanjut", "kanyut", "keparat", "kntl", "kontol", "lana", "loli", "lont", "lonte", "mancing", "meki", "memek", "ngentod", "ngentot", "ngewe", "ngocok", "ngtd", "njeng", "njing", "njinx", "oppai", "pantek", "pantek", "peler", "pepek", "pilat", "pler", "pornhub", "pucek", "puki", "pukimak", "redhub", "sange", "setan", "silit", "telaso", "tempek", "tete", "titit", "toket", "tolol", "tomlol", "tytyd", "wildan", "xnxx"],
         cover: 'https://telegra.ph/file/b277cff79c78eba2d9661.jpg',
         header: 'CHATBOT • རཀཛ ནརཛརཀ',
         msg: 'Sistem otomatis (WhatsApp Bot) yang dapat membantu untuk melakukan sesuatu, mencari dan mendapatkan data / informasi hanya dengan melalui WhatsApp.\n\n◦ *Database* : MongoDB\n◦ *Library* : Baileys v4.3.0\n◦ *Rest API* : https://api.neoxr.my.id\n◦ *Source* : https://github.com/neoxr/neoxr-bot\n\nApabila menemukan error atau ingin upgrade ke premium plan silahkan huhungi owner.',
         label: '© neoxr-bot v2.2.1 (Public Bot)',
         setmenu: 10,
         link: 'https://chat.whatsapp.com/H2BtTtA5lkEIbqiHL4SJU3',
         footer: 'ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ɴᴇᴏxʀ ッ'
      }
   }
}