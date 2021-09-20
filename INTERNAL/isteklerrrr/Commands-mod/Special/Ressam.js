
const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args) => {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })

    if(!member.roles.cache.has(client.role("spRessam")) ){
     member.roles.add(client.role("spRessam")).catch(() => {})
     message.react(client.emoji("okey")).catch(() => { })
} else
     member.roles.remove(client.role("spRessam")).catch(() => {})
     message.react(client.emoji("okey")).catch(() => { })

}

exports.conf = {
    command: "ressam",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["ressam","painter"],
    timeout: "7000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner","cmdRuby"]
}
