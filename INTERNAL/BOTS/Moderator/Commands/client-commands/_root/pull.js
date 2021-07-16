const Command = require("../../../Base/Command");
const low = require('lowdb');
const core = require('ytdl-core');
const yt = require('scrape-yt');
const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
const children = require("child_process");
const VoiceChannels = require("../../../../../MODELS/Datalake/VoiceChannels");
const request = require("request");
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "pull",
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
        function Process() {
            var ls = children.exec(`cd /home/${client.config.project}/${utils.get("dir").value()}; git pull`);
            ls.stdout.on('data', function (data) {
                console.log(data);
            });
            ls.stderr.on('data', function (data) {
                console.log(data);
            });
            ls.on('close', function (code) {
                if (code == 0)
                    console.log('Stop');
                else
                    console.log('Start');
            });
            setTimeout(() => {
                ls.kill();
            }, 100);
        }
        Process();
        
    }

}

module.exports = Kur;