const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const Gm = require("gm");
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "kur",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: ["deneme"],
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

        let curGm = Gm(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/0.png`).setFormat('gif');
        for (let index = 1; index <= 100; index++) {
            curGm = curGm.in(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${index}.png`).delay(1);
        }
        curGm.toBuffer(async (error, buffer) => {
            if (error) return console.log(error);
            const att = new Discord.MessageAttachment(buffer, 'pointBar.gif');
            await message.channel.send(new Discord.MessageEmbed().setImage('attachment://pointBar.gif').attachFiles(att));
        });  

    }

}

module.exports = Kur;