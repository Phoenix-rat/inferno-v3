const { SlashCommand, CommandOptionType } = require('slash-create');
const low = require('lowdb');
const Discord = require('discord.js');
const { stripIndent } = require('common-tags');
const { rain, checkDays } = require('../../../../../HELPERS/functions');
const Profile = require('../../../../../MODELS/Economy/Profile');
const IDS = require('../../../../../BASE/personels.json');
module.exports = class AvatarCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'randevu',
            description: 'Terapi randevusu almak için kullanılır.',
            guildIDs: [IDS.guild],
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: 'not',
                    description: 'Bir not belirtiniz.',
                    required: false
                }
            ],
            deferEphemeral: false,
            throttling: {
                duration: 60,
                usages: 1
            }
        });

        this.filePath = __filename;
    }

    async run(ctx) {
        const client = ctx.creator.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const channels = await low(client.adapters('channels'));
        const emojis = await low(client.adapters('emojis'));
        const myProfile = await Profile.findOne({ _id: mentioned.user.id });
        const exeMember = client.guild.members.cache.get(ctx.user.id);
        const feed = client.guild.channels.cache.get(channels.get("randevular").value());
        const logs = client.guild.channels.cache.get(channels.get("randevulog").value());

        const Embed = new Discord.MessageEmbed().setDescription(stripIndent`
        Kullanıcı: ${exeMember}
        Notu: ${ctx.options["not"] || "\`Not eklememiş\`"}
        `);




    }
}
