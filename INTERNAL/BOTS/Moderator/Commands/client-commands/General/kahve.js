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

        function bar(point, maxPoint) {
            const deger = Math.trunc(point * 10 / maxPoint);
            let str = "";
            for (let index = 2; index < 9; index++) {
                if ((deger / index) >= 1) {
                    str = str + emojis.get("ortabar_dolu").value()
                } else {
                    str = str + emojis.get("ortabar").value()
                }
            }
            if (deger === 0) {
                str = `${emojis.get("solbar").value()}${str}${emojis.get("sagbar").value()}`
            } else if (deger === 10) {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar_dolu").value()}`
            } else {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar").value()}`
            }
            return str;
        }
        
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('BLACK'));
    
        const embed = new Discord.MessageEmbed().setColor("BLACK")
        .addField("__**Toplam Ses**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Mesaj**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Kayıt**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)

        .addField("__**Toplam Davet**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Taglı**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Yetkili**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField(`Ses Kanalları`,`${emojis.get("status_acik").value()} Public Ses Kanalları: \`31 saat, 31 dakika\``)
        .addField(`Mesaj Kanalları`,`${emojis.get("status_acik").value()} Mesaj Kanalları: \`31 mesaj\``)
        .addField(`${emojis.get("status_acik").value()} Puan Durumu`,`${bar(10000, 25000)} \`10000/25000\``)
        await message.channel.send(embed)

    }
}

module.exports = Nerede;