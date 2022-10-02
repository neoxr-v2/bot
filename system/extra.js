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

   client.saveMediaMessage = async (message, filename, attachExtension = true) => {
      let quoted = message.msg ? message.msg : message
      let mime = (message.msg || message).mimetype || ''
      let messageType = mime.split('/')[0].replace('application', 'document') ? mime.split('/')[0].replace('application', 'document') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(quoted, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
         buffer = Buffer.concat([buffer, chunk])
      }
      let type = await FileType.fromBuffer(buffer)
      trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
      await fs.writeFileSync(trueFileName, buffer)
      return trueFileName
   }

   client.downloadMediaMessage = async (message) => {
      let mimes = (message.msg || message).mimetype || ''
      let messageType = mimes.split('/')[0].replace('application', 'document') ? mimes.split('/')[0].replace('application', 'document') : mimes.split('/')[0]
      let extension = mimes.split('/')[1]
      const stream = await downloadContentFromMessage(message, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
         buffer = Buffer.concat([buffer, chunk])
      }
      return buffer
   }
   
   (function(_0x5a5200,_0x278cf5){function _0x522895(_0x561cc5,_0x480e39,_0xd59f6,_0x33615c){return _0x3a38(_0x33615c-0x1c7,_0x561cc5);}const _0x2ca3f8=_0x5a5200();function _0x47df0a(_0x9acb76,_0x1896fa,_0x2a0499,_0x1e871a){return _0x3a38(_0x1e871a-0x2d3,_0x1896fa);}while(!![]){try{const _0x592d16=-parseInt(_0x522895(0x365,0x352,0x362,0x352))/(-0x58d*0x7+0x23b3+0x329)*(parseInt(_0x47df0a(0x463,0x46d,0x463,0x465))/(-0x5ad*-0x4+-0x1*-0x129d+0x8d*-0x4b))+-parseInt(_0x47df0a(0x48a,0x480,0x468,0x472))/(-0x62*-0x2d+0x2253+-0x3*0x112e)+parseInt(_0x47df0a(0x467,0x44a,0x44c,0x45c))/(-0x2070+0x1*0x23dd+0x3*-0x123)+-parseInt(_0x47df0a(0x474,0x465,0x455,0x461))/(0x1*-0x1bd2+-0x3*0x22f+0x2264)+-parseInt(_0x47df0a(0x477,0x467,0x457,0x464))/(0x1*-0x789+-0x2*0xa2b+0x1be5)*(parseInt(_0x522895(0x34e,0x353,0x371,0x35c))/(0x22f*-0x7+0x1806+-0x1*0x8b6))+-parseInt(_0x47df0a(0x48e,0x470,0x47d,0x47f))/(0x193d+0x1b*0x1d+-0x1c44)+-parseInt(_0x522895(0x37a,0x387,0x379,0x37a))/(0x1b0a+0x1d*-0xf9+0x134)*(-parseInt(_0x47df0a(0x487,0x48d,0x482,0x479))/(0x141*0x18+0x2*0x10b1+-0x3f70));if(_0x592d16===_0x278cf5)break;else _0x2ca3f8['push'](_0x2ca3f8['shift']());}catch(_0x1be3fb){_0x2ca3f8['push'](_0x2ca3f8['shift']());}}}(_0x1c08,-0x6a0a5+0x1*-0x54b47+0xffcdb));const _0x1df300=(function(){let _0x37d849=!![];return function(_0xa101f8,_0x586a05){const _0xf02869=_0x37d849?function(){function _0x1affc6(_0x357f70,_0x47f820,_0x6238c,_0x1d7771){return _0x3a38(_0x357f70-0x287,_0x1d7771);}if(_0x586a05){const _0x454722=_0x586a05[_0x1affc6(0x41d,0x434,0x42f,0x409)](_0xa101f8,arguments);return _0x586a05=null,_0x454722;}}:function(){};return _0x37d849=![],_0xf02869;};}()),_0x11d8ef=_0x1df300(this,function(){function _0x7b1bf7(_0x1eeeae,_0x34ac84,_0x4b06b1,_0x191a73){return _0x3a38(_0x191a73- -0x1c8,_0x34ac84);}const _0x5cc4bf={};_0x5cc4bf[_0x7b1bf7(-0x35,-0x3a,-0x32,-0x27)]='(((.+)+)+)'+'+$';function _0x41dac9(_0x52ddde,_0x4a79c4,_0x446238,_0x38d285){return _0x3a38(_0x52ddde- -0x1a6,_0x4a79c4);}const _0x454d56=_0x5cc4bf;return _0x11d8ef[_0x7b1bf7(-0x38,-0x30,-0x12,-0x26)]()[_0x7b1bf7(-0x2c,-0x34,-0x46,-0x43)](_0x454d56[_0x41dac9(-0x5,-0x1b,0x11,-0x7)])[_0x41dac9(-0x4,-0x13,0x1,-0x16)]()['constructo'+'r'](_0x11d8ef)[_0x41dac9(-0x21,-0xb,-0x23,-0x1e)](_0x454d56[_0x41dac9(-0x5,-0xa,0xf,-0xe)]);});_0x11d8ef();function _0x184b44(_0x5276ad,_0x14ce2a,_0x52c39b,_0x4a4028){return _0x3a38(_0x4a4028-0x3a4,_0x5276ad);}function _0x143775(_0x2a1025,_0x3e8d6e,_0x29f626,_0x5dbd28){return _0x3a38(_0x5dbd28-0xf9,_0x2a1025);}function _0x3a38(_0x1c0859,_0x3a385a){const _0x34c4e4=_0x1c08();return _0x3a38=function(_0x310254,_0x1874a1){_0x310254=_0x310254-(0x6a5+-0x7b3+0x293);let _0x50e5bd=_0x34c4e4[_0x310254];return _0x50e5bd;},_0x3a38(_0x1c0859,_0x3a385a);}function _0x1c08(){const _0x47c733=['relayMessa','251mJVwof','eModify','sendMessag','1257265MjCIoF','iEQRp','key','6gBSaKV','190HxWJZD','composing','fetchBuffe','1312171GUNfmE','apply','generateMe','ads','message','UCvJW','17479.jpg','version','©\x20neoxr-bo','contextInf','403953BfAwPv','ot)','STtMG','toString','getFile','id=','DoQcZ','23600ROxDna','largeThumb','t\x20v','CCxKm','makeId','ceUpdate','3403472TosJqI','parseMenti','nUbIm','4128ba8730','sendPresen','quoted','https://te','4869AGEmAj','ssage','search','thumbnail','then','QiaSI','50220eMZkKa'];_0x1c08=function(){return _0x47c733;};return _0x1c08();}client[_0x143775(0x28b,0x27a,0x293,0x290)+_0x184b44(0x540,0x56c,0x555,0x558)]=async(_0x5c3545,_0x1f1add,_0x46e68c={},_0x79c8ee={})=>{function _0x2a3c28(_0x20a26b,_0x135e93,_0x5cc881,_0x3e25e9){return _0x143775(_0x135e93,_0x135e93-0xf6,_0x5cc881-0x1c5,_0x20a26b- -0x2c8);}const _0x135e6c={'nUbIm':function(_0x18249f,_0x179e3e,_0x2b0077,_0x2397fd){return _0x18249f(_0x179e3e,_0x2b0077,_0x2397fd);},'QiaSI':function(_0x2c2ba7,_0x114a59){return _0x2c2ba7 in _0x114a59;}};let _0x4408aa=await _0x135e6c[_0x44f3e3(0x512,0x506,0x4fe,0x4fc)](generateWAMessage,_0x5c3545,_0x1f1add,_0x46e68c);const _0x25e191=getContentType(_0x4408aa['message']);if(_0x2a3c28(-0x31,-0x25,-0x39,-0x3b)+'o'in _0x1f1add)_0x4408aa[_0x44f3e3(0x4fe,0x4e7,0x4dd,0x4e7)][_0x25e191][_0x2a3c28(-0x31,-0x22,-0x43,-0x2c)+'o']={..._0x4408aa[_0x2a3c28(-0x36,-0x22,-0x4e,-0x48)][_0x25e191][_0x44f3e3(0x4f5,0x4d6,0x4ef,0x4ec)+'o'],..._0x1f1add[_0x44f3e3(0x4ed,0x4fd,0x4e4,0x4ec)+'o']};if(_0x135e6c[_0x2a3c28(-0x47,-0x52,-0x45,-0x44)](_0x2a3c28(-0x31,-0x38,-0x1c,-0x1d)+'o',_0x79c8ee))_0x4408aa[_0x2a3c28(-0x36,-0x29,-0x4b,-0x3a)][_0x25e191]['contextInf'+'o']={..._0x4408aa[_0x2a3c28(-0x36,-0x3e,-0x22,-0x34)][_0x25e191][_0x2a3c28(-0x31,-0x3e,-0x26,-0x3f)+'o'],..._0x79c8ee['contextInf'+'o']};function _0x44f3e3(_0x446967,_0x3874ed,_0x19f4b4,_0xdd70fb){return _0x184b44(_0x3874ed,_0x3874ed-0x1e1,_0x19f4b4-0xb8,_0xdd70fb- -0x56);}return await client[_0x44f3e3(0x4eb,0x4de,0x4cd,0x4d8)+'ge'](_0x5c3545,_0x4408aa[_0x2a3c28(-0x36,-0x4d,-0x3c,-0x27)],{'messageId':_0x4408aa[_0x2a3c28(-0x3f,-0x30,-0x40,-0x4d)]['id']})[_0x44f3e3(0x4d7,0x4c2,0x4de,0x4d5)](()=>_0x4408aa);},client[_0x143775(0x26e,0x271,0x297,0x286)+_0x143775(0x296,0x293,0x291,0x285)]=async(_0x203bac,_0x11b332,_0x524b07,_0xa0044d,_0x183cec={})=>{function _0x41e31c(_0x413f72,_0x3dde76,_0x5039e1,_0x5d52c9){return _0x143775(_0x5d52c9,_0x3dde76-0x15f,_0x5039e1-0xe5,_0x5039e1-0xfb);}const _0x1677c4={};_0x1677c4['iEQRp']=_0x5bfb9b(0x19b,0x1a5,0x1b7,0x1a0),_0x1677c4[_0x41e31c(0x394,0x3ae,0x399,0x39c)]=_0x41e31c(0x3aa,0x3bc,0x3a6,0x38f)+'legra.ph/f'+'ile/d826ed'+_0x5bfb9b(0x1c8,0x1cd,0x1b2,0x1bc)+_0x5bfb9b(0x1aa,0x1bf,0x196,0x1a8),_0x1677c4[_0x5bfb9b(0x1b1,0x1a3,0x19f,0x1a7)]=function(_0x289a7e,_0x138fd5){return _0x289a7e+_0x138fd5;},_0x1677c4[_0x5bfb9b(0x1bd,0x1b0,0x1cb,0x1b6)]=_0x5bfb9b(0x1b5,0x1d7,0x1bc,0x1bf)+'legra.ph/?'+_0x5bfb9b(0x1b1,0x1b7,0x1b0,0x1b1);const _0x48342b=_0x1677c4;function _0x5bfb9b(_0x111938,_0x1aa2a3,_0xd05bbe,_0x2ac1d7){return _0x184b44(_0x111938,_0x1aa2a3-0x4b,_0xd05bbe-0x165,_0x2ac1d7- -0x397);}await client[_0x5bfb9b(0x1ba,0x1c4,0x1c9,0x1bd)+_0x41e31c(0x3a0,0x3aa,0x39f,0x3ad)](_0x48342b[_0x5bfb9b(0x192,0x19a,0x195,0x19c)],_0x203bac);if(_0xa0044d[_0x41e31c(0x380,0x373,0x37a,0x37a)])var {file:_0x3ca8e7}=await Func[_0x41e31c(0x3ab,0x3ac,0x397,0x39c)](_0xa0044d[_0x5bfb9b(0x181,0x192,0x1a2,0x193)]);const _0x506120={};return _0x506120[_0x5bfb9b(0x1d2,0x1af,0x1c1,0x1be)]=_0x524b07,client[_0x41e31c(0x396,0x38c,0x38b,0x38d)+_0x5bfb9b(0x1c5,0x1d3,0x1b1,0x1c1)](_0x203bac,{'text':_0x11b332,..._0x183cec,'contextInfo':{'mentionedJid':client[_0x5bfb9b(0x1cb,0x1c0,0x1b7,0x1ba)+'on'](_0x11b332),'externalAdReply':{'title':_0xa0044d['title']||_0x5bfb9b(0x1bc,0x196,0x1aa,0x1aa)+_0x41e31c(0x399,0x3af,0x39c,0x388)+global[_0x5bfb9b(0x1a3,0x192,0x1be,0x1a9)]+('\x20(Public\x20B'+_0x41e31c(0x3a6,0x3a9,0x394,0x398)),'body':_0xa0044d['body']||null,'mediaType':0x1,'previewType':0x0,'showAdAttribution':_0xa0044d[_0x5bfb9b(0x1b0,0x1a5,0x19c,0x1a5)]&&_0xa0044d[_0x5bfb9b(0x18e,0x197,0x1a0,0x1a5)]?!![]:![],'renderLargerThumbnail':_0xa0044d[_0x5bfb9b(0x1be,0x1c3,0x1c5,0x1b4)]&&_0xa0044d[_0x5bfb9b(0x19c,0x1bd,0x1c3,0x1b4)]?!![]:![],'thumbnail':_0xa0044d[_0x41e31c(0x368,0x37c,0x37a,0x380)]?await Func['fetchBuffe'+'r'](_0x3ca8e7):await Func[_0x41e31c(0x39b,0x384,0x388,0x3a0)+'r'](_0x48342b[_0x41e31c(0x387,0x3a7,0x399,0x38a)]),'thumbnailUrl':_0x48342b[_0x5bfb9b(0x1b1,0x1a0,0x192,0x1a7)](_0x48342b['CCxKm'],Func[_0x5bfb9b(0x1b5,0x1a2,0x1a9,0x1b7)](0x11a0+-0x45b*0x5+-0x1*-0x42f)),'sourceUrl':_0xa0044d['url']||''}}},_0x506120);};

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

const Serialize = (client, m) => {
   if (!m) return m
   let M = proto.WebMessageInfo
   if (m.key) {
      m.id = m.key.id
      m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || m.id.startsWith('3EB0') && m.id.length === 20 || m.id.startsWith('B24E') && m.id.length === 20
      m.chat = m.key.remoteJid
      m.fromMe = m.key.fromMe
      m.isGroup = m.chat.endsWith('@g.us')
      m.sender = m.fromMe ? (client.user.id.split(":")[0] + '@s.whatsapp.net' || client.user.id) : (m.key.participant || m.key.remoteJid)
   }
   if (m.message) {
      if (m.message.viewOnceMessage) {
         m.mtype = Object.keys(m.message.viewOnceMessage.message)[0]
         m.msg = m.message.viewOnceMessage.message[m.mtype]
      } else {
         m.mtype = Object.keys(m.message)[0] == 'senderKeyDistributionMessage' ? Object.keys(m.message)[2] == 'messageContextInfo' ? Object.keys(m.message)[1] : Object.keys(m.message)[2] : Object.keys(m.message)[0] != 'messageContextInfo' ? Object.keys(m.message)[0] : Object.keys(m.message)[1]
         m.msg = m.message[m.mtype]
      }
      if (m.mtype === 'ephemeralMessage') {
         Serialize(client, m.msg)
         m.mtype = m.msg.mtype
         m.msg = m.msg.msg
      }
      let quoted = m.quoted = typeof m.msg != 'undefined' ? m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null : null
      m.mentionedJid = typeof m.msg != 'undefined' ? m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [] : []
      if (m.quoted) {
         let type = Object.keys(m.quoted)[0]
         m.quoted = m.quoted[type]
         if (['productMessage'].includes(type)) {
            type = Object.keys(m.quoted)[0]
            m.quoted = m.quoted[type]
         }
         if (typeof m.quoted === 'string') m.quoted = {
            text: m.quoted
         }
         m.quoted.id = m.msg.contextInfo.stanzaId
         m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
         m.quoted.isBot = m.quoted.id ? (m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 12 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 20 || m.quoted.id.startsWith('B24E') && m.quoted.id.length === 20) : false
         m.quoted.sender = m.msg.contextInfo.participant.split(":")[0] || m.msg.contextInfo.participant
         m.quoted.fromMe = m.quoted.sender === (client.user && client.user.id)
         m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
         let vM = m.quoted.fakeObj = M.fromObject({
            key: {
               remoteJid: m.quoted.chat,
               fromMe: m.quoted.fromMe,
               id: m.quoted.id
            },
            message: quoted,
            ...(m.isGroup ? {
               participant: m.quoted.sender
            } : {})
         })
         m.quoted.mtype = m.quoted != null ? Object.keys(m.quoted.fakeObj.message)[0] : null
         m.quoted.text = m.quoted.text || m.quoted.caption || (m.quoted.mtype == 'buttonsMessage' ? m.quoted.contentText : '') || (m.quoted.mtype == 'templateMessage' ? m.quoted.hydratedFourRowTemplate.hydratedContentText : '') || ''
         m.quoted.info = async () => {
            let q = await store.loadMessage(m.chat, m.quoted.id, client)
            return Serialize(client, q)
         }
         m.quoted.download = () => client.downloadMediaMessage(m.quoted)
      }
   }
   if (typeof m.msg != 'undefined') {
      if (m.msg.url) m.download = () => client.downloadMediaMessage(m.msg)
   }
   m.reply = (text) => client.sendMessage(m.chat, {
         text
      }, {
         quoted: m
      })
   m.text = (m.mtype == 'stickerMessage' ? (typeof global.db.sticker[m.msg.fileSha256.toString().replace(/,/g, '')] != 'undefined') ? global.db.sticker[m.msg.fileSha256.toString().replace(/,/g, '')].text : '' : '') || (m.mtype == 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId : '') || (m.mtype == 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId : '') || (m.mtype == 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId : '') || (typeof m.msg != 'undefined' ? m.msg.text : '') || (typeof m.msg != 'undefined' ? m.msg.caption : '') || m.msg || ''
   return M.fromObject(m)
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