const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const Entries = require('../../../../../MODELS/StatUses/voice_entires');
const Records = require('../../../../../MODELS/StatUses/VoiceRecords');
class Nerede extends Command {

    constructor(client) {
        super(client, {
            name: "nerede",
            description: "etiketlenen kişinin nerede olduğunu gösterir.",
            usage: "nerede @Tantoony/ID",
            examples: ["nerede @Tantoony/ID"],
            aliases: ["bul", "n", "nerde"],
            category: "Genel",
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('BLACK'));
        if (!mentioned.voice.channelID) return message.channel.send(new Discord.MessageEmbed().setDescription(`${mentioned} kişisi herhangi bir ses kanalında değil!`)).then(x => x.delete({ timeout: 10000 }));
        /*
        let whereinfo = `• Mikrofonu: ${mentioned.voice.mute ? `Kapalı` : `Açık`} \n• Kulaklığı: ${mentioned.voice.deaf ? `Kapalı` : `Açık`}`
        let wherechannel = `${mentioned.voice.channel} (\`${mentioned.voice.channel.members.size}/${mentioned.voice.channel.userLimit}\`)`;
        
        const embed = new Discord.MessageEmbed().setColor(mentioned.displayHexColor).setTimestamp().setFooter(`• Tantoony sizi seviyor 🌟`).setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }));
        const neredembed = embed.setDescription(`
        ${mentioned} kişisi ${wherechannel} kanalında.
         ** • Ses Biglileri:**
        \`\`\`${whereinfo}\`\`\`
        **• Kanala gitmek için ${mentioned.voice.channel} kanalına tıklaya bilirsin.**`)
        await message.channel.send(neredembed).then(msg => msg.delete({ timeout: 10000 }));
        */
        const embed = new Discord.MessageEmbed().setColor("#000000");
        const entry = await Entries.findOne({ _id: mentioned.id });
        const record = await Records.findOne({ _id: mentioned.id });
        const lastRecords = record.records.sort((a, b) => b.enter.getTime() - a.enter.getTime());
        const durRecords = lastRecords.filter(r => r.channelID === lastRecords[0].channelID);
        if (!entry) return;
        let sorgu;
        if (!data) sorgu = `${mentioned}, ${mentioned.voice.channel} kanalında. \n \` • \` Mikrofon **:** ${mentioned.voice.mute ? `${client.emoji("offmic")}` : `${client.emoji("onmic")}`} \n \` • \` Kulaklık **:** ${mentioned.voice.deaf ? `:mute:` : `:loud_sound:`}`
        if (data) sorgu = `${mentioned} kullanıcısı **${client.günsaat(Date.now(), data.time)}** ${mentioned.voice.channel} kanalında. \n \` • \` Mikrofon **:** ${mentioned.voice.mute ? `${client.emoji("offmic")}` : `${client.emoji("onmic")}`} \n \` • \` Kulaklık **:** ${mentioned.voice.deaf ? `:mute:` : `:loud_sound:`}`
        let kembed = embed.setDescription(sorgu)
        message.inlineReply({ embed: kembed, allowedMentions: { repliedUser: false } });
    }
}

module.exports = Nerede;