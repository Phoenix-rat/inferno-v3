const BanS = require('../MODELS/Moderation/Ban');
const low = require('lowdb');
const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const moment = require("moment");
moment.locale("tr");
const Punishments = require('../MODELS/StatUses/Punishments');
class PermaBanEvent {
    constructor(client) {
        this.client = client;
    };

    async run(guild, user, executor, reason) {
        const client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (!guild.members.cache.get(user.id).bannable) return;
        const allthedata = await Punishments.find();
        let alltherecords = 0;
        allthedata.forEach(d => alltherecords = alltherecords + d.records.length);
        function altilik(value) {
            let number = value.toString();
            while (number.length < 6) {
                number = "0" + number
            }
            return number;
        }
        const srID = altilik(alltherecords);
        try {
            await user.send(`**${guild.name}** sunucusundan \`${reason}\` sebebiyle <@${executor}> (\`${executor}\`) tarafından yasaklandın! \`${srID}\``);
        } catch (e) {
            console.log(e);
        }
        await guild.members.ban(user, { reason: reason });
        const Ban = await BanS.findOne({ _id: user });
        if (!Ban) {
            let pban = new BanS({
                _id: user.id,
                userTag: user.tag,
                executor: executor,
                reason: reason,
                created: new Date()
            });
            await pban.save();
        }
        client.extention.emit('Record', user.id, executor, reason, "Ban", "Perma", 0, srID);
        const embed = new Discord.MessageEmbed().setDescription(stripIndents`
        **${user.tag}** (\`${user.id}\`) adlı kullanıcı sunucudan yasaklandı! 
        \` • \` Yasaklayan : ${guild.members.cache.get(executor)} (\`${executor}\`)
        \` • \` Sebep: \`${reason || "Yok"}\`
        \` • \` Yasaklanma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setColor("BLACK").setFooter(`Ceza Numarası: ${srID}`);
        await guild.channels.cache.get(channels.get("log_ban").value()).send(embed);
    }
}
module.exports = PermaBanEvent;
