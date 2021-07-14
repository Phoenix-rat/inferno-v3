const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const Points_profile = require('../../../../../MODELS/Economy/Points_profile');
const Points_config = require('../../../../../MODELS/Economy/Points_config');
const { checkHours } = require('../../../../../HELPERS/functions');
class Say extends Command {

    constructor(client) {
        super(client, {
            name: "puanım",
            description: "Puan bilgisini verir..",
            usage: "puanım",
            examples: ["puanım"],
            category: "Genel",
            accaptedPerms: ["cmd-registry", "cmd-double", "cmd-single", "cmd-ceo"],
            cooldown: 10000,
            onTest: true
        });
    }

    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const roles = await low(client.adapters('roles'));

        function bar(point, maxPoint) {
            const deger = Math.trunc(point * 5 / maxPoint);
            let str = "";
            for (let index = 2; index < 4; index++) {
                if ((deger / index) >= 1) {
                    str = str + emojis.get("ortabar_dolu").value()
                } else {
                    str = str + emojis.get("ortabar").value()
                }
            }
            if (deger === 0) {
                str = `${emojis.get("solbar").value()}${str}${emojis.get("sagbar").value()}`
            } else if (deger === 5) {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar_dolu").value()}`
            } else {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar").value()}`
            }
            return str;
        }

        const pointData = await Points_profile.findOne({ _id: message.author.id });
        const pointConfig = await Points_config.findOne({ _id: pointData.role });
        const myRole = message.guild.roles.cache.get(pointData.role);
        const nextRole = message.guild.roles.cache
            .filter(r => r.rawPosition >= myRole.rawPosition)
            .filter(r => r.hoist)
            .filter(r => r.id !== roles.get("booster").value())
            .sort((a, b) => a.rawPosition - b.rawPosition).array().find(role => role.rawPosition > myRole.rawPosition);
        await message.channel.send(new Discord.MessageEmbed().setDescription(stripIndent`
        **Dante's INFEЯИO** puan bilgileri
        ${message.member} kullanıcısının puan bilgileri
        Yetkisi: ${myRole}
        ●▬▬▬▬▬▬▬▬▬▬●
        Toplam Puan: \`${pointData.msgPoints + pointData.points.map(plog => plog.point).reduce((a, b) => a + b, 0)}\`
        Kayıt Puanı: \`${pointData.points.filter(plog => plog.type === "registry").map(plog => plog.point).reduce((a, b) => a + b, 0)}\`
        Mesaj Puanı: \`${pointData.msgPoints}\`
        Davet Puanı: \`${pointData.points.filter(plog => plog.type === "invite").map(plog => plog.point).reduce((a, b) => a + b, 0)}\`
        Taglı Puanı: \`${pointData.points.filter(plog => plog.type === "tagged").map(plog => plog.point).reduce((a, b) => a + b, 0)}\`
        Yetkili Alım Puanı: \`${pointData.points.filter(plog => plog.type === "authorized").map(plog => plog.point).reduce((a, b) => a + b, 0)}\`
        Public Puanı: \`${pointData.points.filter(plog => plog.type === "voice-public").map(plog => plog.point).reduce((a, b) => a + b, 0)}\`
        Diğer Ses Puanı: \`${pointData.points.filter(plog => plog.type === "voice-other").map(plog => plog.point).reduce((a, b) => a + b, 0)}\`
        Bonus Puan: \`${pointData.points.filter(plog => plog.type === "bonus").map(plog => plog.point).reduce((a, b) => a + b, 0)}\`
        ●▬▬▬▬▬▬▬▬▬▬●
        ${nextRole} rolüne yükselmek için ${pointConfig.expiringHours - checkHours(pointData.created)} saatin var!
        `).setColor('#7bf3e3'));
    }
}

module.exports = Say;