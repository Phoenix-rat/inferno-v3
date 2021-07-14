const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndents } = require("common-tags");
const children = require("child_process");
const Points_config = require('../../../../../MODELS/Economy/Points_config');
class pm2 extends Command {

    constructor(client) {
        super(client, {
            name: "puanla",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
            accaptedPerms: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: true,
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const hoistroller = message.guild.roles.cache
            .filter(r => r.rawPosition >= message.guild.roles.cache.get("856265277637394472").rawPosition)
            .filter(r => r.hoist).filter(role => role.name.startsWith('†'))
            .filter(r => r.id !== roles.get("booster").value())
            .sort((a, b) => a.rawPosition - b.rawPosition).array().reverse();
        console.log(hoistroller.map(r => r.name))

    }

}

module.exports = pm2;