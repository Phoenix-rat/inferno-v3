const Command = require("../../../Base/Command");
const low = require('lowdb');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "ytac",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
            acceptedRoles: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: true,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        
        await message.guild.roles.cache.get(roles.get("oluozan").value()).setPermissions(1506148486);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));

        
    }

}

module.exports = Kur;