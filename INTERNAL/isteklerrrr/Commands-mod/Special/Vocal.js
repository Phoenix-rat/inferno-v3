
const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args) => {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })

    if(!member.roles.cache.has(client.role("spVocal")) ){
     member.roles.add(client.role("spVocal")).catch(() => {})
     message.react(client.emoji("okey")).catch(() => { })
} else
     member.roles.remove(client.role("spVocal")).catch(() => {})
     message.react(client.emoji("okey")).catch(() => { })

}

exports.conf = {
    command: "vocal",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["vocal"], 
    timeout: "7000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner","cmdRuby"]
}
