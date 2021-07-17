const { MessageEmbed } = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const { rain } = require("../../../../../HELPERS/functions");

class Say2 extends Command {

    constructor(client) {
        super(client, {
            name: "say2",
            description: "Sunucunun anlık bilgisini verir.",
            usage: "say2",
            examples: ["saylan"],
            category: "Genel",
            accaptedPerms: ["cmd-registry", "cmd-double", "cmd-single", "cmd-ceo"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const roles = await low(client.adapters('roles'));

        let böyle = message.guild.memberCount;
        let gitme = await message.guild.members.cache.filter(m => client.config.tag.some(tag => m.user.username.includes(tag))).size;
        let ağlarım = await message.guild.members.cache.filter(m => m.presence.status !== 'offline').size;
        let relax = await message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("booster").value())).size;
        let baby = await message.guild.voiceStates.cache.filter(v => v.channel).size;

        const saranembed = new MessageEmbed().setColor("BLACK").setAuthor("† INFEЯИO Ses Bilgileri", message.author.displayAvatarURL({ dynamic: true })).setFooter("Kahve ❤ † INFEЯИO");
        const obj = {};
        for (let index = 0; index < message.guild.channels.cache.filter(c => c.type === "voice").array().length; index++) {
            const myChannel = message.guild.channels.cache.filter(c => c.type === "voice").array()[index];
            const key = obj[client.getPath(channels.value(), myChannel.parentID)] || 0;
            obj[client.getPath(channels.value(), myChannel.parentID)] = key + myChannel.members.size

        }
        console.log(obj);


        await message.channel.send(saranembed.setDescription(stripIndent`
       ${emojis.get("kahvehac").value()} Sunucuda ${rain(client, böyle)} üye var.

       ${emojis.get("kahvehac").value()} Aktif olarak ${rain(client, ağlarım)} üye var.

       ${emojis.get("kahvehac").value()} Tagımızı taşıyarak bize destek olan ${rain(client, gitme)} üye var.

       ${emojis.get("kahvehac").value()} Ses Kanallarında ${rain(client, baby)} Üye Bulunmaktadır.
        `));
    }
}

module.exports = Say2;