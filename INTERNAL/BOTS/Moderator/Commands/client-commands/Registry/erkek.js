const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
const nameData = require('../../../../../MODELS/Datalake/Registered');
const { sayi } = require('../../../../../HELPERS/functions');
class Erkek extends Command {
    constructor(client) {

        super(client, {
            name: "erkek",
            description: "Kayıtsız bir üyeyi erkek olarak kayıt eder",
            usage: "erkek etiket/id",
            examples: ["erkek 674565119161794560"],
            category: "Kayıt",
            aliases: ["e"],
            cmdChannel: "exe-registry",
            accaptedPerms: ["cmd-registry", "cmd-all", "cmd-manager", "cmd-rhode", "cmd-authority", "cmd-staff"],
            cooldown: 1000
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        if (!mentioned.roles.cache.has(roles.get("welcome").value()) && (mentioned.roles.cache.size > 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Sanırım bu üye zaten kayıtlı!`));
        if (utils.get("taglıalım").value() && !mentioned.user.username.includes(client.config.tag)) {
            if (!mentioned.roles.cache.has(roles.get("th-vip").value()) && !mentioned.roles.cache.has(roles.get("th-booster").value())) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`Üzgünüm, ama henüz taglı alımdayız. ${mentioned} kullanıcısında vip veya booster rolü olmadığı koşulda onu içeri alamam..`)
                );
            }
        }
        let ism = mentioned.displayName.split(" ").slice(1).join(" ");
        let yaş = ism.split(" | ")[1];
        let isim = ism.split(" | ")[0];
        if (!sayi(yaş)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Geçerli bir yaş girmelisin!`));
        const age = Number(yaş);
        await mentioned.roles.add(roles.get("Male").value().concat(roles.get("member").value()));
        await mentioned.roles.remove(roles.get("welcome").value());
        if (client.config.tag.some(tag => mentioned.user.username.includes(tag))) {
            await mentioned.roles.add(roles.get("crew").value());
        }
        const registry = await nameData.findOne({ _id: mentioned.user.id });
        if (!registry) {
            const data = new nameData({
                _id: mentioned.user.id,
                executor: message.member.user.id,
                created: new Date(),
                name: isim,
                age: age,
                sex: "Male"
            });
            await data.save();
        }
        let aNumber = 0;
        const registryDatas = await nameData.find({ executor: message.member.user.id });
        if (registryDatas) aNumber = registryDatas.length;
        message.channel.send(new Discord.MessageEmbed().setDescription(`${mentioned} kişisinin kaydı ${message.member} tarafından gerçekleştirildi.\nBu kişinin kayıt sayısı: \`${aNumber}\``));
        message.guild.channels.cache.get(channels.get("registerlog").value()).send(new Discord.MessageEmbed()
            .setDescription(`${mentioned} kişisinin verileri başarıyla işlenmiştir.`).setColor('#96e7f4')
            .addField("Cinsiyet:", "Erkek", true).addField("İsim:", isim, true).addField("Yaş", yaş, true));

    }
}
module.exports = Erkek;