const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const sicil = require('../../../../../MODELS/StatUses/Punishments');
const stringTable = require('string-table');
const { checkDays, sayi } = require('../../../../../HELPERS/functions');
const { stripIndent } = require("common-tags");
const moment = require("moment")
moment.locale('tr')
class Sicil extends Command {

    constructor(client) {
        super(client, {
            name: "sicil",
            description: "Bir üyenin dosyalarını açar",
            usage: "sicil etiket/id sayfa-numara",
            examples: ["sicil 674565119161794560 2-1"],
            category: "Sorgu",
            aliases: [],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],
            cooldown: 60000,
        });
    }

    async run(client, message, args) {
        let mentionedID = message.mentions.members.first() ? message.mentions.members.first().user.id : args[0] || message.member.user.id;
        const doc = await sicil.findOne({ _id: mentionedID });
        if (!doc) return message.channel.send("Veri bulunamadı!");
        let sth;
        if (args[1] && args[1].includes('-')) {
            sth = args[1].split('-')[1];
            args[1] = args[1].split('-')[0];
        }
        if (!args[1]) args[1] = 1;
        const scl = await doc.get("records").reverse().slice(20 * (args[1] - 1), 20 * args[1]);
        let asdf = [];
        for (let index = 0; index < scl.length; index++) {
            const element = scl[index];
            const shem = {
                ID: index + 1,
                Ceza: `${element.punish}`,
                Sebep: `${element.reason}`,
                Gün: `${moment(element.created).format("LLL")}`
            };
            asdf.push(shem);
        }
        const embeddoc = stringTable.create(asdf, {
            headers: ['ID', 'Ceza', 'Sebep', 'Gün']
        });

        const ecrin = scl[sth - 1];
        const ecrinim = new Discord.MessageEmbed() .setDescription(stripIndent`
        **Tür:** \`${ecrin.punish} - ${ecrin.type}\`
        **Sebep:**  \`${ecrin.reason}\`
        **Sorumlu:**  ${message.guild.members.cache.get(ecrin.executor) || "Bilinmiyor"}
        **Zaman:** \`${checkDays(ecrin.created)} gün önce\`
        **Süre:** \`${ecrin.duration}\`
        `).setTitle("† INFEЯИO EMNIYET");
        message.channel.send(ecrinim);
    }

}
module.exports = Sicil;