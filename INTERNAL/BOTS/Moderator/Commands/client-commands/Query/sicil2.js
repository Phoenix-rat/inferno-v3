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
            name: "sicil2",
            description: "Bir üyenin dosyalarını açar",
            usage: "sicil2 etiket/id sayfa-numara",
            examples: ["sicil2 674565119161794560 2-1"],
            category: "Sorgu",
            aliases: ["s31"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],
            cooldown: 60000,
        });
    }

    async run(client, message, args) {
        let mentionedID = message.mentions.members.first() ? message.mentions.members.first().user.id : args[0] || message.member.user.id;
        
        const whathefuck = await sicil.findOne({ _id: mentionedID });
        if (!whathefuck) return message.channel.send("Dosya bulunamadı!");
        let sth;
        if (args[1] && args[1].includes('-')) {
            sth = args[1].split('-')[1];
            args[1] = args[1].split('-')[0];
        }
        if (!args[1]) args[1] = 1;
        const scl = await whathefuck.get("records");
        
        const embed = new Discord.MessageEmbed().setThumbnail(message.guild.iconURL({ dynamic: true })).setTimestamp().setFooter(`• Adam ol ceza yeme -Kahve 🌟`).setTitle("† Dante's INFEЯИO").setColor("BLACK").setDescription(([`${message.guild.members.cache.get(mentionedID) || `Sunucuda değil (${mentionedID})`} kullanıcısının ceza geçmişi.\n`,
                scl.map((punish) =>`• \`${moment(punish.created).format("LLL")}\` tarihinde ${message.guild.members.cache.get(punish.executor) || "Bilinmiyor"} tarafından \`"${punish.reason}"\` sebebiyle cezalandırılmış. (\`${punish.punish}\`)`)
                 .slice(0, 15).join("\n───────────────────\n"),])
        );
        message.channel.send(embed);
    }
}
module.exports = Sicil;