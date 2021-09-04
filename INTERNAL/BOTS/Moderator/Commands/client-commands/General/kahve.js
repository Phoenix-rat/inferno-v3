const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
class Nerede extends Command {

    constructor(client) {
        super(client, {
            name: "kave",
            description: "etiketlenen kişinin nerede olduğunu gösterir.",
            usage: "kave @Kahve/ID",
            examples: ["nerede @Kahve/ID"],
            aliases: ["kahpe", "allahukahve"],
            category: "Genel",
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('BLACK'));
    
        const embed = new Discord.MessageEmbed().setColor("BLACK")
        .addField("",`${mentioned} adlı kullanıcının stat verileri aşağıda bulunmaktadır`)
        .addField("__**Toplam Ses**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Mesaj**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Kayıt**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)

        .addField("__**Toplam Ses**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Mesaj**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Kayıt**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField(`Ses Kanalları`,`${emojis.get("status_acik").value()} Public Ses Kanalları: \`31 saat, 31 dakika\``)
        .addField(`Mesaj Kanalları`,`${emojis.get("status_acik").value()} Mesaj Kanalları: \`3131313131 mesaj\``)
        await message.channel.send(embed)

    }
}

module.exports = Nerede;