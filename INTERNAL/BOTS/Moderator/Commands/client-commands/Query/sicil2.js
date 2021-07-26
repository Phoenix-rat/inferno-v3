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
        
        const whathefuck = ((await sicil.find({ _id: mentionedID })) || []).reverse();
        if (!whathefuck.length) return message.channel.send("Belirttilen kişinin verisi bulunmamaktadır.");

        const embed = new Discord.MessageEmbed().setDescription(([
                whathefuck.length > 15 ? `Belirttiğim kişinin toplam ${whathefuck.length} cezası var.\n` : 
                `${message.guild.members.cache.get(mentionedID) || `Sunucuda değil (${mentionedID})`} kullanıcısının sicili;\n`,
                 whathefuck.map((punish) =>`\`${moment(punish.start).format("LLL")}\` tarihinde 
                 ${message.guild.members.cache.get(punish.executor) || "Bilinmiyor"} tarafından **${punish.reason}** sebebiyle cezalandırılmış. (**${punish.punish}**)`)
                 .slice(0, 15).join("\n"),])
        );
        message.channel.send(embed);
    }
}
module.exports = Sicil;