let { MessageEmbed } = require("discord.js")
module.exports.execute = async (client, message, args) => {

  let ses = message.guild.members.cache.filter(a => a.voice.channel)
  let bot = message.guild.members.cache.filter(a => a.voice.channel && a.user.bot)

  if(ses.size == 0) return message.inlineReply(`Ses kanallarında hiç üye bulunmamakta.`)

  message.inlineReply(`Ses kanallarında **${ses.size}** üye bulunmakta.`)

}
exports.conf = {
    command: "sesli",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["sesli"],
    timeout: "7000",
cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner","cmdGang"]
}
