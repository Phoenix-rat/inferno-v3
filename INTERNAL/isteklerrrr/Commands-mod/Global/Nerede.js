const { MessageEmbed } = require("discord.js");
const guild = require("../../../../Settings/guild")
const cconfig = require("../../../../Settings/client");
const Nerede = require("../../Datebase/Nerede");

module.exports.execute = async (client, message, args) => {
let embed = new MessageEmbed().setColor("#000000")
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
if(!member.voice.channel) return message.react(client.emoji("red")).catch(() => { })
let data = await Nerede.findOne({_id: member.id})

let sorgu;
if(!data) sorgu = `${member}, ${member.voice.channel} kanalında. \n \` • \` Mikrofon **:** ${member.voice.mute ? `${client.emoji("offmic")}`: `${client.emoji("onmic")}`} \n \` • \` Kulaklık **:** ${member.voice.deaf ? `:mute:`: `:loud_sound:`}`
if(data) sorgu = `${member} kullanıcısı **${client.günsaat(Date.now(), data.time)}** ${member.voice.channel} kanalında. \n \` • \` Mikrofon **:** ${member.voice.mute ? `${client.emoji("offmic")}`: `${client.emoji("onmic")}`} \n \` • \` Kulaklık **:** ${member.voice.deaf ? `:mute:`: `:loud_sound:`}`
let kembed = embed.setDescription(sorgu)
message.inlineReply({ embed: kembed, allowedMentions: { repliedUser: false } });
}

exports.conf = {
    command: "n",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["n", "nerede"],
    timeout: "10000"
}
