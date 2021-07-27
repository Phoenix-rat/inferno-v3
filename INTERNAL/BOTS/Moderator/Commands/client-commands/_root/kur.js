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
        const PNG = fs.readFileSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/0.png`)
        let curGm = Gm(PNG).setFormat('gif');
        const pngFiles = fs.readdirSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/`).map(str => str.split('.')[0]).sort((a, b) => Number(a) - Number(b)).slice(1).map(f => fs.readFileSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${f}.png`));
        for (let index = 1; index < pngFiles.length; index++) {
            curGm = curGm.in(pngFiles[index]).delay(1);
        }
        curGm.toBuffer(async (error, buffer) => {
            if (error) return console.log(error);
            const att = new Discord.MessageAttachment(buffer, 'pointBar.gif');
            await message.channel.send(new Discord.MessageEmbed().setImage('attachment://pointBar.gif').attachFiles(att));
        });  

    }

}

module.exports = Kur;