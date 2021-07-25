const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');

class RoleInfo extends Command {

    constructor(client) {
        super(client, {
            name: "rolinfo",
            description: "belirtilen roldeki kişileri etiketler",
            usage: "rolinfo rolid",
            examples: ["rolsay 718265023750996028"],
            cooldown: 3600000,
            category: "Yetkili",
            accaptedPerms: ["cmd-all"]
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        
        let mentionedRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!mentionedRole) return message.channel.send(new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription("Belirtilen rolü sunucuda bulamadım lütfen rolü etiketleyiniz veya ID sini giriniz!"))
 
        let mentionedRoleMembers = mentionedRole.members.map(role => `<@${mentionedRole.id}> - (\`${mentionedRole.id}\`) `)
        message.channel.send(`${mentionedRole} rolündeki üyeler.
        
        ${mentionedRoleMembers.join("\n")})`, { split: true })
    }

}

module.exports = RoleInfo;