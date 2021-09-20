const { MessageEmbed } = require("discord.js");
const guild = require("../../../../Settings/guild")
const cconfig = require("../../../../Settings/client")

module.exports.execute = async (client, message, args) => {
    let sayembed = new MessageEmbed().setColor("#000000")
    let cevrimci = message.guild.members.cache.filter(mem => mem.presence.status !== 'offline').size;
    let sesliüye = message.guild.members.cache.filter(a => a.voice.channel).size;
    let tagliuye = message.guild.members.cache.filter(mem => mem.user.username.includes(guild.tag)).size;
    let tagliaktifuye = message.guild.members.cache.filter(mem => mem.user.username.includes(guild.tag) && mem.presence.status !== "offline").size;
    let booster = message.guild.roles.cache.get("889301840376782848").members.size
    let yetkili = message.guild.members.cache.filter(a => a.roles.cache.has("889303103512383589") && a.voice.channel).size;

    sayembed.setDescription(`
${client.emoji("guildTag_2")} Sunucuda **${message.guild.memberCount}** üye var. (\`${cevrimci} Aktif\`)
${client.emoji("guildTag_2")} Tagımızı taşıyan **${tagliuye}** üye var. (\`${tagliaktifuye} Aktif\`)
${client.emoji("guildTag_2")} **${booster}** kişi toplamda ${message.guild.premiumSubscriptionCount} boost desteğinde bulunmuş.
${client.emoji("guildTag_2")} Ses kanalarında ${sesliüye} üye var. (\`${yetkili} Yetkili\`)`)

    message.inlineReply({ embed: sayembed, allowedMentions: { repliedUser: true } }).catch(() => { })

}
exports.conf = {
    command: "say",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["say"],
    timeout: "10000",
    cmdPerms: ["cmdTekHac","gang","cmdCiftHac", "cdmCeo", "cmdOwner","cmdMute"]
}
