const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const msg_snipe = require("../../../../../MODELS/Moderation/Snipe.js")

class Upgrade extends Command {

    constructor(client) {
        super(client, {
            name: "snipe",
            description: "Sunucuda silinen son mesajı gösterir.",
            usage: "snipe",
            examples: ["snipe"],
            category: "Management",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let embed = new Discord.MessageEmbed().setColor("#780580").setAuthor(message.author.username, message.author.avatarURL({ dynamics: true }))
        let sData = await msg_snipe.findOne({ _id: message.guild.id })
        if (!sData) return message.channel.send(embed.setDescription(`**Sunucuda en son silinen mesaj bulunamadı.**`))
        let channel = message.guild.channels.cache.get(sData.channel)
        message.channel.send(embed.setDescription(`${message.author} adlı kullanıcı ${channel ? channel : "**__Bulunamayan Kanal__**"} kanalında en son silinen mesajı yakaladı. \n\n**Kullanıcı:** \n\`\`\`• ${message.guild.members.cache.get(sData.author).user.tag} (${sData.author})\`\`\` \n**Mesaj Iceriği** \n\`\`\`${sData.content ? sData.content : "Bulunamadı"}\`\`\``))

    }
}

module.exports = Upgrade;