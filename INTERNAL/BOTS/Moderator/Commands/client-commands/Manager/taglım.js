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


        const embed = new Discord.MessageEmbed().setDescription(stripIndent`
        Merhaba ${mentioned}!
        ${message.member} sana tag aldırdığını iddia ediyor, bu doğru mu?
        `);
        try {
            var embedMsg = await message.channel.send(embed);
            await embedMsg.react("✔️");
            await embedMsg.react("❌");
        } catch (error) {
            console.error(error);
        }
        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = embedMsg.createReactionCollector(filter, {
            time: 120000
        });
        collector.on("collect", async (reaction, user) => {
            if (user.id !== mentioned.user.id) return reaction.users.remove(user);
            switch (reaction.emoji.name) {
                case "✔️":
                    await Tagli.updateOne({ _id: mentioned.user.id }, { $set: { claimed: message.author.id } });
                    collector.stop("accepted");
                    await embedMsg.edit(cagirembed.setDescription(`Ailemizi büyülttüğün için teşekkürler ${message.member}!`));
                    break;
                case "❌":
                    await embedMsg.edit(cagirembed.setDescription(`İddia reddedildi ${message.member}.`));
                    collector.stop("denied");
                    break;
                default:
                    break;
            }
        });
        collector.on("end", async () => {
            await embedMsg.reactions.removeAll();
            await embedMsg.edit(cagirembed.setDescription(`${message.member} kullanıcısı başarıyla ${mentioned} kullanıcısının olduğu **${kanal.name}** isimli kanala taşınmıştır.`).setThumbnail(message.guild.iconURL()));
        });


        await Tagli.updateOne({ _id: mentioned.user.id }, { claimed: true });





    }

}

module.exports = CountByRole;