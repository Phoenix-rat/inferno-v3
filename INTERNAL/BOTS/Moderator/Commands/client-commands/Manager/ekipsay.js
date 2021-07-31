const { MessageEmbed } = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const { rain } = require("../../../../../HELPERS/functions");
class ekipsay extends Command {

    constructor(client) {
        super(client, {
            name: "ekipsay",
            description: "Ekiptekileri sayar.",
            usage: "ekipsay @member/ID",
            examples: ["ekipsay"],
            category: "Yetkili",
            aliases: ["ekipsay"],
            accaptedPerms: ["root", "owner", "cmd-ceo","cmd-double","cmd-single"],

        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        message.channel.send("Çalışıuyor")
    }
}
module.exports = ekipsay;