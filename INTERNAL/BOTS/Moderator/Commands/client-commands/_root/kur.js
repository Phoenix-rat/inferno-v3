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
        const fs = require('fs');
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        const pngFiles = fs.readdirSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/`).map(str => str.split('.')[0]).sort((a, b) => Number(a) - Number(b));
        for (let index = 0; index < (args[0] ? Number(args[0]) : pngFiles.length - 1); index++) {
    
            // use node-canvas
            const canvas = Canvas.createCanvas(1000, 400);
            const context = canvas.getContext('2d');
            // Since the image takes time to load, you should await it
            const background = await Canvas.loadImage(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${index}.png`);
            // This uses the canvas dimensions to stretch the image onto the entire canvas
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            // Wait for Canvas to load the image
            const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
            // Draw a shape onto the main canvas
            context.drawImage(avatar, 25, 25, 200, 200);    
            encoder.addFrame(context);
        }
        encoder.finish();
        const buffer = encoder.out.getData();
        const attachment = new Discord.MessageAttachment(buffer, 'my-points.png');
        await message.channel.send(attachment);

    }

}

module.exports = Kur;