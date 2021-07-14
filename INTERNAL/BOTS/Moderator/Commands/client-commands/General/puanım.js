const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
class Say extends Command {

    constructor(client) {
        super(client, {
            name: "puanım",
            description: "Puan bilgisini verir..",
            usage: "puanım",
            examples: ["puanım"],
            category: "Genel",
            accaptedPerms: ["cmd-registry", "cmd-double", "cmd-single", "cmd-ceo"],
            cooldown: 10000,
            onTest: true
        });
    }

    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const roles = await low(client.adapters('roles'));

        function bar(point, maxPoint) {
            const deger = Math.trunc(point * 5 / maxPoint);
            let str = "";
            for (let index = 2; index < 4; index++) {
                if ((deger / index) >= 1) {
                    str = str + emojis.get("ortabar_dolu").value()
                } else {
                    str = str + emojis.get("ortabar").value()
                }
            }
            if (deger === 0) {
                str = `${emojis.get("solbar").value()}${str}${emojis.get("sagbar").value()}`
            } else if (deger === 5) {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar_dolu").value()}`
            } else {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar").value()}`
            }
            return str;
        }


        await message.channel.send(new Discord.MessageEmbed().setDescription(stripIndent`
        ${bar(args[0])}
        `).setColor('#7bf3e3'));
    }
}

module.exports = Say;