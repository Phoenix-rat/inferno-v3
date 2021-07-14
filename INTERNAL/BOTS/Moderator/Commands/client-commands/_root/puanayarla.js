const Command = require("../../../Base/Command");
const low = require('lowdb');
const core = require('ytdl-core');
const yt = require('scrape-yt');
const Discord = require('discord.js');

const Points_config = require('../../../../../MODELS/Economy/Points_config');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "puanayarla",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
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

        if (PuanConfig) return await message.channel.send('Bu rol için ayarlama zaten mevcut.');
        const role = message.guild.roles.cache.find(r => r.name.toLowerCase().slice(2) === args[0]);
        if (!role) return await message.channel.send("Böyle bir rol yok")
        await Points_config.create({
            _id: role.id,
            requiredPoint: args[1],
            expiringHours: args[2],
            registry: args[3],
            invite: args[4],
            tagged: args[5],
            authorized: args[6],
            message: args[7],
            voicePublicPerMinute: args[8],
            voiceOtherPerMinute: args[9]
        });
        await message.channel.send(new Discord.MessageEmbed().setDescription(`${role} rolü için gereken görev yapılandırması oluşturuldu.`))
        
        
    }

}

module.exports = Kur;