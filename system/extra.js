const fs = require('fs')
const { writeFile } = require('fs/promises')
const mime = require('mime-types')
const path = require('path')
const { promisify } = require('util')
const { resolve } = require('path')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const {
   default: makeWASocket,
   proto,
   downloadContentFromMessage,
   MessageType,
   Mimetype,
   getContentType,
   generateWAMessage,
   generateWAMessageFromContent,
   generateForwardMessageContent,
   prepareWAMessageMedia,
   WAMessageProto,
   delay,
   jidDecode
} = require('baileys')
const Bluebird = require('bluebird')

const Socket = (...args) => {
   let client = makeWASocket(...args)
   Object.defineProperty(client, 'name', {
      value: 'WASocket',
      configurable: true,
   })
   
   let tags = {
      album: 'Neoxr Music',
      APIC: fs.readFileSync('./src/image/thumb.jpg')
   }
   
   client.groupAdmin = async (jid) => {
      let participant = await (await client.groupMetadata(jid)).participants
      let admin = []
      for (let i of participant)(i.admin === "admin" || i.admin === "superadmin") ? admin.push(i.id) : ''
      return admin
   }

   client.parseMention = text => [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')

   client.decodeJid = (jid) => {
      if (!jid) return jid
      return /:/i.test(jid) ? jid.split`:` [0] + '@s.whatsapp.net' : jid
   }

   client.downloadMedia = (message, pathFile) => new Bluebird(async (resolve, reject) => {
      const type = Object.keys(message)[0]
      let mimeMap = {
         'imageMessage': 'image',
         'videoMessage': 'video',
         'stickerMessage': 'sticker',
         'documentMessage': 'document',
         'audioMessage': 'audio'
      }
      try {
         if (pathFile) {
            const stream = await downloadContentFromMessage(message[type], mimeMap[type])
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
            }
            await fs.promises.writeFile(pathFile, buffer)
            resolve(pathFile)
         } else {
            const stream = await downloadContentFromMessage(message[type], mimeMap[type])
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
            }
            resolve(buffer)
         }
      } catch (e) {
         reject(e)
      }
   })
   
   client.generateMessage = async (jid, message, quoted = {}, options = {}) => {
      let generate = await generateWAMessage(jid, message, quoted)
      const type = getContentType(generate.message)
      if ('contextInfo' in message) generate.message[type].contextInfo = {
         ...generate.message[type].contextInfo,
         ...message.contextInfo
      }
      if ('contextInfo' in options) generate.message[type].contextInfo = {
         ...generate.message[type].contextInfo,
         ...options.contextInfo
      }
      return await client.relayMessage(jid, generate.message, {
         messageId: generate.key.id
      }).then(() => generate)
   }

   client.sendMessageModify = async (jid, text, quoted, properties, options = {}) => {
      await client.sendPresenceUpdate('composing', jid)
      if (properties.thumbnail) {
         var {
            file
         } = await Func.getFile(properties.thumbnail)
      }
      return client.generateMessage(jid, {
         text,
         ...options,
         contextInfo: {
            mentionedJid: client.parseMention(text),
            externalAdReply: {
               title: properties.title || global.db.setting.label,
               body: properties.body || null,
               mediaType: 1,
               previewType: 0,
               showAdAttribution: properties.ads && properties.ads ? true : false,
               renderLargerThumbnail: properties.largeThumb && properties.largeThumb ? true : false,
               thumbnail: properties.thumbnail ? await Func.fetchBuffer(file) : await Func.fetchBuffer(global.db.setting.cover),
               thumbnailUrl: 'https://telegra.ph/?id=' + Func.makeId(8),
               sourceUrl: properties.url || ''
            }
         }
      }, {
         quoted
      })
   }

   client.reply = async (jid, text, quoted, options) => {
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, {
         text: text,
         mentions: client.parseMention(text),
         ...options
      }, {
         quoted
      })
   }
   
   client.sendReact = async (jid, emoticon, keys = {}) => {
      let reactionMessage = {
         react: {
            text: emoticon,
            key: keys
         }
      }
      return await client.sendMessage(jid, reactionMessage)
   }
   
   client.sendFile = async (jid, url, name, caption = '', quoted, opts, options) => {
      let {
         status,
         file,
         filename,
         mime,
         size
      } = await Func.getFile(url, name, opts && opts.referer ? opts.referer : false)
      if (!status) return client.reply(jid, global.status.error, m)
      client.refreshMediaConn(false)
      if (opts && opts.document) {
         await client.sendPresenceUpdate('composing', jid)
         const process = await Func.metaAudio(file, {
            title: filename.replace(new RegExp('.mp3', 'i'), ''),
            ...tags,
            APIC: opts && opts.APIC ? opts.APIC : tags.APIC
         })
         return client.sendMessage(jid, {
            document: {
               url: process.file
            },
            fileName: filename,
            mimetype: mime,
            ...options
         }, {
            quoted
         }).then(() => fs.unlinkSync(file))
      } else {
         if (/image\/(jpe?g|png)/.test(mime)) {
            await client.sendPresenceUpdate('composing', jid)
            return client.sendMessage(jid, {
               image: {
                  url: file
               },
               caption: caption,
               mentions: client.parseMention(caption),
               ...options
            }, {
               quoted
            }).then(() => fs.unlinkSync(file))
         } else if (/video/.test(mime)) {
            await client.sendPresenceUpdate('composing', jid)
            return client.sendMessage(jid, {
               video: {
                  url: file
               },
               caption: caption,
               gifPlayback: opts && opts.gif ? true : false,
               mentions: client.parseMention(caption),
               ...options
            }, {
               quoted
            }).then(() => fs.unlinkSync(file))
         } else if (/audio/.test(mime)) {
            await client.sendPresenceUpdate(opts && opts.ptt ? 'recoding' : 'composing', jid)
            const process = await Func.metaAudio(file, {
               title: filename.replace(new RegExp('.mp3', 'i'), ''),
               ...tags,
               APIC: opts && opts.APIC ? opts.APIC : tags.APIC
            })
            return client.sendMessage(jid, {
               audio: {
                  url: process.file
               },
               ptt: opts && opts.ptt ? true : false,
               mimetype: mime,
               mentions: client.parseMention(caption),
               ...options
            }, {
               upload: client.waUploadToServer
            }).then(() => fs.unlinkSync(file))
         } else {
            await client.sendPresenceUpdate('composing', jid)
            return client.sendMessage(jid, {
               document: {
                  url: file
               },
               fileName: filename,
               mimetype: mime,
               ...options
            }, {
               quoted
            }).then(() => fs.unlinkSync(file))
         }
      }
   }
   
   client.sendButton = async (jid, source, text, footer, quoted, buttons = [], type) => {
      let {
         file,
         mime
      } = await Func.getFile(source)
      let options = (type && type.location) ? {
         location: {
            jpegThumbnail: await Func.fetchBuffer(source)
         },
         headerType: 6
      } : /video/.test(mime) ? {
         video: {
            url: file
         },
         headerType: 5
      } : /image/.test(mime) ? {
         image: {
            url: file
         },
         headerType: 4
      } : {
         document: {
            url: file
         },
         headerType: 3
      }
      let buttonMessage = {
         caption: text,
         footerText: footer,
         buttons: buttons,
         ...options,
         mentions: client.parseMention(text)
      }
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, buttonMessage, {
         quoted
      })
   }
   
   client.sendList = async (jid, title, text, footer, btnText, sections = [], quoted) => {
      let listMessage = {
         title: title,
         text: text,
         footer: footer,
         buttonText: btnText,
         sections,
         mentions: client.parseMention(text)
      }
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, listMessage, {
         quoted
      })
   }

   return client
}

const Serialize = (m, client) => {
   if (m.key) {
      m.id = m.key.id
      m.isSelf = m.key.fromMe
      m.chat = m.key.remoteJid
      m.sender = m.isSelf ? (client.type === 'legacy' ? client.state.legacy.user.id : (client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.id)) :
         ((m.key.participant?.includes(':') ? m.key.participant?.split(':')[0] + '@s.whatsapp.net' : m.key.participant) || (m.key.remoteJid?.includes(':') ? m.key.remoteJid?.split(':')[0] + '@s.whatsapp.net' : m.key.remoteJid))
      m.isGroup = m.chat.endsWith('@g.us')
      m.isPrivate = m.chat.endsWith('@s.whatsapp.net')
   }
   if (m.message) {
      m.type = getContentType(m.message)
      if (m.type === 'ephemeralMessage') {
         m.message = m.message[m.type].message
         const tipe = Object.keys(m.message)[0]
         m.type = tipe
         if (tipe === 'viewOnceMessage') {
            m.message = m.message[m.type].message
            m.type = getContentType(m.message)
         }
      }
      if (m.type === 'viewOnceMessage') {
         m.message = m.message[m.type].message
         m.type = getContentType(m.message)
      }

      m.mentions = m.message[m.type]?.contextInfo ? m.message[m.type]?.contextInfo.mentionedJid : []
      try {
         const quoted = m.message[m.type]?.contextInfo
         if (quoted.quotedMessage['ephemeralMessage']) {
            const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0]
            if (tipe === 'viewOnceMessage') {
               m.quoted = {
                  type: 'view_once',
                  stanzaId: quoted.stanzaId,
                  participant: quoted.participant.includes(':') ? quoted.participant.split(':')[0] + '@s.whatsapp.net' : quoted.participant,
                  message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message
               }
            } else {
               m.quoted = {
                  type: 'ephemeral',
                  stanzaId: quoted.stanzaId,
                  participant: quoted.participant.includes(':') ? quoted.participant.split(':')[0] + '@s.whatsapp.net' : quoted.participant,
                  message: quoted.quotedMessage.ephemeralMessage.message
               }
            }
         } else if (quoted.quotedMessage['viewOnceMessage']) {
            m.quoted = {
               type: 'view_once',
               stanzaId: quoted.stanzaId,
               participant: quoted.participant.includes(':') ? quoted.participant.split(':')[0] + '@s.whatsapp.net' : quoted.participant,
               message: quoted.quotedMessage.viewOnceMessage.message
            }
         } else {
            m.quoted = {
               type: 'normal',
               stanzaId: quoted.stanzaId,
               participant: quoted.participant.includes(':') ? quoted.participant.split(':')[0] + '@s.whatsapp.net' : quoted.participant,
               message: quoted.quotedMessage
            }
         }
         m.quoted.isSelf = m.quoted.participant === (client.type === 'legacy' ? client.state.legacy.user.id : (client.user.id && client.user.id.split(':')[0] + '@s.whatsapp.net'))
         m.quoted.mtype = Object.keys(m.quoted.message).filter(v => v.includes('Message') || v.includes('conversation'))[0]
         m.quoted.text =
            m.quoted.message[m.quoted.mtype]?.text || m.quoted.message[m.quoted.mtype]?.description ||
            m.quoted.message[m.quoted.mtype]?.caption || m.quoted.message[m.quoted.mtype]?.hydratedTemplate?.hydratedContentText ||
            m.quoted.message[m.quoted.mtype] || ''
         m.quoted.key = {
            id: m.quoted.stanzaId,
            fromMe: m.quoted.isSelf,
            remoteJid: m.chat
         }
         m.quoted.sender = m.quoted.participant
         m.quoted.delete = () => client.sendMessage(m.chat, {
            delete: m.quoted.key
         })
         m.quoted.download = (pathFile) => client.downloadMedia(m.quoted.message, pathFile)
      } catch {
         m.quoted = null
      }
      m.text = m.body = m.message?.conversation || m.message?.[m.type]?.text || m.message?.[m.type]?.caption || (m.type === 'listResponseMessage') && m.message?.[m.type]?.singleSelectReply?.selectedRowId ||
         (m.type === 'buttonsResponseMessage' && m.message?.[m.type]?.selectedButtonId || (m.type === 'templateButtonReplyMessage') && m.message?.[m.type]?.selectedId || ''
      m.reply = (text) => client.sendMessage(m.chat, {
         text
      }, {
         quoted: m
      })
      m.replyAd = (txt, title, body = '') => client.sendMessage(m.chat, {
         text: txt,
         contextInfo: {
            externalAdReply: {
               title: title,
               body: body,
               previewType: 'PHOTO',
               thumbnailUrl: 'https://img.freepik.com/free-vector/laptop-with-program-code-isometric-icon-software-development-programming-applications-dark-neon_39422-971.jpg?t=st=1650126483~exp=1650127083~hmac=4655d51ed454e422d55d87d9eab7ff1af10f5f2a02f575305305c2364f3598c8&w=740',
               sourceUrl: '',
               showAdAttribution: true
            }
         }
      }, {
         quoted: m
      })
      m.download = (pathFile) => client.downloadMedia(m.message, pathFile)
   }
   return m
}

Scandir = async (dir) => {
   let subdirs = await readdir(dir)
   let files = await Promise.all(subdirs.map(async (subdir) => {
      let res = resolve(dir, subdir)
      return (await stat(res)).isDirectory() ? Scandir(res) : res
   }))
   return files.reduce((a, f) => a.concat(f), [])
}

exports.Socket = Socket
exports.Serialize = Serialize
exports.Scandir = Scandir