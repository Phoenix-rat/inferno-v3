const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');

class Roles extends Command {

    constructor(client) {
        super(client, {
            name: "roles",
            description: "Belirtilen roldeki üyeleri gösterir.",
            usage: "roles",
            examples: ["roller", "roles"],
            category: "Yetkili",
            aliases: ["roller", "roles"],
            accaptedPerms: ["root", "owner"],
            cooldown: 10000
        });
    }

    async run(client, message, args, data) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const GREmbed = new Discord.MessageEmbed().setColor("Black");
     //   let guildRoles = message.guild.roles.cache.sort((kahve, stark) => kahve.position - stark.position).map(grol => `${grol.name} - (${grol.id})`).join("\n");
        let guildRoles = message.guild.members.cache.filter(a => a).map(a => `${a} ${a.id}`)
    //    await message.channel.send(GREmbed.setDescription(`${guildRoles}`, { split: true }));

        splitembed(`${guildRoles}`).then(list => {
                list.forEach(item => {
                    message.channel.send(`${item}`);
                });
            });

    }
}

module.exports = Roles;

async function splitembed(description, author = false, footer = false, features = false) {
    let embedSize = parseInt(`​${description.length / 2048}`.split('.')[0]) + 1
    let embeds = new Array()
    for (var i = 0; i < embedSize; i++) {
        let desc = description.split("").splice(i * 2048, (i + 1) * 2048)
        let x = new Discord.MessageEmbed().setDescription(desc.join(""))
        if (i == 0 && author) x.setAuthor(author.name, author.icon ? author.icon : null)
        if (i == embedSize - 1 && footer) x.setFooter(footer.name, footer.icon ? footer.icon : null)
        if (i == embedSize - 1 && features && features["setTimestamp"]) x.setTimestamp(features["setTimestamp"])
        if (features) {
            let keys = Object.keys(features)
            keys.forEach(key => {
                if (key == "setTimestamp") return
                let value = features[key]
                if (i !== 0 && key == 'setColor') x[key](value[0])
                else if (i == 0) {
                    if (value.length == 2) x[key](value[0], value[1])
                    else x[key](value[0])
                }
            })
        }
        embeds.push(x)
    }
    return embeds
}