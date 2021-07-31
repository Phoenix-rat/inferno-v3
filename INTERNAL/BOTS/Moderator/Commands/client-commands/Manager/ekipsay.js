const { MessageEmbed } = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const { rain } = require("../../../../../HELPERS/functions");
class ekipsay extends Command {

    constructor(client) {
        super(client, {
            name: "ekipsay",
            description: "Ekiptekileri sayar.",
            usage: "ekipsay @member/ID",
            examples: ["ekipsay"],
            category: "Yetkili",
            aliases: ["ekipsay"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],

        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const discri = message.guild.members.cache.filter(stark => !stark.bot).filter(a => a.user.discriminator == "1458").size;
        const yazitag = message.guild.members.cache.filter(m => m.user.username.includes("Rîff")).size

        let embed = new MessageEmbed().setColor("BLACK").setFooter(`• Kahve ❤ INFEЯИO †`, message.author.displayAvatarURL({ dynamic: true }));
        message.channel.send(embed.setDescription(stripIndent`
        ${emojis.get("kahvehac").value()} Rîff tagını **${yazitag}** kişi taşıyor.
        ${emojis.get("kahvehac").value()} 1458 tagını **${discri}** kişi taşıyor.
        ${emojis.get("kahvehac").value()} Toplam Tagınızı **${discri + yazitag}** kişi taşıyor.
        `))
    }
}
module.exports = ekipsay;