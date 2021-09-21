const ChatMuted = require('../MODELS/Moderation/ChatMuted');
const low = require('lowdb');
const Punishments = require('../MODELS/StatUses/Punishments');
class PermaBanEvent {
    constructor(client) {
        this.client = client;
    };

    async run(member, executor, reason, duration) {
        const client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        await member.roles.add(roles.get("muted").value());
        const Ban = await ChatMuted.findOne({ _id: member.user.id });
        if (!Ban) {
            let pban = new ChatMuted({
                _id: member.user.id,
                executor: executor,
                reason: reason,
                duration: Number(duration) || 0,
                created: new Date()
            });
            await pban.save();
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
        client.extention.emit('Record', member.user.id, executor, reason, "C-Mute", "temp", duration, srID);
        const embed = new Discord.MessageEmbed().setDescription(stripIndents`
        **Susturan:** ${guild.members.cache.get(executor)} (\`${executor}\`)
        **Susturulan:** ${member} (\`${member.user.id}\`)
        **Sebep:** ${reason || "Yok"}
        **Süre:** ${type === "perma" ? "Sınırsız" : `${duration} dakika`}
        `).setFooter(`Ceza Numarası: ${srID}`);
        await guild.channels.cache.get(channels.get("log_cmute").value()).send(embed);
    }
}
module.exports = PermaBanEvent;
