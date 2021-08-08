const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
const { sayi } = require('../../../../../HELPERS/functions');
const nameData = require('../../../../../MODELS/Datalake/Registered');
class Duzelt extends Command {
    constructor(client) {
        super(client, {
            name: "duzelt",
            description: "kayıt sonrasında kişinin adınıi yaşını veya cinsiyetini değiştirmek için kullanılır.",
            usage: "duzelt etiket/id (isim/yaş/cinsiyet) (yeni değer)",
            examples: ["duzelt 674565119161794560 isim tantoony"],
            category: "Kayıt",
            aliases: ["dzlt", "düzelt"],
            accaptedPerms: ["cmd-registry", "cmd-all", "cmd-manager", "cmd-rhode", "cmd-authority", "cmd-staff"],
            cooldown: 10000,
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
        const data = await nameData.findOne({ _id: mentioned.user.id });
        if (!data) return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${mentioned} kişisinin kaydı bulunamadı!`));
        if (args[1] === 'isim') {
            const rawName = args[2]
            let adana = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase()
            await nameData.updateOne({ _id: mentioned.user.id }, { name: adana });
            await mentioned.setNickname(mentioned.displayName.replace(mentioned.displayName.slice(2).split(' | ')[0], adana));
        } else if (args[1] === 'yaş') {
            const yaş = args[2];
            const age = Number(yaş);
            if (!sayi(yaş)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Geçerli bir yaş girmelisin!`));
            await nameData.updateOne({ _id: mentioned.user.id }, { age: age });
            await mentioned.setNickname(mentioned.displayName.replace(mentioned.displayName.slice(2).split(' | ')[1], yaş));
        } else if (args[1] === 'cinsiyet') {
          let cins = args[2]
          message.reply(cins)
          
          
          
          
          
         /*   if (args[2] == "kadin") {
                await nameData.updateOne({ _id: mentioned.user.id }, { sex: 'Female' });
                await mentioned.roles.remove(roles.get("erkek").value());
                await mentioned.roles.add(roles.get("kiz").value());
            }
            if (args[2] == "erkek") {
                await nameData.updateOne({ _id: mentioned.user.id }, { sex: 'Male' });
                await mentioned.roles.remove(roles.get("kiz").value());
                await mentioned.roles.add(roles.get("erkek").value());
            } */
        } else return message.channel.send(`lütfen düzeltme türünü \`isim\`, \`yaş\` veya \`cinsiyet\` olarak belirtiniz.`);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
    }
}
module.exports = Duzelt;