const pjails = require('../../../MODELS/Moderation/Jails');
const Discord = require('discord.js');
const Tagli = require('../../../MODELS/StatUses/tagged');
const low = require('lowdb');
const gangs = require('../../../MODELS/Datalake/gangs');
const { stripIndents } = require('common-tags');
class UserUpdate {
    constructor(client) {
        this.client = client;
    }
    async run(oldUser, newUser) {
        const client = this.client;
        if (oldUser.username === newUser.username) return;
        const guild = client.guilds.cache.get(client.config.server);
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const member = guild.members.cache.get(newUser.id);
        if (!utils.get("forbidden").value().some(tag => oldUser.username.includes(tag)) && utils.get("forbidden").value().some(tag => newUser.username.includes(tag))) {
            client.extention.emit('Jail', member, this.client.user.id, "Yasaklı Tag", "Perma", 1);
            await member.roles.add([roles.get("forbidden").value(), roles.get("denied").value()]);
            await member.roles.remove([roles.get("prisoner").value(), roles.get("denied").value()])
            client.extention.emit('Logger', 'KDE', newUser.id, "FORBID_TAG", `${utils.get("forbidden").value().find(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))} tagını aldığından dolayı hapise atıldı`);
            const dmEmbed = new Discord.MessageEmbed().setColor('#2f3136')
                .setDescription(`Kullanıcı adındaki ${utils.get("forbidden").value().find(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))} simgesi sunucumuzda yasaklı olan bir tagdır. Simgeyi kullanıcı adından kaldırdığında rollerin direkt olarak geri verilecektir.`);
            await member.send(dmEmbed);
        }
        if (utils.get("forbidden").value().some(tag => oldUser.username.includes(tag)) && !utils.get("forbidden").value().some(tag => newUser.username.includes(tag))) {
            const pjail = await pjails.findOne({ _id: newUser.id, reason: "YASAKLI TAG" });
            if (pjail) {
                await member.roles.remove([roles.get("forbidden").value(), roles.get("denied").value()]);
                let deletedRoles = [];
                await pjail.roles.forEach(rolename => deletedRoles.push(guild.roles.cache.find(role => role.name === rolename).id));
                await member.roles.add(deletedRoles);
                await pjails.deleteOne({ _id: newUser.id });
                client.extention.emit('Logger', 'KDE', newUser.id, "FORBID_TAG", `${utils.get("forbidden").value().find(tag => oldUser.username.includes(tag) && !newUser.username.includes(tag))} tagını çıkardığından dolayı hapisten çıkarıldı`);
                await guild.channels.cache.get(channels.get("ast-ytag").value()).send(embed);
                const dmEmbed = new Discord.MessageEmbed().setColor('#2f3136')
                    .setDescription(`Kullanıcı adındaki ${utils.get("forbidden").value().find(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))} simgesini çıkardığın için eski rollerin geri verilmiştir. İyi eğlenceler...`);
                await member.send(dmEmbed);
            }
        }
        if (!client.config.tag.some(tag => oldUser.username.includes(tag)) && client.config.tag.some(tag => newUser.username.includes(tag))) {
            await member.roles.add(roles.get("crew").value());
            client.extention.emit('Logger', 'KDE', newUser.id, "AUTO_TAG", `Tag aldı`);
            await guild.channels.cache.get(channels.get("log_tag").value()).send(stripIndents`
            ${member} tagımızı alarak ailemize katıldı, onunla birlikte \`${guild.members.cache.array().filter(m => m.user.username.includes(client.config.tag[0])).length}\` taglımız bulunmaktadır.

            <@&${roles.get("yetkilitaglı").value()}> ilgilenmenizi tavsiye ederim.
            `);
            await member.setNickname(member.displayName.replace(`•`, client.config.tag[0]));
            if (!member.roles.cache.some(rIDm => roles.get("Male").value().concat(roles.get("Female").value()).includes(rIDm))) return;
            await guild.channels.cache.get(channels.get("genel_chat").value()).send(stripIndents`
            ${member} ailemize hoş geldin <:inferno_kalp3:889588203198242840>
            Gençler bir merhaba diyelim 😋
            `);
        }
        if (client.config.tag.some(tag => oldUser.username.includes(tag)) && !client.config.tag.some(tag => newUser.username.includes(tag))) {
            const tagrecord = await Tagli.findOne({ _id: newUser.id });
            if (tagrecord) await Tagli.deleteOne({ _id: newUser.id });
            await member.roles.remove(roles.get("crew").value());
            client.extention.emit('Logger', 'KDE', newUser.id, "AUTO_TAG", `Tag saldı`);
            if (utils.get("taglıAlım").value() && !member.roles.cache.has(roles.get("vip").value() && !member.roles.cache.has(roles.get("booster").value()))) {
                await member.roles.remove(member.roles.cache.filter(r => r.editable).array());
                await member.roles.add(roles.get("welcome").value());
            }
            await guild.channels.cache.get(channels.get("log_tag").value()).send(stripIndents`
            ${member} tagımızı çıkararak ailemizden ayrıldı :(, maalesef ki artık \`${guild.members.cache.array().filter(m => m.user.username.includes(client.config.tag[0])).length}\` taglımız bulunmaktadır.

            <@&${roles.get("yetkilitaglı").value()}> ilgilenmenizi tavsiye ederim.
            `);
            if (!member.roles.cache.some(rIDm => roles.get("Male").value().concat(roles.get("Female").value()).includes(rIDm))) return;
            await member.setNickname(member.displayName.replace(client.config.tag[0], '•'));
        }
        const gangler = await gangs.find();
        const taglar = gangler.map(doc => doc._id);
        const etiketler = gangler.map(doc => doc.discriminator);
        if (taglar.some(isim => newUser.username.toLowerCase().includes(isim.toLowerCase())) || etiketler.some(etiket => newUser.discriminator === etiket)) {
            const mygang = gangler.find(doc => newUser.username.toLowerCase().includes(doc._id.toLowerCase()) || (newUser.discriminator === doc.discriminator));
            await member.roles.add(mygang.roleID);
        }
        if (taglar.some(isim => oldUser.username.toLowerCase().includes(isim.toLowerCase()) && !newUser.username.toLowerCase().includes(isim.toLowerCase())) || etiketler.some(etiket => (oldUser.discriminator === etiket) && (newUser.discriminator !== etiket))) {
            const mygang = gangler.find(doc => oldUser.username.toLowerCase().includes(doc._id.toLowerCase()) || (oldUser.discriminator === doc.discriminator));
            await member.roles.remove(mygang.roleID);
        }



    }
}
module.exports = UserUpdate;