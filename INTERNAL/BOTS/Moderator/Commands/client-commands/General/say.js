const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
class Say extends Command {

    constructor(client) {
        super(client, {
            name: "say",
            description: "Sunucunun anlık bilgisini verir.",
            usage: "say",
            examples: ["say"],
            category: "Genel",
            accaptedPerms: ["cmd-registry", "cmd-all","cmd-manager","cmd-rhode","cmd-authority","cmd-staff"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const roles = await low(client.adapters('roles'));
        await message.channel.send(new Discord.MessageEmbed().setDescription(stripIndent`
        \`•\` Toplam üye: \`${message.guild.memberCount}\` (${message.guild.members.cache.filter(m => m.presence.status !== 'offline').size} online)
        \`•\` Booster sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("booster").value())).size}\` (${message.guild.premiumTier}. seviye)
        \`•\` Taglı sayısı: \`${message.guild.members.cache.filter(m => client.config.tag.some(tag => m.user.username.includes(tag)) || m.user.discriminator === client.config.dis).size}\` (${message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("cmd-crew").value())).size} yetkili)
        \`•\` Anlık ses: \`${message.guild.voiceStates.cache.filter(v => v.channel).size}\` (${message.guild.voiceStates.cache.filter(v => v.channel && (v.channel.parentID === channels.get("st_public").value())).size} public)
        `).setColor('#7bf3e3'));
    }
}

module.exports = Say;