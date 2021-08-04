const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const yagmur = require("../../../../../BASE/stark.json")

class Upgrade extends Command {

    constructor(client) {
        super(client, {
            name: "yetkibaslat",
            description: "Belirtilen kullanıcıyı yetkiye başlatır.",
            usage: "yetkibaşlat @etiket/id",
            examples: ["yetkibaslat 853011311328100411"],
            category: "Management",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "yetkilialım"],
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        const embed = new Discord.MessageEmbed().setColor('BLACK');
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.channel.send(embed.setDescription(`${emojis.warn} Bunu yapmak için yeterli yetkiye sahip değilsin`));
        if(!mentioned.user.username.includes("†")) return message.channel.send(embed.setDescription(`${mentioned} \`Kullanıcısında tag(†) bulunmadığı için yetki verilemedi\``))

        await mentioned.roles.add("857386814791483412").catch(e => { })
        await mentioned.roles.add("857386815269896243").catch(e => { })
        await mentioned.roles.add("856265277637394472").catch(e => { })        
        await message.channel.send(embed.setDescription(`${mentioned} Kullanıcısının Yetkisi Başlatıldı :)) Başarılar Dileriz Sn.${mentioned} `))
      


    }
}

module.exports = Upgrade;