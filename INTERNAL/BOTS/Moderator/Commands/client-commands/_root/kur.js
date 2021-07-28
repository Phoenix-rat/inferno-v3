const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');
const fs = require('fs');
const Gm = require('gm');
const request = require('request');
const giphy = require('gif2sprite');
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
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        // use node-canvas
        const canvas = Canvas.createCanvas(1000, 400);
        const context = canvas.getContext('2d');
        const pngFiles = fs.readdirSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/`).map(str => str.split('.')[0].slice(2)).sort((a, b) => Number(a) - Number(b));
        for (let index = 0; index < (args[0] ? Math.round(Number(args[2]) / 4) : pngFiles.length); index++) {
            let file;
            try {
                file = fs.open(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/1-${pngFiles[index]}.png`, 'r', (error, fd) => {
                    if (error) index = index + 1;
                });
            } finally {
                if (file) await file.close();
            }
            const background = await Canvas.loadImage(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/1-${pngFiles[index]}.png`);
            context.drawImage(background, 0, 0, 1000, 400);

            request(message.author.displayAvatarURL({ format: 'gif' }), {
                encoding: null
            }, async (error, response, body) => {
                gifFrames({ 
                    url: body,
                    frames: 0,
                    outputType: 'canvas'
                }).then((frameData) => {
                    console.log(frameData[index]);
                });
                //await message.channel.send(new Discord.MessageAttachment(body, 'body.gif'));
                /*
                frameGm.toBuffer(async (err, buffer) => {
                    if (err) return console.log(err);
                    await message.channel.send(new Discord.MessageAttachment(buffer, 'points.png'));
                    const myGm = Gm(buffer).in().resize(200).selectFrame(index).setFormat('png');
                    myGm.toBuffer(async (er, buff) => {
                        console.log(buff);
                        if (er) return console.log(er);
                        await message.channel.send(new Discord.MessageAttachment(buff, 'buffer.png'));
                        const avatar = await Canvas.loadImage(buff);
                        context.drawImage(avatar, 75, 60, 200, 200);
                    });
                });
                */
            });

            encoder.addFrame(context);
            console.log(index);
        }
        encoder.finish();
        console.log('done!');
        const ender = encoder.out.getData();
        const attachment = new Discord.MessageAttachment(ender, 'my-points.gif');
        await message.channel.send(attachment);


    }

}

module.exports = Kur;