const { MessageEmbed } = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const { rain, getPath } = require("../../../../../HELPERS/functions");

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

        const saranembed = new MessageEmbed().setColor("BLACK").setThumbnail(`message.member.`).setFooter("Kahve ❤ † INFEЯИO").setTitle("† INFEЯИO Ses Bilgileri");
        const obj = {};
        for (let index = 0; index < message.guild.channels.cache.array().length; index++) {
            const myChannel = message.guild.channels.cache.array()[index];
            const key = obj[getPath(channels.value(), myChannel.parentID)];
            if (!key) {
                obj[getPath(channels.value(), myChannel.parentID)] = 0;
            } else {
                obj[getPath(channels.value(), myChannel.parentID)] = key + 1
            }
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