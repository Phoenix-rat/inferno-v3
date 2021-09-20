const { MessageEmbed } = require("discord.js")
const rol_log = require("../../Datebase/Rollog.js")
const moment = require("moment")
moment.locale("tr")
module.exports.execute = async (client, message, args) => {
    const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member
    if (!member) return message.react(client.emoji("okey"));
    let rolelogs = await rol_log.findOne({ _id: member.id }).exec();

    if (!rolelogs || rolelogs.length) return message.channel.send(`${client.emoji("red")} Kullanıcının verisi bulunamadı.`)
    //    staffID: rolveren.executor.id, tarih: new Date.now(), rolid: role.id, type: aldiverdi
    const liste = rolelogs.rolveridb.map(a => `${client.emojis.cache.get(a.type)} Rol: <@&${a.rolid}> Yetkili: <@!${a.staffID}> \n**Tarih:** \`${moment(a.tarih).format("lll")}\` \n**─────────────────**`).reverse();
    let page = 1;
    const embed = new MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor("RANDOM");
    const question = await message.channel.send(
        embed.setDescription(`${member} kişisinin toplamda **${liste.length}** rol bilgisi bulunmakta son 10 rolün bilgileri aşağıda belirtilmiştir. \n\n${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n")}`)
    );

    if (rolelogs && rolelogs.rolveridb.length > 10) {
        question.react("◀").catch(() => { })
        question.react("❌").catch(() => { })
        question.react("▶").catch(() => { })

        const collector = question.createReactionCollector(
            (react, user) => ["◀", "❌", "▶"].some((e) => e == react.emoji.name) && user.id == message.author.id,
            { time: 120000 }
        );

        collector.on("collect", async (react) => {
            await react.users.remove(message.author.id).catch(() => undefined);
            if (react.emoji.name == "▶") {
                if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                page += 1;
                let newList = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                question.edit(embed.setDescription(`${member} kişisinin toplamda ${liste.length} rol bilgisi bulunmakta son 10 rolün bilgileri aşağıda belirtilmiştir. \n\n${newList}`));
            }
            if (react.emoji.name == "❌") {
                question.delete()
            }
            if (react.emoji.name == "◀") {
                if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                page -= 1;
                let newList = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                question.edit(embed.setDescription(`${member} kişisinin toplamda ${liste.length} rol bilgisi bulunmakta son 10 rolün bilgileri aşağıda belirtilmiştir. \n\n${newList}`));
            }
        });
    }

}

exports.conf = {
    command: "rollog",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["rollog"],
    timeout: "7000",
cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner"]
}
