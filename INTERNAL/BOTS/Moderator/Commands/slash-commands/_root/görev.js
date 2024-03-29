const { SlashCommand, CommandOptionType, ApplicationCommandPermissionType } = require('slash-create');
const low = require('lowdb');
const Discord = require('discord.js');
const taskAwards = require('../../../../../MODELS/Economy/Task_awards');
const taskDuties = require('../../../../../MODELS/Economy/Task_duties');
const IDS = require('../../../../../BASE/personels.json');
const gen = require('shortid');

module.exports = class JailCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'görev',
            description: 'görev sistemi ayarlama komutu',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'ödül',
                    description: 'Görev ödülü ekleyiniz',
                    options: [
                        {
                            type: CommandOptionType.ROLE || CommandOptionType.STRING,
                            name: "rol",
                            description: "verilecek rol",
                            required: true
                        },
                        {
                            type: CommandOptionType.INTEGER,
                            name: "puan",
                            description: "gerekli puan",
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'ekle',
                    description: 'Bir role görev ekler',
                    options: [
                        {
                            type: CommandOptionType.ROLE || CommandOptionType.STRING,
                            name: "rol",
                            description: "Rolü belirtiniz",
                            required: true
                        },
                        {
                            type: CommandOptionType.STRING,
                            name: "tür",
                            description: "Türü belirtiniz",
                            required: true,
                            choices: [
                                {
                                    name: "Davet",
                                    value: "invite"
                                },
                                {
                                    name: "Kayıt",
                                    value: "registry"
                                },
                                {
                                    name: "Ses Xp",
                                    value: "voice"
                                },
                                {
                                    name: "Mesaj",
                                    value: "chat"
                                },
                                {
                                    name: "Taglı",
                                    value: "tagged"
                                },
                                {
                                    name: "Yetkili",
                                    value: "staff"
                                }
                            ]
                        },
                        {
                            type: CommandOptionType.INTEGER,
                            name: "sayı",
                            description: "Belirttiğin türden kaç birim gerektiğini sayı olarak yaz",
                            required: true
                        },
                        {
                            type: CommandOptionType.INTEGER,
                            name: "puan",
                            description: "Puan'ı belirtiniz (- sayı girilebilir.)",
                            required: true
                        }
                    ]
                }
            ],
            deferEphemeral: false,
            defaultPermission: false,
            guildIDs: [IDS.guild],
            permissions: {
                [IDS.guild]: [
                    {
                        type: ApplicationCommandPermissionType.USER,
                        id: '479293073549950997',
                        permission: true
                    }
                ]
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
        const userID = Object.values(ctx.options)[0];
        const guild = client.guilds.cache.get(ctx.guildID);

        switch (Object.keys(ctx.options)[0]) {
            case "ödül":
                const roleData = await taskAwards.findOne({ _id: Object.values(ctx.options)[0]['rol'] });
                if (!roleData) {
                    await taskAwards.create({
                        _id: Object.values(ctx.options)[0]['rol'],
                        point: Object.values(ctx.options)[0]['puan'],
                        salary: 0
                    });
                } else {
                    await taskAwards.updateOne({ _id: Object.values(ctx.options)[0]['rol'] }, {
                        $set: {
                            point: Object.values(ctx.options)[0]['limit']
                        }
                    });
                }
                const rolesData = await taskAwards.find();
                const embedLol = new Discord.MessageEmbed().setDescription(rolesData.map(data => `<@&${data._id}> : ${data.point} puan`));
                await ctx.send({
                    embeds: [embedLol]
                });
                break;

            case "ekle":
                const TaskData = await taskDuties.findOne({ roleID: Object.values(ctx.options)[0]['rol'], type: Object.values(ctx.options)[0]['tür'] });
                if (!TaskData) {
                    await taskDuties.create({
                        _id: gen.generate(),
                        roleID: Object.values(ctx.options)[0]['rol'],
                        type: Object.values(ctx.options)[0]['tür'],
                        count: Object.values(ctx.options)[0]['sayı'],
                        points: Object.values(ctx.options)[0]['puan']
                    });
                } else {
                    await taskDuties.updateOne({ roleID: Object.values(ctx.options)[0]['rol'], type: Object.values(ctx.options)[0]['tür'] }, {
                        $set: {
                            count: Object.values(ctx.options)[0]['sayı'],
                            points: Object.values(ctx.options)[0]['puan']
                        }
                    });
                }
                const ekleEmbed = new Discord.MessageEmbed().setDescription(`<@&${Object.values(ctx.options)[0]['rol']}> rolü için **${Object.values(ctx.options)[0]['tür']}** görevi ayarlandı!`);
                await ctx.send({
                    embeds: [ekleEmbed]
                });
                break;

            default:
                break;
        }
    }
}
