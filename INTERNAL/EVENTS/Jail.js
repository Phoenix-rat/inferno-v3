const Jails = require('../MODELS/Moderation/Jails');
const low = require('lowdb');
const Punishments = require('../MODELS/StatUses/Punishments');
const Discord = require('discord.js');
const moment = require("moment");
const { stripIndents } = require('common-tags');
moment.locale("tr");
class JailEvent {
    constructor(client) {
        this.client = client;
    };

    async run(member, executor, reason, type, duration) {
        const client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const memberRoles = member.roles.cache.filter(r => r.id !== roles.get("booster").value()).filter(r => r.editable).array();
        await member.roles.remove(memberRoles);
        if (reason !== "REKLAM") {
            await member.roles.add(roles.get("prisoner").value());
        } else {
            await member.roles.add(roles.get("reklamcı").value());
        }
        let deletedRoles = await memberRoles.map(r => r.name);
        const Jail = await Jails.findOne({ _id: member.user.id });
        if (!Jail) {
            let pjail = new Jails({
                _id: member.user.id,
                executor: executor,
                reason: reason,
                roles: deletedRoles,
                type: type,
                duration: Number(duration) || 0,
                created: new Date()
            });
            await pjail.save();
        } else {
            await Jails.updateOne({ _id: member.user.id }, { $inc: { duration: Number(duration) || 0 } });
        }
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
        client.extention.emit('Record', member.user.id, executor, reason, "Jail", type, duration, srID);
        if (reason === "REKLAM") return member.guild.channels.cache.get(channels.get("log_reklam").value()).send(new Discord.MessageEmbed().setDescription(stripIndents`
        **${member.user.tag}** (\`${member.user.id}\`) adlı kullanıcının \`reklamcı\` olduğu tespit edildi!
        \` • \` Cezalandıran yetkili: ${member.guild.members.cache.get(executor)} (\`${executor}\`)
        \` • \` Sebep: \`${reason || "Yok"}\`
        \` • \` Cezalandırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setColor("#ff0000"));
        const embed = new Discord.MessageEmbed().setDescription(stripIndents`
        **${member.user.tag}** (\`${member.user.id}\`) adlı kullanıcı \`${type.toLowerCase() === "temp" ? "süreli" : "kalıcı"}\` cezalandırıldı! 
        \` • \` Cezalandıran yetkili: ${member.guild.members.cache.get(executor)} (\`${executor}\`)
        \` • \` Sebep: \`${reason || "Yok"}\`${type === "temp" ? `
        \` • \` Süre: \`${duration} Gün\``: ""}
        \` • \` Cezalandırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`${type === "temp" ? `
        \` • \` Bitiş Tarihi: \`${moment(new Date().getTime() + duration * 86400000).format("LLL")}\``: ""}
        `).setFooter(`Ceza Numarası: ${srID}`).setColor("RED");
        await member.guild.channels.cache.get(channels.get("log_jail").value()).send(embed);
    }
}

module.exports = JailEvent;