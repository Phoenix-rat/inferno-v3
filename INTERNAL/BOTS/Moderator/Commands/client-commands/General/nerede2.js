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
        
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('BLACK'));
        if (!mentioned.voice.channelID) return message.channel.send(new Discord.MessageEmbed().setDescription(`${mentioned} kişisi herhangi bir ses kanalında değil!`)).then(x => x.delete({ timeout: 10000 }));

        let whereinfo = `• Mikrofonu: ${mentioned.voice.mute ? `Kapalı` : `Açık`} \n• Kulaklığı: ${mentioned.voice.deaf ? `Kapalı` : `Açık`}`
        let wherechannel = `${mentioned.voice.channel} (\`${mentioned.voice.channel.members.size}/${mentioned.voice.channel.userLimit}\`)`;
        
        const embed = new Discord.MessageEmbed().setColor(mentioned.displayHexColor).setTimestamp().setFooter(`• Kahve sizi seviyor 🌟`).setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }));
        const neredembed = embed.setDescription(`
        ${mentioned} kişisi ${wherechannel} kanalında.
         ** • Ses Biglileri:**
        \`\`\`${whereinfo}\`\`\` 
        **• Kanala gitmek için ${mentioned.voice.channel} kanalına tıklaya bilirsin.**`)
        await message.channel.send(neredembed).then(msg => msg.delete({ timeout: 10000 }));
    }
}

module.exports = Where;