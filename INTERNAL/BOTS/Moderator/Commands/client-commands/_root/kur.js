const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const Gm = require("gm");
const fs = require('fs');
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
        const pngFiles = fs.readdirSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/`).map(str => str.split('.')[0]).sort((a, b) => Number(a) - Number(b));
        const PNG = fs.readFileSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${args[0] ? Number(args[0]) : pngFiles.length}.png`)
        let curGm = Gm(PNG).setFormat('gif').loop(1);
        for (let index = 0; index < (args[0] ? Number(args[0]) : pngFiles.length); index++) {
            curGm = curGm.delay(1).in([`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${pngFiles[index]}.png`]);
        }
        curGm.toBuffer(async (error, buffer) => {
            if (error) return console.log(error);
            const att = new Discord.MessageAttachment(buffer, 'pointBar.gif');
            await message.channel.send(new Discord.MessageEmbed().setImage('attachment://pointBar.gif').attachFiles(att));
        });

    }

}

module.exports = Kur;