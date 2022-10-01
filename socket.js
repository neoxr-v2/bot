const { Boom } = require('@hapi/boom')
const fs = require('fs'),
   colors = require('@colors/colors/safe'),
   qrcode = require('qrcode-terminal'),
   path = require('path').join,
   pino = require('pino'),
   logger = pino({
      level: 'silent'
   })
const { makeInMemoryStore, DisconnectReason, useSingleFileAuthState } = require('baileys')
const { state,  saveState } = useSingleFileAuthState(path(__dirname, 'session.json'), logger)
const { Socket, Serialize, Scandir } = require('./system/extra')
global.Func = new (require('./system/function'))
global.props = new(require('./system/dataset'))
global.p = require('@discordjs/collection')
p.commands = new p.Collection()
p.prefix = '/'

const commands = () => {
   Scandir('./plugins').then(files => {
      files.filter(v => v.endsWith('.js')).map(file => {
         const command = require(file)
         const { name, usage } = commamd.run
         p.commands.set(name ? name : usage, command)
      })
   }).catch(e => console.error(e))
   console.log('Command loaded!')
}

// start a connection
const connect = async () => {
   let content = await props.fetch()
   if (!content || Object.keys(content).length === 0) {
      global.db = {
         users: {},
         chats: {},
         groups: {},
         statistic: {},
         sticker: {},
         setting: {}
      }
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
   global.client = Socket({
      logger,
      printQRInTerminal: true,
      auth: state,
      generateHighQualityLinkPreview: true
   })

   client.ev.on('messages.upsert', async msg => {
        m = msg.messages[0]
        if (!m.message) return
        Serialize(client, m)
        require('./system/config'), require('./handler')(client, m)
   })

   client.ev.on('connection.update', (update) => {
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
      if (connection === 'open') {
     	global.db.creds = client.authState.creds
         console.log(colors.green(`Connected, you login as ${client.user.name}`))
      }
      if (connection === 'close') {
         lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut ? connect() : console.log(colors.red(`Can't connect to Web Socket.`))
      }
   })

   // listen for when the auth credentials is updated
   client.ev.on('creds.update', saveState)
   
   setInterval(async () => {
      global.db.creds = client.authState.creds
      if (global.db) await props.save()
   }, 10_000)

   return client
}

connect().catch(() => connect())