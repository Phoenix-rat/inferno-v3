const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');

class RoleInfo extends Command {

    constructor(client) {
        super(client, {
            name: "rolinfo",
            description: "Belirtilen roldeki üyeleri gösterir.",
            usage: "rolinfo @Rol/ID",
            examples: ["rolinfo @Rol/ID"],
            category: "Yetkili",
            aliases: ["rinfo", "roleinfo"],
            accaptedPerms: ["root", "owner"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        message.guild.fetchBans(true).then(banuser => {
        let Banneduser = banuser.map(x => `<@${x.user.id}> (\`${x.user.id}\`)`)
            message.channel.send(`
• Banlı Kullanıcılar.            
${Banneduser.join("\n")})`, 
{ split: true })
        })
    }
}
module.exports = RoleInfo;