
const guild = require("../../../../Settings/guild")
var guldowns = new Map()
const ms = require("ms")
const moment = require("moment")
moment.locale("tr")
const VoiceMute = require("../../Datebase/Moderasyon/VoiceMute")
const ChatMute = require("../../Datebase/Moderasyon/ChatMute")
const Sicil = require("../../Datebase/Moderasyon/Sicil")
const { MessageEmbed } = require("discord.js")
const Cezalar = require("../../Datebase/Moderasyon/Cezalar")
const tarihim = new Date()
module.exports.execute = async (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })
    let reason = args.slice(2).join(' ') || "Belirtilmedi"
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(client.emoji("red")).catch(() => { })
    if (message.guild.me.roles.highest.position <= member.roles.highest.position || member.hasPermission("ADMINISTRATOR")) return message.react(client.emoji("red")).catch(() => { })
    if (message.author.id == member.id) return message.react(client.emoji("red")).catch(() => { })
    let time = args[1];
    if (!time) return message.react(client.emoji("red")).catch(() => { })

    let bittik = moment(Date.now()).format("LLL")
    let cezabitis = moment(Date.now() + ms(time)).format("LLL")

    let tarih = tarihim.toLocaleDateString("tr"); let saat = tarihim.toLocaleTimeString("tr");

    const filter = (reaction, user) => { return ['🗯️', '🎙️'].includes(reaction.emoji.name) && user.id === message.author.id; };
    message.react("🗯️").catch(() => { }); message.react("🎙️").catch(() => { })
    message.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
        .then(async (collected) => {
            const reaction = collected.first();
            if (reaction.emoji.name == "🗯️") {
                let chatembed = new MessageEmbed().setColor("#ff0000")
                let a = client.randomCeza()
                await ChatMute.findOneAndUpdate({ _id: member.id }, { $set: { chatmute: true, reason: reason, date: Date.now() + ms(time), cno: a } }, { upsert: true })
                await Sicil.findOneAndUpdate({ cno: a}, { member: member.id, type: "Chat Mute", auth: message.author.id, basla: Date.now(), bitis: Date.now() + ms(time), reason: reason, cno: a }, { upsert: true })
                await member.roles.add(client.role("chatMuted")).catch(() => { })
                message.reactions.cache.find(r => r.emoji.name === "🎙️").remove().catch(() => { })
                client.channel("cmutedLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı \`Metin kanallarında\` susturuldu! \n\` • \`  Susturan : ${message.member} (\`${message.member.id}\`)
               \` • \` Sebep : \`${reason}\`
               \` • \` Susturulma Tarihi : \`${bittik}\`
               \` • \` Susturulmanın Bitiş Tarihi : \`${cezabitis}\`
               `).setFooter(`Ceza Numarası: ${a}`))
            }
            if (reaction.emoji.name == "🎙️") {
                let chatembed = new MessageEmbed().setColor("#ff0000")
                let a = client.randomCeza()
                await VoiceMute.findOneAndUpdate({ _id: member.id }, { $set: { voicemute: true, reason: reason, date: Date.now() + ms(time), cno: a } }, { upsert: true })
                await Sicil.findOneAndUpdate({  cno: a }, { member: member.id, type: "Voice Mute", auth: message.author.id, basla: Date.now(), bitis: Date.now() + ms(time), reason: reason, cno: a  }, { upsert: true })
                await member.roles.add(client.role("voiceMuted")).catch(() => { })
                if (member.voice.channel) member.voice.setMute(true).catch();
                client.channel("vmutedLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı \`Ses kanallarında\` susturuldu! \n\` • \`  Susturan : ${message.member} (\`${message.member.id}\`)
               \` • \` Sebep : \`${reason}\`
               \` • \` Susturulma Tarihi : \`${bittik}\`
               \` • \` Susturulmanın Bitiş Tarihi : \`${cezabitis}\`
               `).setFooter(`Ceza Numarası: ${a}`))
                message.reactions.cache.find(r => r.emoji.name === "🗯️").remove().catch(() => { })
            }
        }).catch(async (collected) => {
            await message.react(client.emoji("red")).catch(() => { })
            message.reactions.cache.find(r => r.emoji.name === "🗯️").remove().catch(() => { })
            message.reactions.cache.find(r => r.emoji.name === "🎙️").remove().catch(() => { })
        });

}
exports.conf = {
    command: "mute",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["mute"],
    timeout: "7000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner","cmdMute"]
}


// _id: String,
// chatmute: Boolean,
// reason: String,
// date: Number

// _id: String,
// cno: Number,
// sicil: Array
