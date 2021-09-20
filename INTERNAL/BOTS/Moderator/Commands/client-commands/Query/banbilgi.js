const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { checkDays } = require('../../../../../HELPERS/functions');
const Bans = require('../../../../../MODELS/Moderation/Ban');
const { stripIndent } = require('common-tags');
class BanSorgu extends Command {
    constructor(client) {
        super(client, {
            name: "banbilgi",
            description: "Belirtilen kullanıcının banını sorgular",
            usage: "banbilgi etiket/id",
            examples: ["banbilgi 674565119161794560"],
            category: "Sorgu",
            aliases: ["bbilgi","baninfo"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-ban"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const banInfo = await message.guild.fetchBan(args[0]);
        if (!banInfo) return message.channel.send(new Discord.MessageEmbed().setColor("BLACK").setDescription(`${emojis.get("warn").value()} Belirtilen **ID*'ye sahip bir banlı kullanıcı bulunamadı.`));
        const banData = await Bans.findOne({ _id: args[0] });
        const embed = new Discord.MessageEmbed().setDescription(stripIndent`
        • Banlanan Kullanıcı: ${banInfo.user} (\`${banInfo.user.tag}\` - \`${banInfo.user.id}\`)
        • Banlanma sebebi: \`${banData ? banData.reason : "Sebeb Belirtilmemiş"}\`
        • Banlayan kullanıcı: ${message.guild.members.cache.get(banData ? banData.executor : "123") ? message.guild.members.cache.get(banData.executor) : `Sunucuda değil (${banData.executor})`}
        • Ban süresi: \`${banData ? banData.type : "Perma"}\`
        • Banın Açılacağı tarih: \`${banData && (banData.type === "temp") ? banData.duration - checkDays(banData.created) : "Açılmayacak"}\`
        `).setColor('BLACK').setTimestamp().setFooter(`• İkinici bir şans? -allah(?) 🌟`).setTitle("† Dante's INFEЯИO");
        await message.channel.send(embed).then(msg => msg.delete({ timeout: 13000 }));
        client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
    }
}
module.exports = BanSorgu;