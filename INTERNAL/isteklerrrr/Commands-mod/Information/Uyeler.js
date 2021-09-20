const { MessageEmbed } = require("discord.js")
module.exports.execute = async (client, message, args) => {
    let rolesamca = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if (!rolesamca) return message.react(client.emoji("red")).catch(() => { })

    if(rolesamca.members.size > 400) return message.react(client.emoji("red")).catch(() => { }) 
    if(rolesamca.members.size == 0) return message.channel.send(`\`\`\`${rolesamca.name} rolünde üye bulunmamakta.\`\`\``)
    let rolesuyes = rolesamca.members.map(a => a).join("\n")


    message.channel.send(`\`\`\`${rolesamca.name} rolünde ${rolesamca.members.size} üye bulunmakta.\`\`\`\n${rolesuyes}`)
    message.react(client.emoji("okey")).catch(() => { })

}
exports.conf = {
    command: "uyeler",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["roluye", "üyeler"],
    timeout: "7000",
cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner"]
}
