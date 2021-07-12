const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Perm extends Command {
    constructor(client) {
        super(client, {
            name: "rolver",
            description: "Sunucuda bulunan yetkililere perm vermek için kullanılır",
            usage: "rolver etiket/id -roladı",
            examples: ["rolver @Cofteey#0046 -jail"],
            cooldown: 3600000,
            category: "Perm",
            aliases: ["rolver"],
            accaptedPerms: ["cmd-ceo"],
        });
    }
    async run(client, message, args, data) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let user = message.mentions.members.firts() || message.guild.members.cache.get(args[0]);
        if (!user.roles.cache.has(roles.get("cmd-ceo").value()) && !member.hasPermission("ADMINISTRATOR"))
        return message.channel.send("Bunu yapmak için yeterli yetkiye sahip değilsin!")
        if (args.length < 1) return message.channel.send("Bir kullanıcı girmeyi unuttun!")
        if (!user) return message.channel.send("Belirttiğin kullanıcı geçerli değil!")
        let map = new Map([
            ["-jail", [roles.get("cmd-jail"),value()]],
            ["-registry", [roles.get("cmd-registry").value()]],
            ["-mute", [roles.get("cmd-mute").value()]],
            ["-ability", [roles.get("cmd-ability").value()]]
        ])
        let metin = ""
        let arr = []
        for (let [k, v]of map) {
            if (args[0] == k) return
            v.map(x => {
                arr.push(x)
            })
        }
        for (let [k, v]of map){
            metin = metin + `${emojis.get("ok").value()} \`${k}` - ${v.filter(x => x !== "857386603373395999","857386627219193856").map(x => `<@&${x}>`)}\n`
        }
    }
}

module.exports = Perm;