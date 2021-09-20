const guild = require("../../../../Settings/guild")
var guldowns = new Map()
module.exports.execute = async (client, message, args) => {

    if (Date.now() - Number(guldowns.get(message.channel.id)) < 5000) {
        message.react(client.emoji("loading")).catch(() => { })
    } else {
        message.inlineReply(guild.tag, {allowedMentions: {repliedUser: true}}).catch(err => { return undefined; })
        guldowns.set(message.channel.id, Date.now())
    }

}
exports.conf = {
    command: "tag",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["tag"],
    timeout: "7000"
}
