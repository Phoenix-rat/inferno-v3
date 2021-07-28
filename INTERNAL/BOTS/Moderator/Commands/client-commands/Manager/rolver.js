const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Perm extends Command {
    constructor(client) {
        super(client, {
            name: "yetenek",
            description: "Sunucuda bulunan üyelere perm vermek için kullanılır",
            usage: "yetenek @Kahve/ID vip",
            examples: ["rolver @Kahve/ID -ability"],
            cooldown: 3600000,
            category: "Perm",
            aliases: ["rolver","yetenekver"],
            accaptedPerms: ["cmd-ceo"],
            enabled: false
        });
    }
    async run(client, message, args, data) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        
        const yetenekembed = new Discord.MessageEmbed().setColor("RANDOM")
        const gavat = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!gavat) return await message.channel.send(yetenekembed.setDescription(`Kullanıcı bulunamadı :(`))

        let gavatadam = args[0];
        if(!gavatadam) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(`kahve oruspu çocu burayı doldurcan `));

        if(gavatadam == "vip"){
            if(!gavat.roles.cache.has(roles.get("vip").value())) {
                gavat.roles.add(roles.get("vip").value())
                await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("vip").value()} adlı rolü verdim.`)) 
            }
        }
        if(gavatadam == "dj"){
            if(!gavat.roles.cache.has(roles.get("role_dj").value())) {
                gavat.roles.add(roles.get("role_dj").value())
                await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_dj").value()} adlı rolü verdim.`)) 
            }
        }
        if(gavatadam == "editör"){
            if(!gavat.roles.cache.has(roles.get("role_editor").value())) {
                gavat.roles.add(roles.get("role_editor").value())
                await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_editor").value()} adlı rolü verdim.`)) 
            }
        }
        if(gavatadam == "vokal"){
            if(!gavat.roles.cache.has(roles.get("role_vokal").value())) {
                gavat.roles.add(roles.get("role_vokal").value())
                await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_vokal").value()} adlı rolü verdim.`)) 
            }
        }
        if(gavatadam == "ressam"){
            if(!gavat.roles.cache.has(roles.get("role_ressam").value())) {
                gavat.roles.add(roles.get("role_ressam").value())
                await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_ressam").value()} adlı rolü verdim.`)) 
            }
        }
        if(gavatadam == "streamer"){
            if(!gavat.roles.cache.has(roles.get("role_streamer").value())) {
                gavat.roles.add(roles.get("role_streamer").value())
                await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_streamer").value()} adlı rolü verdim.`)) 
            }
        }
        if(gavatadam == "müzisyen"){
            if(!gavat.roles.cache.has(roles.get("role_musician").value())) {
                gavat.roles.add(roles.get("role_musician").value())
                await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_musician").value()} adlı rolü verdim.`)) 
            }
        }
        if(gavatadam == "tasarımcı"){
            if(!gavat.roles.cache.has(roles.get("role_designer").value())) {
                gavat.roles.add(roles.get("role_designer").value())
                await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_designer").value()} adlı rolü verdim.`)) 
            }
        }
    }
}

module.exports = Perm;