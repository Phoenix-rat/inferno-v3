require('dotenv').config({ path: __dirname + '/../../../.env' });
const { Intents } = require('discord.js');
require("./Base/ExtendedMessage");
const Tantoony = require('./../../BASE/Tantoony');
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
/*
client.on("message", async(message) => {
if(message.content === ".buton2") {
if (message.author.id !== "702133327443787807") return;
let option1 = new MessageMenuOption().setLabel('Etkinlik').setEmoji('847085097831628851').setValue('rol_menu_etkinlik').setDescription('Etkinlik rolü verir.')
let option2 = new MessageMenuOption().setLabel('Çekiliş').setEmoji('844894535129497640').setValue('rol_menu_cekilis').setDescription('Çekiliş rolü verir.')
let option3 = new MessageMenuOption().setLabel('VK').setEmoji('844894233080496128').setValue('rol_menu_vk').setDescription('VK rolü verir.')
let option4 = new MessageMenuOption().setLabel('DC').setEmoji('889974485665611788').setValue('rol_menu_dc').setDescription('DC rolü verir.')    
let select = new MessageMenu().setID('rol_menu').setPlaceholder('Rol seç!').setMaxValues(4).setMinValues(1).addOptions([option1, option2, option3, option4])
return await message.channel.send("**Etkinlik Rollerinizi Almak İçin Buttonu Kullanınız.**", {
component: select
});
} else  if(message.content === ".buton4") {
if (message.author.id !== "702133327443787807") return;
let option2 = new MessageMenuOption().setLabel('Brawlhalla').setEmoji('862046496663535636').setValue('rol_menu_oyun_brawlhalla').setDescription('Oyun rolünü verir.')
let option3 = new MessageMenuOption().setLabel('CS-GO').setEmoji('838093112563859476').setValue('rol_menu_oyun_csgo').setDescription('Oyun rolünü verir.')
let option4 = new MessageMenuOption().setLabel('Pubg').setEmoji('890210091251421225').setValue('rol_menu_oyun_pubg').setDescription('Oyun rolünü verir.')    
let option5 = new MessageMenuOption().setLabel('Among US').setEmoji('838092188352643074').setValue('rol_menu_oyun_amongus').setDescription('Oyun rolünü verir.')     
let option7 = new MessageMenuOption().setLabel('League Of Legends').setEmoji('838092438198943754').setValue('rol_menu_oyun_lol').setDescription('Oyun rolünü verir.')   
let option8 = new MessageMenuOption().setLabel('Valorant').setEmoji('836006695641415720').setValue('rol_menu_oyun_valorant').setDescription('Oyun rolünü verir.')   
let option13 = new MessageMenuOption().setLabel('Rust').setEmoji('838092188192866345').setValue('rol_menu_oyun_rust').setDescription('Oyun rolünü verir.')    
let option14 = new MessageMenuOption().setLabel('GTA V').setEmoji('838092437959475231').setValue('rol_menu_oyun_gtv').setDescription('Oyun rolünü verir.')    
let option15 = new MessageMenuOption().setLabel('Mobile Legends').setEmoji('🎮').setValue('rol_menu_oyun_mobillol').setDescription('Oyun rolünü verir.')   
let select = new MessageMenu().setID('rol_menu_oyun').setPlaceholder('Rol seç!').setMaxValues(7).setMinValues(1).addOptions([option14,option15, option13, option8, option7, option5,option4,option3,option2  ])
return await message.channel.send("**Oyun Rollerinizi Almak İçin Buttonu Kullanınız.**", {
component: select
});
} else  if(message.content === ".buton3") {
if (message.author.id !== "702133327443787807") return;
let meyve1 = new MessageMenuOption().setLabel('Vişne').setEmoji('🍒').setValue('rol_menu_meyve_vişne').setDescription('Meyve rolünü verir.')
let meyve2 = new MessageMenuOption().setLabel('Patlican').setEmoji('🍆').setValue('rol_menu_meyve_patlican').setDescription('Meyve rolünü verir.')
let meyve3 = new MessageMenuOption().setLabel('Elma').setEmoji('🍎').setValue('rol_menu_meyve_elma').setDescription('Meyve Rolünüz Verildi.')    
let meyve4 = new MessageMenuOption().setLabel('Armut').setEmoji('🍐').setValue('rol_menu_meyve_armut').setDescription('Meyve Rolünüz Verildi.')     
let meyve5 = new MessageMenuOption().setLabel('Mandalina').setEmoji('🍊').setValue('rol_menu_meyve_mandalina').setDescription('Meyve Rolünüz Verildi.')   
let meyve6 = new MessageMenuOption().setLabel('Limon').setEmoji('🍋').setValue('rol_menu_meyve_limon').setDescription('Meyve Rolünüz Verildi.')   
let meyve7 = new MessageMenuOption().setLabel('Muz').setEmoji('🍌').setValue('rol_menu_meyve_muz').setDescription('Meyve Rolünüz Verildi.')    
let meyve8 = new MessageMenuOption().setLabel('Salatalık').setEmoji('🥒').setValue('rol_menu_meyve_salatalık').setDescription('Meyve Rolünüz Verildi.')    
let meyve9 = new MessageMenuOption().setLabel('Avakado').setEmoji('🥑').setValue('rol_menu_meyve_avakado').setDescription('Meyve Rolünüz Verildi.') 
let meyve10 = new MessageMenuOption().setLabel('Biber').setEmoji('🌶️').setValue('rol_menu_meyve_biber').setDescription('Meyve Rolünüz Verildi.')   
let meyve11 = new MessageMenuOption().setLabel('Çilek').setEmoji('🍓').setValue('rol_menu_meyve_çilek').setDescription('Meyve Rolünüz Verildi.')   
let meyve12 = new MessageMenuOption().setLabel('Mango').setEmoji('🥭').setValue('rol_menu_meyve_mango').setDescription('Meyve Rolünüz Verildi.')   
let meyve13 = new MessageMenuOption().setLabel('Ananas').setEmoji('🍍').setValue('rol_menu_meyve_ananas').setDescription('Meyve Rolünüz Verildi.')   
let meyve14 = new MessageMenuOption().setLabel('Üzüm').setEmoji('🍇').setValue('rol_menu_meyve_üzüm').setDescription('Meyve Rolünüz Verildi.')   
let meyve15 = new MessageMenuOption().setLabel('Kavun').setEmoji('🍈').setValue('rol_menu_meyve_kavun').setDescription('Meyve Rolünüz Verildi.')   
let meyve16 = new MessageMenuOption().setLabel('Karpuz').setEmoji('🍉').setValue('rol_menu_meyve_karpuz').setDescription('Meyve Rolünüz Verildi.')   
let meyve17 = new MessageMenuOption().setLabel('Şeftali').setEmoji('🍑').setValue('rol_menu_meyve_şeftali').setDescription('Meyve Rolünüz Verildi.')   
let select = new MessageMenu().setID('rol_menu_meyve').setPlaceholder('Rol seç!').setMaxValues(7).setMinValues(1)
.addOptions([meyve1, meyve2, meyve3, meyve4,meyve5,meyve6,meyve7,meyve8,meyve9,meyve10,meyve11,meyve12,meyve13,meyve14,meyve15,meyve16,meyve17])
return await message.channel.send("**Oyun Rollerinizi Almak İçin Buttonu Kullanınız.**", {
component: select
});
} else  if(message.content === ".buton5") {
if (message.author.id !== "702133327443787807") return;
let hayvan1 = new MessageMenuOption().setLabel('At').setEmoji('🐎').setValue('rol_menu_hayvan_at').setDescription('Hayvan rolünü verir.')
let hayvan2 = new MessageMenuOption().setLabel('Kurt').setEmoji('🐺').setValue('rol_menu_hayvan_kurt').setDescription('Hayvan rolünü verir.')
let hayvan3 = new MessageMenuOption().setLabel('Maymun').setEmoji('🐵').setValue('rol_menu__maymun').setDescription('Hayvan Rolünüz Verildi.')    
let hayvan4 = new MessageMenuOption().setLabel('Kedi').setEmoji('😺').setValue('rol_menu_hayvan_kedi').setDescription('Hayvan Rolünüz Verildi.')     
let hayvan5 = new MessageMenuOption().setLabel('Tavşan').setEmoji('🐰').setValue('rol_menu_hayvan_tavşan').setDescription('Hayvan Rolünüz Verildi.')   
let hayvan6 = new MessageMenuOption().setLabel('Tilki').setEmoji('🦊').setValue('rol_menu_hayvan_tilki').setDescription('Hayvan Rolünüz Verildi.')   
let hayvan7 = new MessageMenuOption().setLabel('Ayı').setEmoji('🐻').setValue('rol_menu_hayvan_ayı').setDescription('Hayvan Rolünüz Verildi.')    
let hayvan8 = new MessageMenuOption().setLabel('Panda').setEmoji('🐼').setValue('rol_menu_hayvan_panda').setDescription('Hayvan Rolünüz Verildi.')    
let hayvan9 = new MessageMenuOption().setLabel('Kaplan').setEmoji('🐅').setValue('rol_menu_hayvan_kaplan').setDescription('Hayvan Rolünüz Verildi.') 
let hayvan10 = new MessageMenuOption().setLabel('Aslan').setEmoji('🦁').setValue('rol_menu_hayvan_aslan').setDescription('Hayvan Rolünüz Verildi.')   
let hayvan11 = new MessageMenuOption().setLabel('İnek').setEmoji('🐄').setValue('rol_menu_hayvan_inek').setDescription('Hayvan Rolünüz Verildi.')  
let select = new MessageMenu().setID('rol_menu_hayvan').setPlaceholder('Rol seç!').setMaxValues(7).setMinValues(1)
.addOptions([hayvan1, hayvan2, hayvan3, hayvan4,hayvan5,hayvan6,hayvan7,hayvan8,hayvan9,hayvan10,hayvan11])
return await message.channel.send("**Oyun Rollerinizi Almak İçin Buttonu Kullanınız.**", {
component: select
});
} else  if(message.content === ".buton") {
if (message.author.id !== "702133327443787807") return;
await message.delete();
let option1 = new MessageMenuOption().setLabel('Sevgilim Yok').setEmoji('890233443504513044').setValue('gf_menu_alone').setDescription('Sevgilisi olmayanlar için rol.')
let option2 = new MessageMenuOption().setLabel('Sevgilim Var').setEmoji('862041019876114442').setValue('gf_menu_couple').setDescription('Sevgilisi olanlar için.')       
let option3 = new MessageMenuOption().setLabel('Sevgili Yapmıyorum').setEmoji('862041021433380864').setValue('gf_menu_nocouple').setDescription('Sevgilisi olanlar için.')            
let select = new MessageMenu().setID('gf_menu').setPlaceholder('Rol seç!').setMaxValues(1).setMinValues(1).addOptions([option1, option2,option3])
return await message.channel.send("**İlişki Durumunuzu Seçmek İçin Buttona Tıklayınız.**", {
component: select
});

}

});
*/