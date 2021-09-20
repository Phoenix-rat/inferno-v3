const kayitData = require("../Datebase/Register.js")
const config = require("../../../Settings/guild.js")
exports.execute = async (client, message, args) => {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!member) return message.react(client.emoji("red")).catch(() => { })
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(client.emoji("red")).catch(() => { })
    if (message.guild.me.roles.highest.position <= member.roles.highest.position || member.hasPermission("ADMINISTRATOR")) return message.react(client.emoji("red")).catch(() => { })
    if (message.author.id == member.id) return message.react(client.emoji("red")).catch(() => { })
    if (!member.roles.cache.has(client.role("regSuphe"))) return message.react(client.emoji("red")).catch(() => { })
    member.roles.add(client.role("regUnreg")).catch(() => { })
    member.roles.remove(client.role("regSuphe")).catch(() => { })
    message.react(client.emoji("okey")).catch(() => { })

}
exports.conf = {
    command: "şüpheli",
    description: "Sunucuda belirtilen sebepten dolayı afk kalırsınız.",
    aliases: ["supheli", "süpheli"],
    timeout: "7000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner","cmdRegister"]
}
