let { MessageEmbed } = require("discord.js")
const emojis = require("../../../../Settings/emojis")
module.exports.execute = async (client, message, args) => {
    let tag = args[0];
    if (!tag) return message.react(client.emoji("red")).catch(() => { });
    let tty = 'fero';
    if (tag.includes('#')) tty = 'dis'
    let tagsayi = tty === 'fero' ? message.guild.members.cache.filter(m => m.user.username.includes(tag)).size : message.guild.members.cache.filter(a => a.user.discriminator == tag).size;

    if (tagsayi == 0) return message.inlineReply(`Belirtmiş olduğunuz tagın kullanıcısı yok.`, { allowedMentions: { repliedUser: false } }).catch(() => { })

    const filter = (reaction, user) => { return [`${client.emoji("soru").name}`].includes(reaction.emoji.name) && user.id === message.author.id; };

    message.channel.send(`**${tag}** tagında ki kullanıcı sayısı: \`${tagsayi}\``).then(amc => {

        amc.react(client.emoji("soru")).catch(() => { });
        amc.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
            .then(async (collected) => {
                const reaction = collected.first();
                if (reaction.emoji.name == client.emoji("soru").name) {
                    let rolesuyes = message.guild.members.cache.filter(a => a.user.username.includes(tag) || a.user.discriminator == tag).map(a => a).join("\n")
                    amc.edit(`**${tag}** tagında ki kullanıcı sayısı: ${tagsayi} \n${rolesuyes}`);
                    amc.reactions.cache.find(r => r.emoji.id === emojis.soru).remove().catch(() => { })
                    message.react(client.emoji("okey")).catch(() => { });
                }
            }).catch(async (collected) => {
                amc.reactions.cache.find(r => r.emoji.id === emojis.soru).remove().catch(() => { })
            });

    })
}
exports.conf = {
    command: "tagsay",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["tagsay", "tagsayi", "tagsayı"],
    timeout: "7000",
    cmdPerms: ["cmdOwner", "cmdGuard"]
}
