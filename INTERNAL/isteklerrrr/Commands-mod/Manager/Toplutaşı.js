module.exports.execute = async (client, message, args) => {

    if (!message.member.voice.channel) return message.react(client.emoji("red")).catch(() => { })
    let channel = args[0]
    if (args.length < 1) return message.react(client.emoji("red")).catch(() => { })
    let positionChannel = message.guild.channels.cache.find(x => x.id == channel)
    if (!positionChannel) return message.react(client.emoji("red")).catch(() => { })
    let channelMembers = message.member.voice.channel.members.map(x => x.id)
    for (let i = 0; i < channelMembers.length; i++) {
        setTimeout(() => {
            message.guild.members.cache.get(channelMembers[i]).voice.setChannel(positionChannel.id)
        }, (i + 1) * 1000)
    }

    message.inlineReply(`${message.member.voice.channel} kanalındaki üyeler başarılı bir şekilde ${positionChannel} kanalına taşındı.`).catch(() => { })

}
exports.conf = {
    command: "toplutaşı",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["toplutasi", "kanal-taşı"],
    timeout: "7000",
cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner"]
}
