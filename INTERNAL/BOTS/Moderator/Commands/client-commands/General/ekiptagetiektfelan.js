const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Teamlo extends Command {

    constructor(client) {
        super(client, {
            name: "kek",
            description: "Belirtilen kullanıcıya özel üye rolü verir.",
            usage: "kek @Kahve/ID",
            examples: ["kek @Kahve/ID"],
            category: "Genel",
            aliases: ["kekyelan","kekmek"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        let {tag} = args[0];
        if (!{tag}) message.channel.send("tag belirt lo kek")
        let ticket = args[1]; 
        if (!ticket) message.channel.send("etiket belirt kek")
        let kekrole = message.guild.roles.cache.get(args[2]);
        if (!kekrole) message.channel.send("tag belirt lo kek")
        message.guild.members.cache.filter(ekip => ekip.user.discriminator === ticket || ekip.user.username.includes(tag) && !s.roles.cache.has(kekrole)).forEach(kek => kek.roles.add(kekrole))
        message.channel.send(`test`)
    }
}

module.exports = Teamlo;