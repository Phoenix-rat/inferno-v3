
const emojis = require("../../../../Settings/emojis.js")
exports.execute = async (client, message, args) => {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })

    if (!message.member.voice.channel) return message.react(client.emoji("red")).catch(() => { })
    if (!member.voice.channel) return message.react(client.emoji("red")).catch(() => { })
    if (member.voice.channel.id == message.member.voice.channel.id) return message.react(client.emoji("red")).catch(() => { })
    if (member.id == message.member.id) return message.react(client.emoji("red")).catch(() => { })
    if (member.user.bot) return message.react(client.emoji("red")).catch(() => { })

    if (message.member.permissions.has("ADMINISTRATOR")) {
        member.voice.setChannel(message.member.voice.channel.id).catch(() => { })
        message.react(client.emoji("okey")).catch(() => { })
        return;
    } else {


        const filter = (reaction, user) => { return [client.emoji("okey").name, client.emoji("red").name,].includes(reaction.emoji.name) && user.id === member.id; };
        message.react(client.emoji("okey")).catch(() => { })
        message.react(client.emoji("red")).catch(() => { })

        message.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
            .then(async (collected) => {
                const reaction = collected.first();
                if (reaction.emoji.name == client.emoji("red").name) {
                    message.reactions.cache.find(r => r.emoji.id === emojis.okey).remove().catch(() => { })

                }

                if (reaction.emoji.name == client.emoji("okey").name) {
                    message.reactions.cache.find(r => r.emoji.id === emojis.red).remove().catch(() => { })
                    member.voice.setChannel(message.member.voice.channel.id).catch(() => { })

                }
            })
            .catch(async (collected) => {
                message.reactions.cache.find(r => r.emoji.id === emojis.okey).remove().catch(() => { })
            });
    }
}
exports.conf = {
    command: "çek",
    description: "Belirtilen kullanıcıyı olduğun ses kanalına taşır.",
    aliases: ["çek"],
    timeout: "2000"
}