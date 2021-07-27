const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
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

        const framePNGs = await readdir(__dirname + '/../../../../../SRC/point_items/');
        let curGm = Gm();
        for (let index = 1; index < framePNGs.length + 1; index++) {
            const frameIndex = __dirname + `/../../../../../SRC/point_items/${framePNGs[index]}`;
            curGm = curGm.in(frameIndex);
            if (index === 100) {
                curGm.delay(100).toBuffer((error, buffer) => {
                    if (error) return console.log(error);
                    const att = new Discord.MessageAttachment(buffer, 'pointBar.gif');
                    message.channel.send(new Discord.MessageEmbed().setImage('attachment://pointBar.gif').attachFiles(att));
                });
            }
        }
    }

}

module.exports = Kur;