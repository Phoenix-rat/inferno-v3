const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Yetenek extends Command {
    constructor(client) {
        super(client, {
            name: "yetenek",
            description: "Belirtilen roldeki üyeleri gösterir.",
            usage: "yetenek @Kahve/ID",
            examples: ["yetenek @Kahve/ID"],
            category: "Yetkili",
            aliases: ["özellik"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double","cmd-transport"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!mentioned) return await message.channel.send(new Discord.MessageEmbed().setColor("BLACK").setDescription(`Kullanıcı bulunamadı :(`)).then(msg => msg.delete({ timeout: 10000 }));
        
        const yetenekembed = new Discord.MessageEmbed().setColor("BLACK").setTimestamp()
        .setFooter(`• Kahve sizi seviyor 🌟`).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle("† Dante's INFEЯИO");
        
        let select = args[1]
        if (!select || (select !== 'şair' &&  select !== 'tasarım' &&  select !== 'müzik' &&  select !== 'yayıncı' &&  select !== 'ressam' && select !== 'dj' && select !== 'vokal' && select !== 'edit' && select !== 'vip')) 
        return message.channel.send(yetenekembed.setDescription(`
        ───────────────────
        • .yetenek @Kahve/ID şair (\`Şair/Yazar\`) permini verir.
        • .yetenek @Kahve/ID tasarım (\`Tasarımcı\`) permini verir.
        • .yetenek @Kahve/ID müzik (\`Müzisyen\`) permini verir.
        • .yetenek @Kahve/ID yayıncı (\`Streamer\`) permini verir.
        • .yetenek @Kahve/ID ressam (\`Ressam\`) permini verir.
        • .yetenek @Kahve/ID dj (\`DJ\`) permini verir.
        • .yetenek @Kahve/ID vokal (\`Vokal\`) permini verir.
        • .yetenek @Kahve/ID edit (\`Editör\`) permini verir.
        • .yetenek @Kahve/ID vip (\`Important for us 💎\`) permini verir.
        ───────────────────
        `)).then(msg => msg.delete({ timeout: 10000 }));

         if(select == "şair") {
            if(!mentioned.roles.cache.has(roles.get("role_poet").value())) {
                mentioned.roles.add(roles.get("role_poet").value())
                 const sairemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Şair/Yazar\` adlı rolü verdim.`)
                 return await message.channel.send(sairemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if(select == "tasarım") {
            if(!mentioned.roles.cache.has(roles.get("role_designer").value())) {
                mentioned.roles.add(roles.get("role_designer").value())
                  const tasarimemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Tasarımcı\` adlı rolü verdim.`)
                  return await message.channel.send(tasarimemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if(select == "müzik") {
            if(!mentioned.roles.cache.has(roles.get("role_musician").value())) {
                mentioned.roles.add(roles.get("role_musician").value())
                  const musicemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Müzisyen\` adlı rolü verdim.`) 
                  return await message.channel.send(musicemb).then(msg => msg.delete({ timeout: 10000 }));
            } 
        }
        if(select == "yayıncı") {
            if(!mentioned.roles.cache.has(roles.get("role_streamer").value())) {
                mentioned.roles.add(roles.get("role_streamer").value())
                const streamemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Streamer\` adlı rolü verdim.`)
                return await message.channel.send(streamemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if(select == "ressam") {
            if(!mentioned.roles.cache.has(roles.get("role_ressam").value())) {
                mentioned.roles.add(roles.get("role_ressam").value())
                const ressaemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Ressam\` adlı rolü verdim.`)
                return await message.channel.send(ressaemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if(select == "dj") {
            if(!mentioned.roles.cache.has(roles.get("role_dj").value())) {
                mentioned.roles.add(roles.get("role_dj").value())
                const djemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`DJ\` adlı rolü verdim.`)
                return await message.channel.send(djemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if(select == "vokal") {
            if(!mentioned.roles.cache.has(roles.get("role_vokal").value())) {
                mentioned.roles.add(roles.get("role_vokal").value())
                const vokalemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Vokal\` adlı rolü verdim.`)
                return await message.channel.send(vokalemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if(select == "vip") {
            if(!mentioned.roles.cache.has(roles.get("vip").value())) {
                mentioned.roles.add(roles.get("vip").value())
                const vipemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Important for us 💎\` adlı rolü verdim.`)
                return await message.channel.send(vipemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if(select == "edit") {
            if(!mentioned.roles.cache.has(roles.get("role_editor").value())) {
                mentioned.roles.add(roles.get("role_editor").value())
                const editemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Editör\` adlı rolü verdim.`)
                return await message.channel.send(editemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
    }
}

module.exports = Yetenek;