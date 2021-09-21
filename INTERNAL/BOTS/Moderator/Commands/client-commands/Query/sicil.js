const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const sicil = require('../../../../../MODELS/StatUses/Punishments');
const stringTable = require('string-table');
const { checkDays, sayi } = require('../../../../../HELPERS/functions');
const { stripIndent } = require("common-tags");
const { table } = require("table");
const moment = require("moment");
moment.locale("tr");

class Sicil extends Command {

    constructor(client) {
        super(client, {
            name: "sicil",
            description: "Belirtilen üyenin ceza geçmişini görüntüler",
            usage: "sicil @fero/ID ",
            examples: ["sicil @fero/ID"],
            category: "Sorgu",
            aliases: ["sorgu","cezalar"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],
            cooldown: 60000,
        });
    }

    async run(client, message, args) {
        
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("error"));
    let data = await Sicil.find({ member: member.id })
    if (!data) return message.channel.send(`${member} kullanıcısının sicil verisi bulunamadı.`)

    let config = {
        border: {
            bodyLeft: ``,
            bodyRight: ``,
            bodyJoin: `│`,

            bottomJoin: '',
            bottomLeft: '',
            bottomRight: '',
            bottomBody: '',


            joinJoin: '',
            joinLeft: '',
            joinRight: '',
            joinBody: '',

            topBody: '',
            topJoin: '',
            topLeft: '',
            topRight: '',
        }
    };

    let karebar = [
        ["ID", "Ceza", "Tarih", "Yetkili", "Sebep"]
    ];

    const liste = data.map(st => { karebar.push([st.cno, st.type, `${moment(st.basla).format("LLL")}`, client.users.cache.get(st.auth).tag, `${st.reason ? st.reason : "Belirtilmedi"}`]) })
    let page = 1;
    const question = await message.channel.send(` ${member} kullanıcısının sicil bilgileri aşağıda belirtilmiştir. Tekli cezaya bakmak için \`.cezasorgu ID\` yazınız. \`\`\`${table(karebar.slice(page == 1 ? 0 : page * 10 - 10, page * 10), config)}\`\`\``)


    if (data && data.length > 10) {
        question.react("◀");
        question.react("❌");
        question.react("▶");

        const collector = question.createReactionCollector(
            (react, user) => ["◀", "❌", "▶"].some((e) => e == react.emoji.name) && user.id == message.author.id,
            { time: 120000 }
        );

        collector.on("collect", async (react) => {
            await react.users.remove(message.author.id).catch(() => undefined);
            if (react.emoji.name == "▶") {
                if (karebar.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                page += 1;
                let newList = table(karebar.slice(page == 1 ? 0 : page * 10 - 10, page * 10), config)
                question.edit(` ${member} kullanıcısının sicil bilgileri aşağıda belirtilmiştir. Tekli cezaya bakmak için \`.cezasorgu ID\` yazınız. \`\`\`${newList}\`\`\``);
            }
            if (react.emoji.name == "❌") {
                question.delete()
            }
            if (react.emoji.name == "◀") {
                if (karebar.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                page -= 1;
                let newList = table(karebar.slice(page == 1 ? 0 : page * 10 - 10, page * 10), config)
                question.edit(` ${member} kullanıcısının sicil bilgileri aşağıda belirtilmiştir. Tekli cezaya bakmak için \`.cezasorgu ID\` yazınız. \`\`\`${newList}\`\`\``);
            }
        });
    }
    message.react(client.emoji("ok"));

    }
}
module.exports = Sicil;