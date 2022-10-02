const { Boom } = require('@hapi/boom')
const fs = require('fs'),
   colors = require('@colors/colors/safe'),
   qrcode = require('qrcode-terminal'),
   path = require('path').join,
   pino = require('pino'),
   logger = pino({
      level: 'silent'
   }),
   spinnies = new (require('spinnies'))()
const { makeInMemoryStore, DisconnectReason, useSingleFileAuthState, fetchLatestBaileysVersion, msgRetryCounterMap } = require('baileys')
const { state,  saveState } = useSingleFileAuthState(path(__dirname, 'session.json'), logger)
global.store = makeInMemoryStore({ logger })
const { Socket, Serialize, Scandir } = require('./system/extra')
global.Func = new (require('./system/function'))
global.props = new(require('./system/dataset'))
global.scrap = new (require('./system/scraper'))
global.p = require('@discordjs/collection')
p.commands = new p.Collection()

const commands = () => {
   Scandir('./plugins').then(files => {
      files.filter(v => v.endsWith('.js')).map(file => {
         const command = require(file)
         const { name, usage } = command.run
         p.commands.set(name ? name : usage, command)
      })
   }).catch(e => console.error(e))
   console.log(colors.green('Command loaded!'))
}

const connect = async () => {
   let content = await props.fetch()
   if (!content || Object.keys(content).length === 0) {
      global.db = {users:{},chats:{},groups:{},statistic:{},sticker:{},setting:{}}
      await props.save()
   } else {
      global.db = content
      try {
         if (global.db.creds) {
            credentials = {
               creds: content.creds
            }
            credentials.creds.noiseKey.private = /mongo/.test(process.env.DATABASE_URL) ? Buffer.from(content.creds.noiseKey.private.buffer) : Buffer.from(credentials.creds.noiseKey.private)
            credentials.creds.noiseKey.public = /mongo/.test(process.env.DATABASE_URL) ? Buffer.from(content.creds.noiseKey.public.buffer) : Buffer.from(credentials.creds.noiseKey.public)
            credentials.creds.signedIdentityKey.private = /mongo/.test(process.env.DATABASE_URL) ? Buffer.from(content.creds.signedIdentityKey.private.buffer) : Buffer.from(credentials.creds.signedIdentityKey.private)
            credentials.creds.signedIdentityKey.public = /mongo/.test(process.env.DATABASE_URL) ? Buffer.from(content.creds.signedIdentityKey.public.buffer) : Buffer.from(credentials.creds.signedIdentityKey.public)
            credentials.creds.signedPreKey.keyPair.private = /mongo/.test(process.env.DATABASE_URL) ? Buffer.from(content.creds.signedPreKey.keyPair.private.buffer) : Buffer.from(credentials.creds.signedPreKey.keyPair.private)
            credentials.creds.signedPreKey.keyPair.public = /mongo/.test(process.env.DATABASE_URL) ? Buffer.from(content.creds.signedPreKey.keyPair.public.buffer) : Buffer.from(credentials.creds.signedPreKey.keyPair.public)
            credentials.creds.signedPreKey.signature = /mongo/.test(process.env.DATABASE_URL) ? Buffer.from(content.creds.signedPreKey.signature.buffer) : Buffer.from(credentials.creds.signedPreKey.signature)
            credentials.creds.signalIdentities[0].identifierKey = /mongo/.test(process.env.DATABASE_URL) ? Buffer.from(content.creds.signalIdentities[0].identifierKey.buffer) : Buffer.from(credentials.creds.signalIdentities[0].identifierKey)
            state.creds = credentials.creds
         } else {
            global.db.creds = state.creds
         }
      } catch (e) {
         console.log(e)
         global.db.creds = state.creds
      }
   }

   await commands()
   const { version } = await fetchLatestBaileysVersion()
   global.client = Socket({
      logger,
      printQRInTerminal: true,
      auth: state,
      msgRetryCounterMap,
      version: global.wa_version || version,
      generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
         return await store.loadMessage(client.decodeJid(key.remoteJid), key.id)
      }
   })
   
   store.bind(client.ev)

   client.ev.on('messages.upsert', async msg => {
        m = msg.messages[0]
        if (!m.message) return
        Serialize(client, m)
        require('./system/config'), require('./handler')(client, m)
   })

   client.ev.on('connection.update', async (update) => {
      const {
         connection,
         lastDisconnect,
         qr
      } = update
      if (lastDisconnect == 'undefined' && qr != 'undefined') {
         qrcode.generate(qr, {
            small: true
         })
      }
      if (connection === 'connecting') spinnies.add('start', {
         text: 'Connecting . . .'
      })
      if (connection === 'open') {
         global.db.creds = client.authState.creds
         spinnies.succeed('start', {
            text: `Connected, you login as ${client.user.name || client.user.verifiedName}`
         })
      }
      if (connection === 'close') {
         if (lastDisconnect.error.output.statusCode == DisconnectReason.loggedOut) {
            spinnies.fail('start', {
               text: `Can't connect to Web Socket`
            })
            delete global.db.creds
            await props.save()
            process.exit(0)
         } else {
            connect().catch(() => connect())
         }
      }   
      if (update.receivedPendingNotifications) await client.reply(global.owner + '@c.us', Func.texted('bold', `🚩 Successfully connected to WhatsApp.`))
   })

   client.ev.on('creds.update', saveState)
   
   client.ev.on('contacts.update', update => {
      for (let contact of update) {
         let id = client.decodeJid(contact.id)
         if (store && store.contacts) store.contacts[id] = {
            id,
            name: contact.notify
         }
      }
   })
   
   client.ev.on('group-participants.update', async (room) => {
      let meta = await (await client.groupMetadata(room.id))
      let member = room.participants[0]
      let text_welcome = `Thank you +tag for joining into +grup group.`
      let text_left = `+tag left from this group for no apparent reason.`
      let groupSet = global.db.groups[room.id]
      try {
         pic = await Func.fetchBuffer(await client.profilePictureUrl(member, 'image'))
      } catch {
         pic = await Func.fetchBuffer(await client.profilePictureUrl(room.id, 'image'))
      }
      if (room.action == 'add') {
         if (groupSet.localonly) {
            if (typeof global.db.users[member] != 'undefined' && !global.db.users[member].whitelist && !member.startsWith('62') || !member.startsWith('62')) {
               client.reply(room.id, Func.texted('bold', `Sorry @${member.split`@`[0]}, this group is only for indonesian people and you will removed automatically.`))
               client.updateBlockStatus(member, 'block')
               return await Func.delay(2000).then(() => client.groupParticipantsUpdate(room.id, [member], 'remove'))
            }
         }
         let txt = (groupSet.text_welcome != '' ? groupSet.text_welcome : text_welcome).replace('+tag', `@${member.split`@`[0]}`).replace('+grup', `${meta.subject}`)
         if (groupSet.welcome) client.sendMessageModify(room.id, txt, null, {
            largeThumb: true,
            thumbnail: pic,
            url: 'https://chat.whatsapp.com/Dh1USlrqIfmJT6Ji0Pm2pP'
         })
      } else if (room.action == 'remove') {
         let txt = (groupSet.text_left != '' ? groupSet.text_left : text_left).replace('+tag', `@${member.split`@`[0]}`).replace('+grup', `${meta.subject}`)
         if (groupSet.left) client.sendMessageModify(room.id, txt, null, {
            largeThumb: true,
            thumbnail: pic,
            url: 'https://chat.whatsapp.com/Dh1USlrqIfmJT6Ji0Pm2pP'
         })
      }
   })

   client.ws.on('CB:call', async json => {
      if (json.content[0].tag == 'offer') {
         let object = json.content[0].attrs['call-creator']
         await Func.delay(2000)
         await client.updateBlockStatus(object, 'block')
      }
   })
   
   setInterval(async () => {
      global.db.creds = client.authState.creds
      if (global.db) await props.save()
   }, 10_000)

   return client
}

connect().catch(() => connect())