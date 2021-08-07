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
const swear = ["@here", "@everyone", "anskm", "orosbu", "orosb", "0r0spuc0cu", "4n4n1 sk3r1m", "p1c", "@n@nı skrm", "evladi", "orsb", "orsbcogu", "amnskm", "anaskm", "mk", "oc", "abaza", "abazan", "ag", "ağzına sıçayım", "fuck", "shit", "ahmak", "seks", "sex", "allahsız", "amarım", "ambiti", "am biti", "amcığı", "amcığın", "amcığını", "amcığınızı", "amcık", "amcık hoşafı", "amcıklama", "amcıklandı", "amcik", "amck", "amckl", "amcklama", "amcklaryla", "amckta", "amcktan", "amcuk", "amık", "amına", "amınako", "amına koy", "amına koyarım", "amına koyayım", "amınakoyim", "amına koyyim", "amına s", "amına sikem", "amına sokam", "amın feryadı", "amını", "amını s", "amın oglu", "amınoğlu", "amın oğlu", "amısına", "amısını", "amina", "amina g", "amina k", "aminako", "aminakoyarim", "amina koyarim", "amina koyayım", "amina koyayim", "aminakoyim", "aminda", "amindan", "amindayken", "amini", "aminiyarraaniskiim", "aminoglu", "amin oglu", "amiyum", "amk", "amkafa", "amk çocuğu", "amlarnzn", "amlı", "amm", "ammak", "ammna", "amn", "amna", "amnda", "amndaki", "amngtn", "amnn", "amona", "amq", "amsız", "amsiz", "amsz", "amteri", "amugaa", "amuğa", "amuna", "ana", "anaaann", "anal", "analarn", "anam", "anamla", "anan", "anana", "anandan", "ananı", "ananı", "ananın", "ananın am", "ananın amı", "ananın dölü", "ananınki", "ananısikerim", "ananı sikerim", "ananısikeyim", "ananı sikeyim", "ananızın", "ananızın am", "anani", "ananin", "ananisikerim", "anani sikerim",
"ananisikeyim", "anani sikeyim", "anann", "ananz", "anas", "anasını", "anasının am", "anası orospu", "anasi", "anasinin", "anay", "anayin", "angut", "anneni", "annenin", "annesiz", "anuna", "aptal", "aq", "a.q", "a.q.", "aq.", "ass",
"atkafası", "atmık", "attırdığım", "attrrm", "auzlu", "avrat", "ayklarmalrmsikerim", "azdım", "azdır", "azdırıcı", "babaannesi kaşar", "babanı", "babanın", "babani", "babası pezevenk", "bacağına sıçayım", "bacına", "bacını",
"bacının", "bacini", "bacn", "bacndan", "bacy", "bastard", "basur", "beyinsiz", "bızır", "bitch", "biting", "bok", "boka", "bokbok", "bokça", "bokhu", "bokkkumu", "boklar", "boktan", "boku", "bokubokuna", "bokum", "bombok", "boner", "bosalmak", "boşalmak", "cenabet", "cibiliyetsiz", "cibilliyetini", "cibilliyetsiz", "cif", "cikar", "cim", "çük", "dalaksız", "dallama", "daltassak", "dalyarak", "dalyarrak", "dangalak", "dassagi", "diktim", "dildo", "dingil", "dingilini", "dinsiz", "dkerim", "domal", "domalan", "domaldı", "domaldın", "domalık", "domalıyor", "domalmak", "domalmış", "domalsın", "domalt", "domaltarak", "domaltıp", "domaltır", "domaltırım", "domaltip", "domaltmak", "dölü", "dönek", "düdük", "eben", "ebeni", "ebenin", "ebeninki", "ebleh", "ecdadını", "ecdadini", "embesil", "emi", "fahise", "fahişe", "feriştah", "ferre", "fuck", "fucker", "fuckin", "fucking", "gavad", "gavat", "geber", "geberik", "gebermek",
"gebermiş", "gebertir", "gerızekalı", "gerizekalı", "gerizekali", "gerzek", "giberim", "giberler", "gibis", "gibiş", "gibmek", "gibtiler", "goddamn", "godoş", "godumun", "gotelek", "gotlalesi", "gotlu", "gotten", "gotundeki",
"gotunden", "gotune", "gotunu", "gotveren", "goyiim", "goyum", "goyuyim", "goyyim", "göt", "göt deliği", "götelek", "göt herif", "götlalesi", "götlek", "götoğlanı", "göt oğlanı", "götoş", "götten", "götü", "götün", "götüne",
"götünekoyim", "götüne koyim", "götünü", "götveren", "göt veren", "göt verir", "gtelek", "gtn", "gtnde", "gtnden", "gtne", "gtten", "gtveren", "hasiktir", "hassikome", "hassiktir", "has siktir", "hassittir", "haysiyetsiz",
"hayvan herif", "hoşafı", "hödük", "hsktr", "huur", "ıbnelık", "ibina", "ibine", "ibinenin", "ibne", "ibnedir", "ibneleri", "ibnelik", "ibnelri", "ibneni", "ibnenin", "ibnerator", "ibnesi", "idiot", "idiyot", "imansz", "ipne",
"iserim", "işerim", "itoğlu it", "kafam girsin", "kafasız", "kafasiz", "kahpe", "kahpenin", "kahpenin feryadı", "kaka", "kaltak", "kancık", "kancik", "kappe", "karhane", "kaşar", "kavat", "kavatn", "kaypak", "kayyum", "kerane",
"kerhane", "kerhanelerde", "kevase", "kevaşe", "kevvase", "koca göt", "koduğmun", "koduğmunun", "kodumun", "kodumunun", "koduumun", "koyarm", "koyayım", "koyiim", "koyiiym", "koyim", "koyum", "koyyim", "krar", "kukudaym",
"laciye boyadım", "lavuk", "liboş", "madafaka", "mal", "malafat", "malak", "manyak", "mcik", "meme", "memelerini", "mezveleli", "minaamcık", "mincikliyim", "mna", "monakkoluyum", "motherfucker", "mudik", "oc", "ocuu", "ocuun",
"Oç", "oç", "o. çocuğu", "oğlan", "oğlancı", "oğlu it", "orosbucocuu", "orospu", "orospucocugu", "orospu cocugu", "orospu çoc", "orospuçocuğu", "orospu çocuğu", "orospu çocuğudur", "orospu çocukları", "orospudur", "orospular",
"orospunun", "orospunun evladı", "orospuydu", "orospuyuz", "orostoban", "orostopol", "orrospu", "oruspu", "oruspuçocuğu", "oruspu çocuğu", "osbir", "ossurduum", "ossurmak", "ossuruk", "osur", "osurduu", "osuruk", "osururum",
"otuzbir", "öküz", "öşex", "patlak zar", "penis", "pezevek", "pezeven", "pezeveng", "pezevengi", "pezevengin evladı", "pezevenk", "pezo", "pic", "pici", "picler", "piç", "piçin oğlu", "piç kurusu", "piçler", "pipi", "pipiş", "pisliktir",
"porno", "pussy", "puşt", "puşttur", "rahminde", "revizyonist", "s1kerim", "s1kerm", "s1krm", "sakso", "saksofon", "salaak", "salak", "saxo", "sekis", "serefsiz", "sevgi koyarım", "sevişelim", "sexs", "sıçarım", "sıçtığım", "sıecem",
"sicarsin", "sie", "sik", "sikdi", "sikdiğim", "sike", "sikecem", "sikem", "siken", "sikenin", "siker", "sikerim", "sikerler", "sikersin", "sikertir", "sikertmek", "sikesen", "sikesicenin", "sikey", "sikeydim", "sikeyim", "sikeym",
"siki", "sikicem", "sikici", "sikien", "sikienler", "sikiiim", "sikiiimmm", "sikiim", "sikiir", "sikiirken", "sikik", "sikil", "sikildiini", "sikilesice", "sikilmi", "sikilmie", "sikilmis", "sikilmiş", "sikilsin", "sikim", "sikimde",
"sikimden", "sikime", "sikimi", "sikimiin", "sikimin", "sikimle", "sikimsonik", "sikimtrak", "sikin", "sikinde", "sikinden", "sikine", "sikini", "sikip", "sikis", "sikisek", "sikisen", "sikish", "sikismis", "sikiş", "sikişen",
"sikişme", "sikitiin", "sikiyim", "sikiym", "sikiyorum", "sikkim", "sikko", "sikleri", "sikleriii", "sikli", "sikm", "sikmek", "sikmem", "sikmiler", "sikmisligim", "siksem", "sikseydin", "sikseyidin", "siksin", "siksinbaya",
"siksinler", "siksiz", "siksok", "siksz", "sikt", "sikti", "siktigimin", "siktigiminin", "siktiğim", "siktiğimin", "siktiğiminin", "siktii", "siktiim", "siktiimin", "siktiiminin", "siktiler", "siktim", "siktim", "siktimin",
"siktiminin", "siktir", "siktir et", "siktirgit", "siktir git", "siktirir", "siktiririm", "siktiriyor", "siktir lan", "siktirolgit", "siktir ol git", "sittimin", "sittir", "skcem", "skecem", "skem", "sker", "skerim", "skerm",
"skeyim", "skiim", "skik", "skim", "skime", "skmek", "sksin", "sksn", "sksz", "sktiimin", "sktrr", "skyim", "slaleni", "sokam", "sokarım", "sokarim", "sokarm", "sokarmkoduumun", "sokayım", "sokaym", "sokiim", "soktuğumunun", "sokuk",
"sokum", "sokuş", "sokuyum", "soxum", "sulaleni", "sülaleni", "sülalenizi", "sürtük", "şerefsiz", "şıllık", "taaklarn", "taaklarna", "tarrakimin", "tasak", "tassak", "taşak", "taşşak", "tipini s.k", "tipinizi s.keyim", "tiyniyat",
"toplarm", "topsun", "totoş", "vajina", "vajinanı", "veled", "veledizina", "veled i zina", "verdiimin", "weled", "weledizina", "whore", "xikeyim", "yaaraaa", "yalama", "yalarım", "yalarun", "yaraaam", "yarak", "yaraksız", "yaraktr",
"yaram", "yaraminbasi", "yaramn", "yararmorospunun", "yarra", "yarraaaa", "yarraak", "yarraam", "yarraamı", "yarragi", "yarragimi", "yarragina", "yarragindan", "yarragm", "yarrağ", "yarrağım", "yarrağımı", "yarraimin", "yarrak",
"yarram", "yarramin", "yarraminbaşı", "yarramn", "yarran", "yarrana", "yarrrak", "yavak", "yavş", "yavşak", "yavşaktır", "yavuşak", "yılışık", "yilisik", "yogurtlayam", "yoğurtlayam", "yrrak", "zıkkımım", "zibidi", "zigsin", "zikeyim",
"zikiiim", "zikiim", "zikik", "zikim", "ziksiiin", "ziksiin", "zulliyetini", "zviyetini", "4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka",
"asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch",
"bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs",
"booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris",
"clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok",
"cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts",
"cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker",
"doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag",
"fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio",
"fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook",
"fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker",
"fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell",
"heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead",
"knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate",
"masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz",
"mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin",
"motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah",
"niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing",
"scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"
]
client.on("message", async (message) => {
    if (message.author.bot || !message.guild)
    if (message.guild.owner || message.member.hasPermission('ADMINISTRATOR')) return; 
    if (swear.some(cay=> `${message.content.toLowerCase()}`.includes(`${cay}`))) { 
    if (message && message.deletable) message.delete({ timeout: 0150 }).catch() 
    return message.reply('Lütfen chat kurallarına uyalımım öhöm :d').then(x => x.delete({timeout: 6000}))
    }})

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (newMessage.author.bot || !newMessage.guild)
    if (newMessage.guild.owner || messagnewMessage.member.hasPermission('ADMINISTRATOR')) return; 
    if (swear.some(cay=> `${newMessage.content.toLowerCase()}`.includes(`${cay}`))) { 
    if (newMessage && newMessage.deletable) newMessage.delete({ timeout: 0150 }).catch() 
    return message.reply('Lütfen chat kurallarına uyalımım öhöm :d').then(x => x.delete({timeout: 6000}))
    }})