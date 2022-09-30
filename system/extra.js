const {
   default: makeWASocket,
   proto,
   getContentType,
   downloadContentFromMessage
} = require('baileys')
const Bluebird = require('bluebird')
const fs = require('fs')

const Socket = (...args) => {
   let sock = makeWASocket(...args)
   Object.defineProperty(sock, 'name', {
      value: 'WASocket',
      configurable: true,
   })

   sock.parseMention = text => [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')

   sock.decodeJid = (jid) => {
      if (!jid) return jid
      return /:/i.test(jid) ? jid.split`:` [0] + '@s.whatsapp.net' : jid
   }

   sock.downloadMedia = (message, pathFile) => new Bluebird(async (resolve, reject) => {
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

   sock.reply = async (jid, text, quoted, options) => {
      await sock.sendPresenceUpdate('composing', jid)
      return sock.sendMessage(jid, {
         text: text,
         mentions: sock.parseMention(text),
         ...options
      }, {
         quoted
      })
   }

   return sock
}

const Serialize = (msg, sock) => {
   if (m.key) {
      m.id = m.key.id
      m.isSelf = m.key.fromMe
      m.chat = m.key.remoteJid
      m.sender = m.isSelf ? (sock.type === 'legacy' ? sock.state.legacy.user.id : (sock.user.id.split(':')[0] + '@s.whatsapp.net' || sock.user.id)) :
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
         m.quoted.isSelf = m.quoted.participant === (sock.type === 'legacy' ? sock.state.legacy.user.id : (sock.user.id && sock.user.id.split(':')[0] + '@s.whatsapp.net'))
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
         m.quoted.delete = () => sock.sendMessage(m.chat, {
            delete: m.quoted.key
         })
         m.quoted.download = (pathFile) => sock.downloadMedia(m.quoted.message, pathFile)
      } catch {
         m.quoted = null
      }
      m.text = m.body = m.message?.conversation || m.message?.[m.type]?.text || m.message?.[m.type]?.caption || (m.type === 'listResponseMessage') && m.message?.[m.type]?.singleSelectReply?.selectedRowId ||
         (m.type === 'buttonsResponseMessage' && m.message?.[m.type]?.selectedButtonId?.includes('SMH')) && m.message?.[m.type]?.selectedButtonId || (m.type === 'templateButtonReplyMessage') && m.message?.[m.type]?.selectedId || ''
      m.reply = (text) => sock.sendMessage(m.chat, {
         text
      }, {
         quoted: msg
      })
      m.replyAd = (txt, title, body = '') => sock.sendMessage(m.chat, {
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
         quoted: msg
      })
      m.download = (pathFile) => sock.downloadMedia(m.message, pathFile)
   }
   return msg
}

exports.Socket = Socket
exports.Serialize = Serialize