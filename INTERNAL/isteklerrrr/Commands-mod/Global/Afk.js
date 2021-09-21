const Afk = require("../../Datebase/Afk.js");
exports.execute = async (client, message, args) => {

    let reason = args.slice(0).join(' ')
    if (message.content.includes("@everyone")) return message.react(client.emoji("red")).catch(() => { })
    if (message.content.includes("@here")) return message.react(client.emoji("red")).catch(() => { })

    if (reason.length > 50) return message.react(client.emoji("red")).catch(() => { })
    await Afk.findOneAndUpdate({ _id: message.author.id }, { $set: { time: Date.now(), reason: reason, messages: [] } }, { upsert: true })
    await message.react(`${client.emoji("afk")}`).catch(() => { })
    let nick = message.member.displayName.replace(message.member.displayName, `[AFK] ${message.member.displayName}`)
    if (message.member.manageable) message.member.setNickname(`${nick}`).catch(() => { })

}
exports.conf = {
    command: "afk",
    description: "Sunucuda belirtilen sebepten dolayı afk kalırsınız.",
    aliases: ["afk"],
    timeout: "7000"
}