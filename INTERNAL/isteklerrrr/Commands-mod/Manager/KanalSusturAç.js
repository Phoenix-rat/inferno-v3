let { MessageEmbed } = require("discord.js")
module.exports.execute = async (client, message, args) => {
    if (!message.member.voice.channel) return message.react(client.emoji("red")).catch(() => { })
    let kanal = message.guild.channels.cache.get(message.member.voice.channel.id)
    kanal.members.forEach(üyeler => {
        üyeler.voice.setMute(false)
    });
    await message.react(client.emoji("okey")).catch(() => { })

}
exports.conf = {
    command: "kanalısusturaç",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["kanalisusturac", "allunmute", "kanalsusturac", "kanalsusturaç"],
    timeout: "7000",
cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner"]
}
