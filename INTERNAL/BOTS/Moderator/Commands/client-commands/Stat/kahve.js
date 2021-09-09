const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const Messages = require('../../../../../MODELS/StatUses/stat_msg');
const Register = require('../../../../../MODELS/Datalake/Registered');
const Invites = require('../../../../../MODELS/StatUses/Invites');

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

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        
        const Veri = await Messages.findOne({ _id: mentioned.user.id });
        const MesajVeri = Veri ? Veri.records.length + " Mesaj" : "Veri Bulunamadı";

        const TVeri = await Register.find({ executor: mentioned.user.id });
        const KayıtVeri = TVeri ? TVeri.length + " Kayıt" : "Veri Bulunamadı";

        const DVeri = await Invites.findOne({ _id: mentioned.user.id });
        const DavetVeri = DVeri ? DVeri.records.length + " Davet" : "Veri Bulunamadı";
  
        const MyRole = message.guild.roles.cache.get("856266299285045288");
        const NextRole = message.guild.roles.cache.get("856265230187102259")
        
        const embed = new Discord.MessageEmbed().setDescription(`${mentioned} adlı yetkilinin stat verileri aşağıda yer almaktadır!`).setColor("BLACK").setTimestamp().setFooter(`🌟 Kahve sizi seviyor ❤ ${message.guild.name}`)
        .addField("__**Toplam Ses**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Mesaj**__", `\`\`\`fix\n${MesajVeri}\`\`\``, true)
        .addField("__**Toplam Kayıt**__", `\`\`\`fix\n${KayıtVeri}\`\`\``, true)
        .addField("__**Toplam Davet**__", `\`\`\`fix\n${DavetVeri}\`\`\``, true)
        .addField("__**Toplam Taglı**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField("__**Toplam Yetkili**__", `\`\`\`fix\nVeri Bulunamadı\`\`\``, true)
        .addField(`Ses Kanalları`,`${emojis.get("statssh").value()} **Sohbet Odaları:** \`31 saat, 31 dakika\`
        ${emojis.get("statssh").value()} **Kayıt Odaları:** \`31 saat, 31 dakika\`
        ${emojis.get("statssh").value()} **Private Odaları:** \`31 saat, 31 dakika\`
        ${emojis.get("statssh").value()} **Eğlence Odaları:** \`31 saat, 31 dakika\``)
        .addField(`Mesaj Kanalları`,`${emojis.get("statssh").value()} **Mesaj Kanalları:** \`${MesajVeri}\``)
        .addField(`${emojis.get("statstars").value()} Puan Durumu`,`${bar(10000, 25000)} \`10000/25000\``)
        .addField(`${emojis.get("statstars").value()} Yetki Atlama Durumu`,`${MyRole} rolünden ${NextRole} rolüne yükselmek için \`15000\` **Puana** ihtiyacın var!`)

        await message.channel.send(embed)

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
        
    }
}

module.exports = Nerede;