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
const kanallar = require("../../../../Settings/channel")
const role = require("../../../../Settings/roles")
const tarihim = new Date()

module.exports.execute = async (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })
    let reason = args.slice(1).join(' ') || "Belirtilmedi"
    if (message.author.id == member.id) return message.react(client.emoji("red")).catch(() => { })
    let aktifceza = await Cezalar.findOne({ _id: member.id })
    let chatmutes = await ChatMute.findOne({ _id: member.id })
    let voicemutes = await VoiceMute.findOne({ _id: member.id })

    if (!aktifceza) return message.reply("ceza geçmişi yok")
    if (aktifceza) {
        let chat = aktifceza.aktifcezalar.filter(a => a.type == "Chat Mute" && a.enabled).map(a => a)
        let voice = aktifceza.aktifcezalar.filter(a => a.type == "Voice Mute" && a.enabled).map(a => a)
        let cembed = new MessageEmbed().setColor("#d18100")
        const filter = (reaction, user) => { return ['🗯️', '🎙️'].includes(reaction.emoji.name) && user.id === message.author.id; };
        if (chat.length) message.react("🗯️").catch(() => { });
        if (voice.length) message.react("🎙️").catch(() => { })
        message.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
            .then(async (collected) => {
                const reaction = collected.first();
                if (reaction.emoji.name == "🗯️") {
                    client.channel("cmutedLOG").send(cembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) kullanıcısının **Metin kanallarında ki** cezası kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `))
                    message.react(client.emoji("okey")).catch(() => { });
                    await ChatMute.deleteOne({ _id: member.id })
                    await Cezalar.updateOne({ _id: member.id }, { $pull: { aktifcezalar: { type: "Chat Mute" } } })
                    let a = client.randomCeza()
                    await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "UnChat Mute", auth: message.author.id, basla: Date.now(), reason: reason }, { upsert: true })
                    if (role.chatMuted) member.roles.remove(role.chatMuted).catch(() => { })
                }
                if (reaction.emoji.name == "🎙️") {
                    client.channel("vmutedLOG").send(cembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) kullanıcısının **Ses kanallarında ki** cezası kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `))
                    message.react(client.emoji("okey")).catch(() => { });
                    await VoiceMute.deleteOne({ _id: member.id })
                    await Cezalar.updateOne({ _id: member.id }, { $pull: { aktifcezalar: { type: "Voice Mute" } } })
                    let a = client.randomCeza()
                    await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "UnVoice Mute", auth: message.author.id, basla: Date.now(), reason: reason }, { upsert: true })
                    if (role.voiceMuted) member.roles.remove(role.voiceMuted).catch(() => { })
                    if (member.voice) member.voice.setMute(false).catch(() => { })
                }
            }).catch(e => { console.log(e) })
    } else message.react(client.emoji("red")).catch(() => { });
}
exports.conf = {
    command: "unmute",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["unmute"],
    timeout: "7000",
    cmdPerms: ["cmdCiftHac", "cdmCeo", "cmdOwner"]
}
