const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const izin = require('../../../../../MODELS/Temprorary/Permissions');
const keyz = require('shortid');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "tagkontrol",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
            acceptedRoles: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: true,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        message.guild.members.cache.filer(m => m.roles.cache.has(roles.get("crew").value()) && !client.config.tag.some(t => m.user.username.includes(t))).forEach(m => {
            m.roles.remove(roles.get("crew").value());
        });
        message.guild.members.cache.filer(m => !m.roles.cache.has(roles.get("crew").value()) && client.config.tag.some(t => m.user.username.includes(t))).forEach(m => {
            m.roles.add(roles.get("crew").value());
        });

    }

}

module.exports = Kur;