const { MessageEmbed } = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const { rain } = require("../../../../../HELPERS/functions");
class ekipsay extends Command {

    constructor(client) {
        super(client, {
            name: "ekip",
            description: "Ekiptekileri sayar.",
            usage: "ekip",
            examples: ["ekip"],
            category: "Yetkili",
            aliases: ["ekip"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],

        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let embed = new MessageEmbed().setColor("#000000").setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setFooter(`Stark 🌹 ❤ † INFEЯИO`, `${message.author.avatarURL({ dynamic: true }) || message.guild.iconURL({ dynamic: true })}`)
        let ekipbir = message.guild.roles.cache.get("870076552610717706")
        let ekipiki = message.guild.roles.cache.get("871446895665491978")

        embed.setDescription(stripIndent`
        Aşşağıda sunucuda ekiplerin bilgileri verilmiştir. (Bilgiler değişiklik gösterebilir.)
        
        • Toplam ekip sayısı: \`2\`
        • Toplam ekip üyesi: \`${ekipbir.members.size + ekipiki.members.size}\`
        • Toplam ekip çevrimiçi üye: \`${ekipbir.members.filter(a => a.presence.status !== 'offline').size + ekipiki.members.filter(a => a.presence.status !== 'offline').size}\`
        • Toplam ekip Çevrimdışı üye: \`${ekipbir.members.filter(a => a.presence.status !== 'offline').size + ekipiki.members.filter(a => a.presence.status == 'offline').size}\`
        • Toplam ekip sesteki üye: \`${ekipbir.members.filter(a => a.voice.channel).size + ekipiki.members.filter(a => a.voice.channel).size}\`
        • Toplam ekip seste olmayan üye: \`${ekipbir.members.filter(a => a.presence.status !== 'offline' && !a.voice.channel).size + ekipiki.members.filter(a => a.presence.status !== 'offline' && !a.voice.channel).size}\`

        ─────────────────────
        <@&870076552610717706> **Ekibinin Bilgileri**;
        
        • **Ekip Sahibi:** <@!347486448121020423>
        • **Toplam üye:** \`${ekipbir.members.size}\`
        • **Çevrimiçi üye:** \`${ekipbir.members.filter(a => a.presence.status !== 'offline').size}\`
        • **Çevrimdışı üye:** \`${ekipbir.members.filter(a => a.presence.status == 'offline').size}\`
        • **Sesteki üye:** \`${ekipbir.members.filter(a => a.voice.channel).size}\`
        • **Seste olmayan üye:** \`${ekipbir.members.filter(a => a.presence.status !== 'offline' && !a.voice.channel).size}\`
        ─────────────────────

        <@&870076552610717706> **Ekibinin Bilgileri**;
        
        • **Ekip Sahibi:** <@!760162970793410580>
        • **Toplam üye:** \`${ekipiki.members.size}\`
        • **Çevrimiçi üye:** \`${ekipiki.members.filter(a => a.presence.status !== 'offline').size}\`
        • **Çevrimdışı üye:** \`${ekipiki.members.filter(a => a.presence.status == 'offline').size}\`
        • **Sesteki üye:** \`${ekipiki.members.filter(a => a.voice.channel).size}\`
        • **Seste olmayan üye:** \`${ekipiki.members.filter(a => a.presence.status !== 'offline' && !a.voice.channel).size}\``)

        message.channel.send(embed)
    }
}
module.exports = ekipsay;