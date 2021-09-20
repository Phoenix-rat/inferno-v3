var guldowns = new Map()
module.exports.execute = async (client, message, args) => {

    if (Date.now() - Number(guldowns.get(message.channel.id)) < 15000) {
        message.react(client.emoji("loading")).catch(() => { })
    } else {
        linkKontrol(message)
        guldowns.set(message.channel.id, Date.now())
    }

}
exports.conf = {
    command: "link",
    description: "Sunucunun davet linkini mesaj kanalına yollar.",
    aliases: ["link"],
    guildKonrol: true
}

async function linkKontrol(message) {

    if (message.guild.vanityURLCode) {
        message.channel.send(`https://discord.gg/${message.guild.vanityURLCode}`)
    } else {
        let davet = await message.channel.createInvite({ maxUses: 1 })
        message.channel.send(`${davet}`).catch(() => { })
    }
}