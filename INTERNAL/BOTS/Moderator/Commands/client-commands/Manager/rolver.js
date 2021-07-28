const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Rolver extends Command {
    constructor(client) {
        super(client, {
            name: "rolver",
            description: "Belirtilen roldeki üyeleri gösterir.",
            usage: "rolver @Kahve/ID",
            examples: ["rolver @Kahve/ID"],
            category: "Yetkili",
            aliases: ["ver", "yetenek"],
            accaptedPerms: ["root", "owner"],
            cooldown: 10000
        });
    }

    async run(client, message, args, data) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        
        const yetenekembed = new Discord.MessageEmbed().setColor("RANDOM")
        const gavat = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!gavat) return await message.channel.send(yetenekembed.setDescription(`Kullanıcı bulunamadı :(`))

        if (!args[0] || (args[0] !== 'vip' && args[0] !== 'dj' && args[0] !== 'editör' && args[0] !== 'vokal' && args[0] !== 'ressam' && args[0] !== 'streamer' && args[0] !== 'müzisyen' && args[0] !== 'tasarımcı'))
         return message.channel.send('Test').then(x => x.delete({ timeout: 5000 }));
       
         if(args[0] === "vip"){
            if(!gavat.roles.cache.has(roles.get("vip").value())) {
                gavat.roles.add(roles.get("vip").value())
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("vip").value()} adlı rolü verdim.`)) 
            }
        }
        if(args[0] === "dj"){
            if(!gavat.roles.cache.has(roles.get("role_dj").value())) {
                gavat.roles.add(roles.get("role_dj").value())
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_dj").value()} adlı rolü verdim.`)) 
            }
        }
        if(args[0] === "editör"){
            if(!gavat.roles.cache.has(roles.get("role_editor").value())) {
                gavat.roles.add(roles.get("role_editor").value())
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_editor").value()} adlı rolü verdim.`)) 
            }
        }
        if(args[0] === "vokal"){
            if(!gavat.roles.cache.has(roles.get("role_vokal").value())) {
                gavat.roles.add(roles.get("role_vokal").value())
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_vokal").value()} adlı rolü verdim.`)) 
            }
        }
        if(args[0] === "ressam"){
            if(!gavat.roles.cache.has(roles.get("role_ressam").value())) {
                gavat.roles.add(roles.get("role_ressam").value())
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_ressam").value()} adlı rolü verdim.`)) 
            }
        }
        if(args[0] === "streamer"){
            if(!gavat.roles.cache.has(roles.get("role_streamer").value())) {
                gavat.roles.add(roles.get("role_streamer").value())
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_streamer").value()} adlı rolü verdim.`)) 
            }
        }
        if(args[0] === "müzisyen"){
            if(!gavat.roles.cache.has(roles.get("role_musician").value())) {
                gavat.roles.add(roles.get("role_musician").value())
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_musician").value()} adlı rolü verdim.`)) 
            }
        }
        if(args[0] === "tasarımcı"){
            if(!gavat.roles.cache.has(roles.get("role_designer").value())) {
                gavat.roles.add(roles.get("role_designer").value())
                return message.channel.send(yetenekembed.setDescription(`Başarıyla ${roles.get("role_designer").value()} adlı rolü verdim.`)) 
            }
        }
    }
}

module.exports = Rolver;