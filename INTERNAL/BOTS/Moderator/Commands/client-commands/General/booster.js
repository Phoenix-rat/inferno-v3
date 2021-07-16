const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const lala = require('../../../../../BASE/personels.json')
class Booster extends Command {

    constructor(client) {
        super(client, {
            name: "booster",
            description: "Belirtilen ismi adınız yapar",
            usage: "booster Kahverella",
            examples: ["booster Kahvrella"],
            category: "Genel",
            accaptedPerms: ["booster"],
            aliases: ["booster","bisim","booserisim"],
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));

        const member = client.guilds.cache.get(lala.guild).members.cache.get(message.member.id);
        const isim = args.join(" ");
        if (!isim) return message.channel.send("Bir kullanıcı adı belirtmelisin*").then(msg => msg.delete({timeout:5000}));
        let taglo = '⸸';
        if (client.config.tag.some(tag => member.user.username.includes(tag))) {
            await member.roles.add(roles.get("crew").value());
            taglo = client.config.tag[0];
        }
        await member.setNickname(`${taglo} ${isim}`);
        message.channel.send(`${member.displayName} olan kullanıcı adını ${isim} olarak değiştirdim`).then(msg => msg.delete({timeout:5000}));

        await message.react(emojis.get("tantoony").value().split(':')[2].replace('>', ''));
    }
}

module.exports = Booster;