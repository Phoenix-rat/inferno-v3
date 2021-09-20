let { MessageEmbed } = require("discord.js")
module.exports.execute = async (client, message, args) => {

    if (args[0] && (args[0] === "aç")) {
        await message.react(client.emoji("okey"));
        return await message.channel.updateOverwrite(message.guild.roles.everyone.id, {
            SEND_MESSAGES: null
        });
    }
    await message.channel.updateOverwrite(message.guild.roles.everyone.id, {
        SEND_MESSAGES: false
    });
    await message.channel.updateOverwrite(client.role("cmdOwner"), {
        SEND_MESSAGES: true
    });
    await message.channel.updateOverwrite(client.role("cmdCeo"), {
        SEND_MESSAGES: true
    });
    await message.react(client.emoji("okey"));

}
exports.conf = {
    command: "kanal",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["kanal","kilit"],
    timeout: "7000",
cmdPerms: ["cdmCeo", "cmdOwner"]
}
