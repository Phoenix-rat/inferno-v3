const { table } = require("table")
const Sicil = require("../../Datebase/Moderasyon/Sicil")
const moment = require("moment")
moment.locale("tr")

module.exports.execute = async (client, message, args) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })
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
                if (karebar.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                page += 1;
                let newList = table(karebar.slice(page == 1 ? 0 : page * 10 - 10, page * 10), config)
                question.edit(` ${member} kullanıcısının sicil bilgileri aşağıda belirtilmiştir. Tekli cezaya bakmak için \`.cezasorgu kullanıcıID cezaID\` yazınız. \`\`\`${newList}\`\`\``);
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
    message.react(client.emoji("okey")).catch(() => { })


}
exports.conf = {
    command: "sicil",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["sicil"],
    timeout: 7000,
    cmdPerms: ["cmdTekHac", "cmdCiftHac", "cdmCeo", "cmdOwner"]
}
/*
    data.sicil.map(st => {
        karebar.push([st.cno, st.type, `${moment(st.basla).format("LLL")}`, client.users.cache.get(st.auth).tag, `${st.reason ? st.reason : "Belirtilmedi"}`])
    })

    let cezadb = table(karebar.slice(0, 15), config)

    message.channel.send(`🚫 ${member} kullanıcısının ceza bilgileri aşşağıda belirtilmiştir. Tekli cezaya bakmak için \`.ceza ID\` yazınız. \`\`\`${cezadb}\`\`\``)
*/
