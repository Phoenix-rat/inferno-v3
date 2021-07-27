const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const Gm = require("gm");
const fs = require('fs');
const Canvas = require('canvas');
const Pixelar = require('get-pixels');
const GifEncoder = require('gif-encoder');
const gifFrames = require("gif-frames");
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
        const PNG = fs.readFileSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/0.png`);
        const ProfilePicPixels = Pixelar(message.author.displayAvatarURL({ format: 'gif', dynamic: true }));
        let curGm = Gm(PNG).setFormat('gif');
        const pngFiles = fs.readdirSync(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/`).map(str => str.split('.')[0]).sort((a, b) => Number(a) - Number(b));
        for (let index = 1; index < (args[0] ? Number(args[0]) : pngFiles.length); index++) {
            const frame = await gifFrames({
                url: message.author.displayAvatarURL({ format: 'gif', dynamic: true }),
                frames: 105
            }).then((frameData) => frameData[index].getImage());
            console.log(frame);
            const canvas = Canvas.createCanvas(1000, 400, "svg")
            const context = canvas.getContext("2d");
            const background = await Canvas.loadImage(`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${pngFiles[index]}.png`);
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            const avatar = await Canvas.loadImage(frame);
            context.drawImage(avatar, 25, 25, 200, 200);
            const canvasBufer = canvas.toBuffer();
            const newGm = Gm(canvasBuffer).setFormat('png')
            curGm = curGm.in([`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${pngFiles[index]}.png`]).delay(1);
        }
        for (let index = 0; index < 10; index++) {
            curGm = curGm.in([`/home/inferno/inferno-v3/INTERNAL/SRC/point_items/${args[0] ? Number(args[0]) : pngFiles.length}.png`]).delay(10);
        }
        curGm.toBuffer(async (error, buffer) => {
            if (error) return console.log(error);
            const att = new Discord.MessageAttachment(buffer, 'pointBar.gif');
            await message.channel.send(new Discord.MessageEmbed().setImage('attachment://pointBar.gif').attachFiles(att));
        });

    }

}

module.exports = Kur;