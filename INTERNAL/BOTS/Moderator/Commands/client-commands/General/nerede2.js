const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
class Where extends Command {

    constructor(client) {
        super(client, {
            name: "tnerede",
            description: "etiketlenen kişinin nerede olduğunu gösterir",
            usage: "tnerede id/etiket",
            examples: ["tnerede 674565119161794560"],
            aliases: ["tbul", "tn"],
            category: "Genel",
            cooldown: 300000
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed().setColor(mentioned.displayHexColor).setFooter(`Kahve seni seviyor <3`).setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        let desu = ``;
        let info = "";
        if (!mentioned.voice.channel) {
            desu = `Belirtilen kullanıcı hiçbir kanalda bulunmamaktadır.`;
        } else {
            desu = `${mentioned.voice.channel} \`${mentioned.voice.channel.members.size}/${mentioned.voice.channel.userLimit}\``;
            info = stripIndent`
            Kulaklığı ${mentioned.voice.selfDeaf ? "kapalı" : "açık"}
            Mikrofonu ${mentioned.voice.selfMute ? "kapalı" : "açık"}
            `
        }
        let lmc = message.guild.channels.cache.get(mentioned.lastMessageChannelID);
        if (!lmc) lmc = `En son Mesaj yazdığı kanal bulunamadı`;
       
        const neredembed = embed.setDescription(`
        ${mentioned} kişisi **${desu}** kanalında. Kanala gitmek için ${mentioned.voice.channel}'a tıklaya bilirsin.
        \`\`\`Ses Biglileri: ${info}\`\`\` 
        **${lmc} en son mesaj yazdığı kanal**`)
        await message.channel.send(neredembed).then(msg => msg.delete({ timeout: 8000 }));
    }
}

module.exports = Where;