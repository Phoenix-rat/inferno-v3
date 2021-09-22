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
        await member.roles.add(roles.get("prisoner").value());
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
        const embed = new Discord.MessageEmbed().setDescription(stripIndents`
        **${member.user.tag}** (\`${member.user.id}\`) adlı kullanıcı sunucuda ${type.toLowerCase() === "temp" ? "Süreli" : "Kalıcı"} olarak cezalandırıldı! 
        \` • \` Cezalandıran yetkili: ${member.guild.members.cache.get(executor)} (\`${executor}\`)
        \` • \` Sebep: ${reason || "Yok"}
        \` • \` Cezalandırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setFooter(`Ceza Numarası: ${srID}`).setColor("RED");
        await member.guild.channels.cache.get(channels.get("log_jail").value()).send(embed);
    }
}

module.exports = JailEvent;