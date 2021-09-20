const guild = require("../../../../Settings/guild")
module.exports.execute = async (client, message, args) => {
    const nick = args.slice(0).filter(arg => isNaN(arg)).map(arg => arg[0] + arg.slice(1)).join(" ");
    if (!nick) return message.react(client.emoji("red")).catch(() => { })

    let link = /h?t?t?p?s?:?\/?\/?discord.?gg\/?[a-zA-Z0-9]+/
    let reklam = /h?t?t?p?s?:?\/?\/?discorda?p?p?.?com\/?invites\/?[a-zA-Z0-9]+/
    if (link.test(nick) == true) return message.react(client.emoji("red")).catch(() => { })
    if (reklam.test(nick) == true) return message.react(client.emoji("red")).catch(() => { })
    if (nick.includes("@everyone")) return message.react(client.emoji("red")).catch(() => { })
    if (nick.includes("@here")) return message.react(client.emoji("red")).catch(() => { })

    if (nick.lenght > 20) return message.react(client.emoji("red")).catch(() => { })
    if (nick.length > 30) return message.react(client.emoji("red")).catch(() => { })
    if (!message.member.manageable) return message.react(client.emoji("red")).catch(() => { })

    let yaş = args.filter(arg => !isNaN(arg))[0]

    if (!message.member.user.username.includes(guild.tag)) {
    await message.member.setNickname(`${guild.untag} ${client.starkustassak(nick)} ${yaş ? `| ${yaş}` : ``}`)
    } else if (message.member.user.username.includes(guild.tag)) {
    await message.member.setNickname(`${guild.tag} ${client.starkustassak(nick)} ${yaş ? `| ${yaş}` : ``}`)
    }
    return message.react(client.emoji("okey")).catch(() => { })



}
exports.conf = {
    command: "booster",
    description: "Sunucunun davet linkini mesaj kanalına yollar.",
    aliases: ["zengin", "b", "z"],
    guildKonrol: false
}