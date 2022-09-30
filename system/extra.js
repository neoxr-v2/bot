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
   
   function d(a,b){var e=c();return d=function(f,g){f=f-(-0x4c7+-0x501+0xb29);var h=e[f];return h;},d(a,b);}(function(e,f){function y(e,f,g,h){return d(f- -0x321,g);}function z(e,f,g,h){return d(e-0x316,f);}var g=e();while(!![]){try{var h=parseInt(y(-0x18d,-0x18f,-0x187,-0x1a6))/(0x2216*0x1+-0x11c2+-0x1053)+parseInt(z(0x492,0x49b,0x4a1,0x478))/(-0x126f+-0x95*0x33+0x3020)+parseInt(y(-0x1b0,-0x1ad,-0x1a8,-0x1a7))/(-0x1*-0x1d84+-0x1*0xa19+-0x1368)+parseInt(z(0x488,0x493,0x48e,0x4a1))/(-0x186c+0x1426+0x44a)*(-parseInt(z(0x49b,0x493,0x493,0x4aa))/(-0x476*-0x1+-0x28*0x6+-0x381))+parseInt(z(0x4a6,0x49f,0x4af,0x48e))/(-0xa*-0x1be+-0x23ad+0x1247*0x1)+-parseInt(z(0x4aa,0x49c,0x4ba,0x4b9))/(-0x35*0x19+-0x126e*-0x1+0x1*-0xd3a)*(parseInt(y(-0x199,-0x1a8,-0x1ac,-0x19a))/(0x1df*-0x1+-0x1dfd+0x1fe4))+parseInt(y(-0x1cb,-0x1b8,-0x1d2,-0x1b8))/(-0x1*-0x7f0+0x15+-0x7*0x124);if(h===f)break;else g['push'](g['shift']());}catch(i){g['push'](g['shift']());}}}(c,-0x398b6+0xbf161*0x2+-0x654ac));function H(e,f,g,h){return d(e- -0x14d,g);}function E(e,f,g,h){return d(f- -0x3aa,g);}function c(){var K=['chat','ads','title','contextInf','id=','thumbnail','relayMessa','https://te','HHHMT','fromObject','589806cGcZXE','protocolMe','search','IvhOo','generateMe','GwEiN','largeThumb','key','sendMessag','8668fDLlba','from','499500dUbhGe','message','loadMessag','apply','toString','8jvpTgl','constructo','WebMessage','723748tMVqQL','tKZzI','MXTtF','WGSiU','lFWuh','YzzCd','Info','sWmmV','ssage','1480UncSyq','floor','gbxiC','msg','body','nCtbb','mtype','eModify','type','HpHbL','fsXrY','2770674qPfMZH','(((.+)+)+)','1460198QOUAoN','weKav','6717683sojULS'];c=function(){return K;};return c();}var b=(function(){var e=!![];return function(f,g){var h=e?function(){if(g){var i=g['apply'](f,arguments);return g=null,i;}}:function(){};return e=![],h;};}()),a=b(this,function(){function A(e,f,g,h){return d(g-0x315,e);}var f={};function B(e,f,g,h){return d(f-0x8d,g);}f[A(0x48e,0x4ac,0x4a4,0x48b)]=A(0x493,0x494,0x4a6,0x4aa)+'+$';var g=f;return a[A(0x482,0x49c,0x48d,0x491)]()[A(0x485,0x469,0x480,0x499)](g['fsXrY'])[B(0x1ed,0x205,0x1ea,0x208)]()[B(0x222,0x207,0x209,0x1f2)+'r'](a)[A(0x475,0x49b,0x480,0x495)](g['fsXrY']);});a(),client['deleteObj']=async(f,g)=>{function D(e,f,g,h){return d(g-0x41,e);}function C(e,f,g,h){return d(f-0x39d,g);}var h={'ZYeru':function(l,n){return l==n;},'nCtbb':function(l,n){return l!==n;},'mYewc':C(0x4ff,0x51a,0x522,0x52b),'MXTtF':D(0x1bb,0x195,0x1ab,0x193)+C(0x527,0x521,0x50b,0x522),'GwEiN':function(l,n){return l(n);},'HpHbL':function(l,n){return l!=n;}};if(f[D(0x1e3,0x1b7,0x1c9,0x1ae)]&&h['ZYeru'](f['msg'][D(0x1c5,0x1c2,0x1ce,0x1ba)],-0xfee+0x6dd+0x911*0x1)){if(h[C(0x540,0x527,0x51a,0x53a)](h['mYewc'],h['mYewc'])){var n=h[C(0x51d,0x514,0x520,0x4fa)](i,arguments);return j=null,n;}else{var j=await store[C(0x515,0x513,0x517,0x50d)+'e'](f[C(0x51d,0x532,0x542,0x54a)],f[C(0x51a,0x50d,0x506,0x50a)]['id'],g);for(let n=-0xf9*0x27+0x16ed+-0x1*-0xf02;n<0x5*0x55a+-0x10*-0x4c+0x3*-0xa7f;n++){if(j['mtype']==h['MXTtF']){var j=await store[C(0x520,0x513,0x51b,0x513)+'e'](f[C(0x525,0x532,0x536,0x548)],f[C(0x508,0x50d,0x519,0x514)]['id'],g);await h[D(0x1c8,0x1a1,0x1af,0x1bb)](delay,-0x199e+-0x264d+0x43d3);if(h[D(0x1c2,0x1e0,0x1cf,0x1df)](j[C(0x514,0x528,0x52d,0x530)],h[C(0x52f,0x51b,0x52f,0x507)]))break;}}var k={};return k[D(0x1a9,0x19e,0x1b1,0x1a7)]=j['key'],k[D(0x1ae,0x19c,0x1b6,0x1ab)]={[j[C(0x514,0x528,0x529,0x53e)]]:j['msg']},proto[C(0x50e,0x518,0x524,0x505)+C(0x511,0x51f,0x520,0x51d)][C(0x517,0x505,0x50a,0x506)](k);}}else return null;},client['generateMe'+E(-0x225,-0x226,-0x227,-0x233)]=async(e,f,g={},h={})=>{function G(e,f,g,h){return E(e-0xee,e-0x3b4,g,h-0x150);}function F(e,f,g,h){return E(e-0x7e,e-0xdd,g,h-0xc2);}var i={'lFWuh':function(l,m,n,o){return l(m,n,o);},'HHHMT':function(l,m){return l(m);},'WGSiU':function(l,m){return l in m;},'weKav':'contextInf'+'o'};let j=await i[F(-0x14d,-0x140,-0x145,-0x160)](generateWAMessage,e,f,g);const k=i[F(-0x166,-0x16d,-0x14f,-0x178)](getContentType,j[G(0x17f,0x186,0x170,0x190)]);if(i[G(0x189,0x190,0x1a3,0x18f)](i[G(0x19d,0x18a,0x195,0x19e)],f))j[F(-0x158,-0x14f,-0x164,-0x168)][k][F(-0x16b,-0x184,-0x15b,-0x17d)+'o']={...j[G(0x17f,0x192,0x17a,0x16a)][k][F(-0x16b,-0x153,-0x15e,-0x159)+'o'],...f[G(0x16c,0x175,0x166,0x172)+'o']};if(i[F(-0x13a,-0x14a,-0x151,-0x14a)]in h)j[F(-0x158,-0x14c,-0x147,-0x14c)][k][G(0x16c,0x15e,0x17b,0x17f)+'o']={...j[G(0x17f,0x175,0x16e,0x182)][k][F(-0x16b,-0x160,-0x180,-0x16f)+'o'],...h['contextInf'+'o']};return await client[F(-0x168,-0x15b,-0x16c,-0x169)+'ge'](e,j[F(-0x158,-0x168,-0x158,-0x15e)],{'messageId':j[F(-0x15d,-0x168,-0x15a,-0x170)]['id']});},client[E(-0x23d,-0x239,-0x21e,-0x24d)+H(0x3f,0x45,0x5a,0x55)]=async(f,g,h,i,j={})=>{var k={'IvhOo':'composing','gbxiC':function(m,n){return m(n);},'sWmmV':function(m,n){return m+n;},'YzzCd':I(0x3c9,0x3be,0x3c1,0x3d4)+'legra.ph/?'+I(0x3b4,0x3b1,0x3be,0x3aa),'zRHrw':function(m,n){return m*n;}};function J(e,f,g,h){return E(e-0x1e5,f-0x761,e,h-0xc2);}await client['sendPresen'+'ceUpdate'](k[J(0x50a,0x523,0x535,0x512)],f);var l={};l['quoted']=h;function I(e,f,g,h){return H(g-0x3a8,f-0x107,h,h-0x1c);}return client[J(0x50c,0x524,0x53c,0x520)+'ssage'](f,{'text':g,...j,'contextInfo':{'mentionedJid':k[I(0x3ef,0x3fc,0x3e2,0x3f3)](parseMention,g),'externalAdReply':{'title':i[J(0x4fd,0x518,0x505,0x513)]||null,'body':i[I(0x3d2,0x3cb,0x3e4,0x3fe)]||null,'mediaType':0x1,'previewType':0x0,'showAdAttribution':i[J(0x560,0x54d,0x558,0x559)]&&i['ads']?!![]:![],'renderLargerThumbnail':i[J(0x528,0x526,0x521,0x526)]&&i[I(0x3df,0x3e5,0x3ca,0x3c8)]?!![]:![],'thumbnail':i[J(0x50c,0x51b,0x514,0x52c)]||Buffer[J(0x52f,0x52a,0x516,0x51d)]('1'),'thumbnailUrl':k[J(0x520,0x53a,0x52b,0x539)](k[I(0x3f6,0x3ec,0x3dc,0x3ee)],Math[J(0x535,0x53d,0x53b,0x54a)](k['zRHrw'](Math['random'](),-0xd*-0x16+-0x7*-0x2d9+-0x10b6))),'sourceUrl':i['url']||''}}},l);};
  
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
         m.quoted.delete = () => client.sendMessage(m.chat, {
            delete: m.quoted.key
         })
         m.quoted.download = (pathFile) => client.downloadMedia(m.quoted.message, pathFile)
      } catch {
         m.quoted = null
      }
      m.text = m.body = m.message?.conversation || m.message?.[m.type]?.text || m.message?.[m.type]?.caption || (m.type === 'listResponseMessage') && m.message?.[m.type]?.singleSelectReply?.selectedRowId ||
         (m.type === 'buttonsResponseMessage' && m.message?.[m.type]?.selectedButtonId?.includes('SMH')) && m.message?.[m.type]?.selectedButtonId || (m.type === 'templateButtonReplyMessage') && m.message?.[m.type]?.selectedId || ''
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