const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const izin = require('../../../../../MODELS/Temprorary/Permissions');
const keyz = require('shortid');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "izinver",
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

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send("Kullanıcı Bulunamadı.");

        let efct;
        if (args[1] === "emoji") efct = "emoji";
        if (args[1] === "rol") efct = "role";
        if (args[1] === "kanal") efct = "channel";
        if (!efct) return message.channel.send(new Discord.MessageEmbed().setDescription(`Efekt olarak emoji, rol veya kanal yazmalısın!`));
        let typo;
        if (args[2] === "ekle") typo = "create";
        if (args[2] === "sil") typo = "delete";
        if (args[2] === "yenile") typo = "update";
        if (!typo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Tür olarak ekle, sil veya yenile yazmalısın!`));
        if (!sayi(args[3])) return message.channel.send(new Discord.MessageEmbed().setDescription(`Sayı olarak kaç tane ${args[0]} için işlem yapılacağını belirtmelisin!`));
        if (!sayi(args[4])) return message.channel.send(new Discord.MessageEmbed().setDescription(`Sayı olarak bu iznin kaç dakika süreceğini yazmalısın!`));
        if (args[4] > 5) return message.channel.send(new Discord.MessageEmbed().setDescription(`5 dakikadan fazlasına izin veremem!`));
        const system = await izin.findOne({ user: mentioned.user.id, type: typo, effect: efct });
        if (system) {
            await izin.updateOne({ user: mentioned.user.id, type: typo, effect: efct }, { $inc: { count: args[3] } });
            await message.channel.send(new Discord.MessageEmbed().setDescription(`İzin başarıyla yenilendi!`));
        } else {
            try {
                const sex = await izin({ _id: keyz.generate(), user: mentioned.user.id, count: args[3], type: typo, effect: efct, created: new Date(), time: args[4] });
                await sex.save();
            } catch (error) {
                console.log(error);
            };
            await message.channel.send(new Discord.MessageEmbed().setDescription(`İzin başarıyla oluşturuldu!`));
        }

    }

}

module.exports = Kur;