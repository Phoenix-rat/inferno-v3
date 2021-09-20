const Discord = require("discord.js")
const snipe = require("../../Datebase/Snipe.js");
exports.execute = async (client, message, args) => {
    let sData = await snipe.findOne({ _id: message.channel.id })

    if (!sData) return message.inlineReply({ content: `Kanalda son silinen mesaj bulunamadı.`, allowedMentions: { repliedUser: false } }).catch(() => { })

    let embed = new Discord.MessageEmbed().setColor("#780580")

    message.channel.send(embed.setDescription(`<@${sData.author}>: ${sData.content ? sData.content : "Bulunamadı"}`))

};
exports.conf = {
    command: 'snipe',
    description: 'İstediğiniz kadar mesaj siler',
    aliases: ['snipe', "snipe", "snip"],
    timeout: "10000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner", "cmdChatCoutch", "cmdChatSorumlusu" ]

}
