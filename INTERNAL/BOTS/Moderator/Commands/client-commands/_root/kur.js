const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const Gm = require("gm");
const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');
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
        const encoder = new GIFEncoder(1000, 400);
        encoder.createReadStream().pipe(fs.createWriteStream('/hom/inferno/tempIMG/myGif.gif'));
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        // use node-canvas
        const canvas = Canvas.createCanvas(1000, 400);
        const context = canvas.getContext('2d');
        const pngFiles = fs.readdirSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/`).map(str => str.split('.')[0]).sort((a, b) => Number(a) - Number(b));
        for (let index = 0; index < (args[0] ? Number(args[0]) : pngFiles.length - 1); index++) {
            let file;
            try {
                file = fs.open(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${pngFiles[index]}.png`, 'r', (error, fd) => {
                    if (error) index = index + 1;
                });
            } finally {
                if (file) await file.close();
            }
            const background = await Canvas.loadImage(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${pngFiles[index]}.png`);
            context.drawImage(background, 0, 0, 1000, 400);
            const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
            context.drawImage(avatar, 50, 50, 200, 200);
            encoder.addFrame(context);
        }
        encoder.finish();
        const buffer = encoder.out.getData();
        const attachment = new Discord.MessageAttachment(buffer, 'my-points.gif');
        await message.channel.send(attachment);

    }

}

module.exports = Kur;