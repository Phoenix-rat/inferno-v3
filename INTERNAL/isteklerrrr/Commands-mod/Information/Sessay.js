const { MessageEmbed } = require("discord.js")
module.exports.execute = async (client, message, args) => {
    let rolesamca = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if (!rolesamca) return message.react(client.emoji("red")).catch(() => { })
    let embed = new MessageEmbed().setColor(rolesamca.hexColor)

    let aktif = rolesamca.members.filter(a => a.presence.status !== "offline").size
    let aktifamasestedegil = rolesamca.members.filter(a => a.presence.status !== "offline" && !a.voice.channel).size
    let aktifamasestedegilmap = rolesamca.members.filter(a => a.presence.status !== "offline" && !a.voice.channel).map(a => a).join("\n")

    if(aktif == 0) return message.channel.send(`\`\`\`${rolesamca.name} rolünde şuan aktif üye bulunmamakta.\`\`\``)

    let content; 
    if(aktifamasestedegil > 0) content= `\n**Sesli kanallarda olmayan kullanıcılar;** \n${aktifamasestedegilmap}`; else content= " "


    message.channel.send(`\`\`\`${rolesamca.name} rolünde şuan ${aktif} kullanıcı aktif, ${aktifamasestedegil} kullanıcı sesli kanallarda değil!\`\`\`${content}`)
    message.react(client.emoji("okey")).catch(() => { })






}
exports.conf = {
    command: "sessay",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["sessay"],
    timeout: "7000",
cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner", "cmdGang"]
}
