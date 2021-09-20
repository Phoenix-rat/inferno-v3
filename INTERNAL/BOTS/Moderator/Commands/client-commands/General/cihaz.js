const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');

class Booster extends Command {

    constructor(client) {
        super(client, {
            name: "booster",
            description: "Belirtilen ismi adınız yapar",
            usage: "booster Kahverella",
            examples: ["booster Kahvrella"],
            category: "Genel",
            accaptedPerms: ["booster"],
            aliases: ["zengin", "bisim", "booserisim"],
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        if (mentioned.user.id === message.member.user.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("pando1").value()} Kendi kendini etiketleme..`).setColor('#2f3136'));
        if (member.user.presence.status == "offline") return message.inlineReply(`Belirlenen kullanıcı \`çevrimdışı\` olduğu için işlem iptal edildi.`)

        let adana = "Bilinmiyor";
        let ceyhan = Object.keys(mentioned.user.presence.clientStatus)
        if (ceyhan[0] == "desktop") adana = "Masaüstü Uygulama"
        if (ceyhan[0] == "web") adana = "İnternet Tarayıcısı"
        if (ceyhan[0] == "mobile") adana = "Mobil Telefon"
        await message.channel.send(new Discord.MessageEmbed().setDescription(`${member} Kullanıcının şu anda kullandığı cihaz: \`${adana}\``));

    }
}

module.exports = Booster;