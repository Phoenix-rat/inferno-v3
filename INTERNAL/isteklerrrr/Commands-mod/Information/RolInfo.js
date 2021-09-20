const { MessageEmbed } = require("discord.js")
module.exports.execute = async (client, message, args) => {
    let rolesamca = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if (!rolesamca) return message.react(client.emoji("red")).catch(() => { })
    let embed = new MessageEmbed().setColor(rolesamca.hexColor)

    let aktif = rolesamca.members.filter(a => a.presence.status !== "offline").size
    let gorunmez = rolesamca.members.filter(a => a.presence.status == "offline").size




    message.channel.send(embed.setDescription(`
    ${rolesamca} rolünün bilgileri:

    Rol Rengi: \`${rolesamca.hexColor}\`
    Rol ID: \`${rolesamca.id}\`
    Rolde ki üye sayısı: \`${rolesamca.members.size}\`

    Rolde ki aktif üye sayısı: \`${aktif}\`
    Rolde ki çevrimdışı üye sayısı: \`${gorunmez}\``).setThumbnail("https://media.discordapp.net/attachments/861635935295766538/865223983326560306/unknown.png?size:1024"))

    message.react(client.emoji("okey")).catch(() => { })






}
exports.conf = {
    command: "rolinfo",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["rolbilgi"],
    timeout: "7000",
    cmdPerms: ["cmdTekHac", "cmdCiftHac", "cdmCeo", "cmdOwner"]
}
