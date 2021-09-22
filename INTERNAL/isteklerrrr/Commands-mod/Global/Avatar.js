const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args) => {
    let embed = new MessageEmbed().setColor("#313136")
    let user = message.mentions.users.first() || (await client.users.fetch(args[0]).catch(err => { return undefined; })) || message.author;
    message.inlineReply(user.displayAvatarURL({ dynamic: true, size: 2048 }), {allowedMentions: {repliedUser: false}}).catch(err => { return undefined; })
}
exports.conf = {
    command: "avatar",
    description: "Kullanıcının avatar(profil fotoğrafını) mesaj kanalına yollar.",
    aliases: ["avatar", "pp"],
    timeout: "5000"
}