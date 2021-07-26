const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndents } = require('common-tags');
const { checkDays, rain } = require('../../../../../HELPERS/functions');
const moment = require("moment")
moment.locale('tr');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "serverinfo",
            description: "Botun durumunu gösterir",
            usage: "serverinfo",
            examples: ["serverinfo"],
            category: "Genel",
            aliases: ["server"],
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const embed = new Discord.MessageEmbed().setDescription(stripIndents`
        • Sunucunun adı: **${message.guild.name}**
        • Sunucunun ID'si: \`${message.guild.id}\`
        • Açılma Tarihi: \`${moment(message.guild.createdAt).format("LLL")}\`
        • Taç sahibi: "\`${message.guild.owner.user.username}\`"
        ───────────────────
        • Rol sayısı: \`${message.guild.roles.cache.size}\`
        • Kanal sayısı: \`${message.guild.channels.cache.size}\`
        • Emoji sayısı: \`${message.guild.emojis.cache.size}\`
        ───────────────────
        • Toplam üye sayısı: \`${message.guild.memberCount}\`
        • Çevrimiçi üye sayısı: \`${message.guild.members.cache.filter(m => m.presence.status !== 'offline').size}\`
        • Yetkili üye sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("cmd-registry").value())).size}\`
        ───────────────────
        • Booster üye sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("booster").value())).size}\`
        • Taglı üye sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("crew").value())).size}\`
        • Erkek üye sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has("854162987619057665")).size}\`
        • Kadın üye sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has("854162990534623233")).size}\`
        ───────────────────
        • Cezalı üye sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("prisoner").value())).size}\`
        • Kayıtsız üye sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("welcome").value())).size}\`
        `);
        await message.channel.send(embed.setColor('BLACK').setThumbnail(message.guild.iconURL({ dynamic: true })).setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }), "https://tantoony.net/"));
    }
}

module.exports = Call;