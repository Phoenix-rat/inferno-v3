const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
const nameData = require('../../../../../MODELS/Datalake/Registered');
const { sayi } = require('../../../../../HELPERS/functions');
class Kiz extends Command {
    constructor(client) {

        super(client, {
            name: "kiz",
            description: "Kayıtsız bir üyeyi kız olarak kayıt eder",
            usage: "kız @Kahve/ID İsim Yaş",
            examples: ["kız @Kahve/ID İsim Yaş"],
            category: "Kayıt",
            aliases: ["k", "kız"],
            cmdChannel: "exe-registry",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-registry"],
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
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('BLACK'));
        if (!mentioned.roles.cache.has(roles.get("welcome").value()) && (mentioned.roles.cache.size > 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Sanırım bu üye zaten kayıtlı!`));
        if (utils.get("taglıAlım").value() && !mentioned.user.username.includes(client.config.tag)) {
            if (!mentioned.roles.cache.has(roles.get("vip").value()) && !mentioned.roles.cache.has(roles.get("booster").value())) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`Üzgünüm, ama henüz taglı alımdayız. ${mentioned} kullanıcısında vip veya booster rolü olmadığı koşulda onu içeri alamam..`)
                );
            }
        }
        if (mentioned.displayName.includes('|')) args = [mentioned.id].concat(mentioned.displayName.slice(2).replace('| ', '').split(' '));
        let rawName = args.slice(1);
        if (args.length < 3) return message.channel.send(new Discord.MessageEmbed().setDescription(`Kullanım: \`${this.help.usage}\``));
        let age = Number(args[args.length - 1]);
        if (!sayi(age)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Geçerli bir yaş girmelisin!`));
        let nameAge = rawName.map(i => i[0].toUpperCase() + i.slice(1).toLowerCase());
        nameAge = nameAge.join(' ').replace(` ${age}`, '');
        let point = '⸸';
        if (client.config.tag.some(tag => mentioned.user.username.includes(tag))) {
            point = client.config.tag[0];
        }
        await mentioned.setNickname(`${point} ${nameAge} | ${age}`);
        await mentioned.roles.add(roles.get("Female").value().concat(roles.get("member").value()));
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
                name: nameAge,
                age: age,
                sex: "Female"
            });
            await data.save();
        }
        let aNumber = 0;
        const registryDatas = await nameData.find({ executor: message.member.user.id });
        if (registryDatas) aNumber = registryDatas.length;
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        let publicRooms = message.guild.channels.cache.filter(c => c.parentID === "854087056757489696" && c.type === "voice" && c.id != "871460692321009715");
        if(mentioned.voice.channel) mentioned.voice.setChannel(publicRooms.random().id).catch(() => {})
        await message.channel.send(new Discord.MessageEmbed().setDescription(`${mentioned} kişisinin kaydı ${message.member} tarafından gerçekleştirildi.\nBu kişinin kayıt sayısı: \`${aNumber}\``)).then(async (msg) => await msg.delete({ timeout: 3000 }));

    }
}
module.exports = Kiz;