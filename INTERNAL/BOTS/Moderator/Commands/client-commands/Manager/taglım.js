const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const Tagli = require("../../../../../MODELS/Datalake/Tagli");
const { checkSecs } = require("../../../../../HELPERS/functions");
const { stripIndent } = require("common-tags");

class CountByRole extends Command {

    constructor(client) {
        super(client, {
            name: "rolsay",
            description: "belirtilen roldeki kişileri etiketler",
            usage: "rolsay rolid",
            examples: ["rolsay 718265023750996028"],
            cooldown: 3600000,
            category: "Yetkili",
            accaptedPerms: ["cmd-crew"]
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        if (mentioned.user.id === message.member.user.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("pando1").value()} Kendi kendini etiketleme..`).setColor('#2f3136'));
        const TagData = await Tagli.findOne({ _id: mentioned.user.id, claimed: "false" });
        if (!TagData || checkSecs(TagData.created) > 300) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} En erken 5 dakika öncesine kadar tag almış biri için bu komutu kuanabilirsin!`));
        await message.react(emojis.get("loading").value().split(':')[2].replace('>', ''));
        const filter = (msg) => msg.author.id !== client.user.id;
        const collector = new Discord.MessageCollector(embedMsg.channel, filter, {
            time: 300000
        });
        collector.on("collect", async (msg) => {
            if (msg.content === 'onay') return collector.stop("finished");
        });
        collector.on("end", async (collected, reason) => {
            if (reason === "finished") {
                await Tagli.updateOne({ _id: mentioned.user.id }, { $set: { claimed: message.author.id } });
                return;
            }

        });


    }

}

module.exports = CountByRole;