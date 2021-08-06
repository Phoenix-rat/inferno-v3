require('dotenv').config({ path: __dirname + '/../../../.env' });
const { Intents } = require('discord.js');
const Tantoony = require('./../../BASE/Tantoony');
const low = require("lowdb")
const client = new Tantoony({
    ws: {
        intents: new Intents(Intents.ALL).remove([
            //"GUILDS",
            //"GUILD_MEMBERS",
            "GUILD_BANS",
            "GUILD_EMOJIS",
            //"GUILD_INTEGRATIONS",
            "GUILD_WEBHOOKS",
            "GUILD_INVITES",
            //"GUILD_VOICE_STATES",
            //"GUILD_PRESENCES",
            //"GUILD_MESSAGES",
            //"GUILD_MESSAGE_REACTIONS",
            "GUILD_MESSAGE_TYPING",
            //"DIRECT_MESSAGES",
            "DIRECT_MESSAGE_REACTIONS",
            "DIRECT_MESSAGE_TYPING"
        ])
    },
    fetchAllMembers: true
});
client.login(process.env.token_6);
client.handler.mongoLogin();
client.handler.events('/../../EVENTS', __dirname);
client.on("error", (e) => client.logger.log(e, "error"));
client.on("warn", (info) => client.logger.log(info, "warn"));
process.on("unhandledRejection", (err) => client.logger.log(err, "caution"));
process.on("warning", (warn) => client.logger.log(warn, "varn"));
process.on("beforeExit", () => console.log('Bitiriliyor...'));
client.handler.events('/Events', __dirname, 'client-events');
client.handler.dotCommands('./Commands/client-commands/');
client.handler.buttons('./Commands/components/', "Moderator");
const { SlashCreator } = require("slash-create");
const { GatewayServer } = require("slash-create");
client.fetchApplication().then((app) => {
    const creator = new SlashCreator({
        applicationID: app.id,
        publicKey: process.env.publicKey,
        token: process.env.token_6,
        allowedMentions: {
            everyone: false,
            roles: false,
            users: false
        }
    });
    creator.client = client;
    creator.withServer(new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler)));
    client.handler.events('/Events', __dirname, 'slash-events', creator);
    client.handler.slashCommands('./Commands/slash-commands/', creator);
});

const korpeamcik = require("../../MODELS/Moderation/Rollog.js")
client.on("guildMemberUpdate", async(oldMember, newMember) =>{
    const emojis = await low(client.adapters('emojis'));
    let aldiverdi;
    if(oldMember.roles.cache.size < newMember.roles.cache.size){ aldiverdi = client.emojis.cache.get(emojis.get("ok").value().split(':')[2].replace('>', '')) } else { aldiverdi = client.emojis.cache.get(emojis.get("error").value().split(':')[2].replace('>', ''))}
    if(oldMember.roles.cache.size !== newMember.roles.cache.size) {
    let rolveren = await oldMember.guild.fetchAuditLogs({ type: 'GUILD_MEMBER_UPDATE' }).then(audit => audit.entries.first());
    if(rolveren.executor.bot) return;
    let role = oldMember.roles.cache.find(s => !newMember.roles.cache.has(s.id)) || newMember.roles.cache.find(s => !oldMember.roles.cache.has(s.id))
    console.log(`Rol Güncellendi: ${role.id}`)
    await korpeamcik.findOneAndUpdate({_id: newMember.id}, {$push: {rolveridb: { staffID: rolveren.executor.id, tarih: Date.now(), rolid: `${role.id}`, type: aldiverdi }}}, {upsert:true})
    }
})



