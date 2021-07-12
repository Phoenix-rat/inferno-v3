const { SlashCommand, CommandOptionType, ApplicationCommandPermissionType } = require('slash-create');
const low = require('lowdb');
const Discord = require('discord.js');
const nameData = require('../../../../../MODELS/Datalake/Registered');
const { sayi, comparedate } = require('../../../../../HELPERS/functions');
const IDS = require('../../../../../BASE/personels.json');
const Task_current = require('../../../../../MODELS/Economy/Task_current');
const Task_done = require('../../../../../MODELS/Economy/Task_done');
const Points_profile = require('../../../../../MODELS/Economy/Points_profile');
const Points_config = require('../../../../../MODELS/Economy/Points_config');

module.exports = class RegistryCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'kayıt',
            description: 'Kişiyi kaydeder',
            options: [
                {
                    type: CommandOptionType.MENTIONABLE || CommandOptionType.USER,
                    name: 'kullanıcı',
                    description: 'Kullanıcıyı belirtiniz',
                    required: true
                },
                {
                    type: CommandOptionType.STRING,
                    name: 'cinsiyet',
                    description: 'Cinsiyetini belirtiniz',
                    required: true,
                    choices: [
                        {
                            name: "Erkek",
                            value: "Male"
                        },
                        {
                            name: "Kız",
                            value: "Female"
                        }
                    ]
                },
                {
                    type: CommandOptionType.STRING,
                    name: 'isim',
                    description: 'İsmini belirtiniz',
                    required: true
                },
                {
                    type: CommandOptionType.INTEGER,
                    name: 'yaş',
                    description: 'Yaşını belirtiniz',
                    required: true
                }
            ],
            deferEphemeral: false,
            defaultPermission: false,
            guildIDs: [IDS.guild],
            permissions: {
                [IDS.guild]: [
                    {
                        type: ApplicationCommandPermissionType.ROLE,
                        id: IDS.registry,
                        permission: true
                    },
                    {
                        type: ApplicationCommandPermissionType.ROLE,
                        id: IDS.all,
                        permission: true
                    },
                    {
                        type: ApplicationCommandPermissionType.ROLE,
                        id: IDS.ceo,
                        permission: true
                    },
                    {
                        type: ApplicationCommandPermissionType.ROLE,
                        id: IDS.owner,
                        permission: true
                    },
                    {
                        type: ApplicationCommandPermissionType.ROLE,
                        id: IDS.root,
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
        const mentioned = client.guilds.cache.get(ctx.guildID).members.cache.get(userID);
        const errEmbed = new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136')
        if (!mentioned) return await ctx.send({
            embeds: [errEmbed]
        });
        const errEmbed2 = new Discord.MessageEmbed().setDescription(`Sanırım bu üye zaten kayıtlı!`);
        if (!mentioned.roles.cache.has(roles.get("welcome").value()) && (mentioned.roles.cache.size > 1)) return ctx.send({ embeds: [errEmbed2] });
        if (utils.get("taglıalım").value() && !mentioned.user.username.includes(client.config.tag)) {
            if (!mentioned.roles.cache.has(roles.get("th-vip").value()) && !mentioned.roles.cache.has(roles.get("th-booster").value())) {
                const eEmbed = new Discord.MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`Üzgünüm, ama henüz taglı alımdayız. ${mentioned} kullanıcısında vip veya booster rolü olmadığı koşulda onu içeri alamam..`)
                return ctx.send({
                    embeds: [eEmbed]
                });
            }
        }
        const sex = ctx.options["cinsiyet"];
        const name = ctx.options["isim"];
        const age = ctx.options["yaş"];
        const ageEmbed = new Discord.MessageEmbed().setDescription(`Geçerli bir yaş girmelisin!`)
        if (!sayi(age)) return ctx.send({
            embeds: [ageEmbed]
        });
        const nameFixed = name.split(' ').map(i => i[0].toUpperCase() + i.slice(1).toLowerCase()).join(' ');
        await mentioned.roles.add(roles.get(sex).value().concat(roles.get("member").value()));
        await mentioned.roles.remove(roles.get("welcome").value());
        let point = '•';
        if (client.config.tag.some(tag => mentioned.user.username.includes(tag))) {
            await mentioned.roles.add(roles.get("th-taglı").value());
            point = client.config.tag[0];
        }
        await mentioned.setNickname(`${point} ${nameFixed} | ${age}`);
        const registry = await nameData.findOne({ _id: mentioned.user.id });
        if (!registry) {
            const data = new nameData({
                _id: mentioned.user.id,
                executor: ctx.user.id,
                created: new Date(),
                name: nameFixed,
                age: age,
                sex: sex
            });
            await data.save();
        }
        const registryDatas = await nameData.find({ executor: ctx.user.id });
        const total = registryDatas.length || 0;
        const myEmbed = new Discord.MessageEmbed().setDescription(`${mentioned} kişisinin kaydı <@${ctx.user.id}> tarafından gerçekleştirildi.\nBu kişinin kayıt sayısı: \`${total}\``);
        await ctx.send({
            embeds: [myEmbed]
        });
        const TaskData = await Task_current.findOne({ _id: ctx.user.id });
        if (TaskData) {
            const regTask = TaskData.tasks.find(task => task.type === "registry");
            if (regTask) {
                const currentRegs = registryDatas.filter(data => comparedate(data.created) <= comparedate(regTask.created));
                if (currentRegs.length >= regTask.count) {
                    await Task_current.updateOne({ _id: ctx.user.id }, { $pull: { task: regTask } });
                    await Task_done.updateOne({ _id: ctx.user.id }, { $push: { task: regTask } });
                }
            }
        }
        const pointData = await Points_profile.findOne({ _id: ctx.user.id });
        if (pointData) {
            const pointConfig = await Points_config.findOne({ _id: pointData.roleID });
            if (pointData && !pointData.points.filter(point => point.type === "registry").find(point => point.registered === mentioned.user.id)) await Points_profile.updateOne({ _id: ctx.user.id }, {
                $push: {
                    points: {
                        type: "registry",
                        points: pointConfig.registry,
                        registered: mentioned.user.id
                    }
                }
            });
        }
    }
}
