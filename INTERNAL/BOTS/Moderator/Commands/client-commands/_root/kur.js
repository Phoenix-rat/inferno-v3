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

        const myGm = Gm();
        const framePNGs = await readdir('../../../../../SRC/point_items/');
        for (let index = 0; index < framePNGs.length; index++) {
            const frameIndex = `../../../../../SRC/point_items/${framePNGs[index]}`;
            myGm.in(frameIndex).delay(100);
        }
        myGm.toBuffer((error, buffer) => {
            if (error) throw error;
            const att = new Discord.MessageAttachment(buffer, 'pointBar');
            message.channel.send(new Discord.MessageEmbed().setImage('attachments://pointBar').attachFiles(att));
        });

    }

}

module.exports = Kur;