const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args) => {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })

    if(!member.roles.cache.has(client.role("spVip")) ){
     member.roles.add(client.role("spVip")).catch(() => {})
     message.react(client.emoji("okey")).catch(() => { })
} else
     member.roles.remove(client.role("spVip")).catch(() => {})
     message.react(client.emoji("okey")).catch(() => { })

}

exports.conf = {
    command: "vip",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["vip","vıp"],
    timeout: "7000",
    cmdPerms: ["cmdCiftHac", "cdmCeo", "cmdOwner"]
}
