const guild = require("../../../../Settings/guild")
module.exports.execute = async (client, message, args) => {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

    if (!member) return message.react(client.emoji("red")).catch(() => { })

    if (member.user.presence.status == "offline") return message.inlineReply(`Belirlenen kullanıcı \`çevrimdışı\` olduğu için işlem iptal edildi.`)

    let adana;
    let ceyhan = Object.keys(member.user.presence.clientStatus)
    if (ceyhan[0] == "desktop") adana = "Masaüstü Uygulama"
    if (ceyhan[0] == "web") adana = "İnternet Tarayıcısı"
    if (ceyhan[0] == "mobile") adana = "Mobil Telefon"

    message.inlineReply(`${member} Kullanıcının şu anda kullandığı cihaz: \`${adana}\``)

}
exports.conf = {
    command: "cihaz",
    description: "Sunucunun davet linkini mesaj kanalına yollar.",
    aliases: ["cihaz"]
}