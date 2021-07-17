const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const nameData = require('../../../../../MODELS/Datalake/Registered');
const low = require('lowdb');
class KayitSil2 extends Command {
    constructor(client) {
        super(client, {
            name: "kayıtsız2",
            description: "Kayıt olan bir kullanıcıyı kayıtsıza atar ve o kullanıcının kaydını siler",
            usage: "kayıtsız2 etiket/id",
            examples: ["kayıtsız2 674565119161794560"],
            category: "kayıtsız3",
            aliases: ["kayıtsızla"],
            accaptedPerms: ["cmd-ceo", "oluozan2", "cmd-all"],
            cooldown: 10000
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send("Bir üye belirtmelisin!");

        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) 
        return message.channel.send(new Discord.MessageEmbed().setColor('BLACK').setDescription(`Bunu yapmak için yeterli yetkiye sahip değilsin`));
    
        await mentioned.setRoles(roles.get('welcome').value());
        embed.setThumbnail(mentioned.user.avatarURL({ dynamic: true, size: 2048 }));
        message.channel.send(embed.setDescription(`${member.toString()} üyesi başarıyla kayıtsıza atıldı!`));
    }
}
module.exports = KayitSil2;