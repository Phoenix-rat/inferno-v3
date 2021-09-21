const low = require('lowdb');
const Discord = require("discord.js");
const afkdata = require('../../../../MODELS/Temprorary/AfkData');
const Points_config = require('../../../../MODELS/Economy/Points_config');
const Points_profile = require('../../../../MODELS/Economy/Points_profile');
const tagged = require('../../../../MODELS/Temprorary/tagged');
const { comparedate, checkMins, checkHours, checkSecs } = require('../../../../HELPERS/functions');
const Tagli = require('../../../../MODELS/Datalake/Tagli');
const stat_msg = require("../../../../MODELS/StatUses/stat_msg.js");
const moment = require("moment");
require('moment-duration-format');
moment.locale("tr");

module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run(message) {
        const client = this.client;
        if (message.guild && (message.guild.id !== client.config.server)) return;
        if (message.author.bot) return;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let myCooldown = client.spamwait[message.author.id];
        if (!myCooldown) {
            client.spamwait[message.author.id] = {};
            myCooldown = client.spamwait[message.author.id];
        };
        let mytime = myCooldown[message.content] || 0;
        if (mytime && (mytime > Date.now()) && !message.member.permissions.has("ADMINISTRATOR") && !message.author.bot && (message.channel.id !== '863118599026638868')) {
            let myCount = client.spamcounts[message.author.id];
            if (!myCount) {
                this.client.spamcounts[message.author.id] = {};
                myCount = this.client.spamcounts[message.author.id];
                //console.log(uCount);
            };
            let count = myCount[message.content] || 0;
            //console.log(uCount);
            if (count === 1) message.channel.send(`Spamlamaya devam edersen muteleneceksin! ${message.author}`);
            if (count === 3) {
                message.member.roles.add(roles.get("muted").value());
                message.channel.send(`${message.member} Spam yaptığın için mutelendin!`)
            }


            if (count >= 1) await message.delete();
            this.client.spamcounts[message.author.id][message.content] = count + 1;
        }
        this.client.spamwait[message.author.id][message.content] = Date.now() + 3000;
        if (message.member.roles.cache.has(roles.get("welcome").value()) && (message.content === "393") && ((message.channel.id === channels.get("welcome").value()) || (message.channel.id === channels.get("otb").value()))) {
            message.delete();
            await message.member.roles.remove(message.member.roles.cache.filter(r => r.id !== roles.get("booster").value()).array());
            await message.member.roles.add(roles.get("otb").value());
        }
        if (message.member.roles.cache.has(roles.get("welcome").value()) && (message.content === "393") && ((message.channel.id === channels.get("welcome").value()) || (message.channel.id === channels.get("otb").value()))) {
            message.delete();
            await message.member.roles.remove(message.member.roles.cache.filter(r => r.id !== roles.get("booster").value()).array());
            await message.member.roles.add(roles.get("otbmisafir").value());
        }
        let system = await afkdata.findOne({ _id: message.member.user.id });
        if (system) {
            await afkdata.deleteOne({ _id: message.member.user.id });
            const afkMsg = await message.channel.send(`${message.member} Hoş geldin! ${checkMins(system.created) <= 1 ? "Biraz" : `**${moment.duration(new Date().getTime() - system.created.getTime()).format("D [Gün], H [Saat], m [Dakika]")}**`} önce afk olmuştun.${system.inbox.length > 0 ? ` Birkaç mesajın var eğer bakmak istersen emojiye basabilirsin.` : ""}`);
            if (system.inbox.length > 0) {
                await afkMsg.react(emojis.get("afk").value().split(':')[2].replace('>', ''));
                const filter = (reaction, user) => user.id !== this.client.user.id;
                const collector = afkMsg.createReactionCollector(filter, {
                    time: 15000
                });
                collector.on("collect", async (reaction, user) => {
                    if (user.id !== message.member.user.id) return reaction.users.remove(user);
                    collector.stop("ok");
                    if (reaction.emoji.id === emojis.get("afk").value().split(':')[2].replace('>', '')) {
                        if (message.channel.id !== channels.get("bot_komut").value()) await afkMsg.edit(`${message.member} Hoş geldin! Mesajların daha temiz bir chat için <#${channels.get("bot_komut").value()}> kanalına gönderildi.`);
                        await message.guild.channels.cache.get(channels.get("bot_komut").value()).send({
                            content: `${message.member}, **${system.inbox.length}** yeni mesajın mevcut.`,
                            embeds: [new Discord.MessageEmbed().setColor(`${message.member.displayHexColor}`).setDescription(`${system.inbox.map(content => `[${message.guild.members.cache.get(content.userID) || "Bilinmiyor"}]: ${content.content} [🔗](${content.url})`).join('\n')}`)]
                        });
                    }
                });
            }
        }
        if (message.mentions.members.first()) {
            const afksindata = await afkdata.find();
            const afks = message.mentions.members.array().filter(m => afksindata.some(doc => doc._id === m.user.id));
            if (afks.length > 0) {
                await message.channel.send(afks.map(afk => `${afk},  ${afksindata.find(data => data._id === afk.user.id).reason ? `\`${afksindata.find(data => data._id === afk.user.id).reason}\` sebebiyle,` : ""} **${checkMins(afksindata.find(data => data._id === afk.user.id).created) < 1 ? "biraz" : moment.duration(new Date().getTime() - afksindata.find(data => data._id === afk.user.id).created.getTime()).format("D [Gün], H [Saat], m [Dakika]")} önce** AFK oldu.`, { allowedMentions: { repliedUser: false } }).join('\n'));
                await afks.forEach(async afk => {
                    await afkdata.updateOne({ _id: afk.user.id }, {
                        $push: {
                            inbox: {
                                content: message.content,
                                userID: message.author.id,
                                url: message.url
                            }
                        }
                    });
                });
            }
        }
        const elebaşı = ["discord.gg/", "discord.com/invite/", "discordapp.com/invite/", "discord.me/"];
        if (message.guild && elebaşı.some(link => message.content.includes(link))) {
            let anan = [];
            await message.guild.fetchInvites().then(async (invs) => {
                invs.forEach(async (inv) => {
                    anan.push(inv.code);
                });
                anan.push(utils.get("vanityURL").value());
                anan.push('')
            });
            for (let c = 0; c < elebaşı.length; c++) {
                const ele = elebaşı[c];
                if (message.content.includes(ele)) {
                    const mesaj = message.content.split(ele).slice(1).map(sth => sth.split(' ')[0]);
                    mesaj.forEach(async msg => {
                        if (!anan.some(kod => msg === kod) && !message.member.permissions.has("ADMINISTRATOR")) {
                            message.guild.members.ban(message.author.id, { days: 2, reason: 'REKLAM' });
                            await message.delete();
                        }
                    });
                }
            }
        }

        //

        const msgStat = await stat_msg.findOne({ _id: message.author.id });
        if (!msgStat) {
            if (!message.guild || message.author.bot) return
            await stat_msg.create({
                _id: message.author.id,
                records: [
                    {
                        channel: message.channel.id,
                        content: message.content,
                        created: new Date()
                    }
                ]
            });
        } else {
            if (!message.guild || message.author.bot) return
            await stat_msg.updateOne({ _id: message.author.id }, {
                $push: {
                    records: {
                        channel: message.channel.id,
                        content: message.content,
                        created: new Date()
                    }
                }
            });
        }

        if (message.activity) {
            if (message.activity.partyID.includes("spotify:")) {
                if (message.member.hasPermission("ADMINISTRATOR")) return
                message.delete({ timeout: 100 }).catch(e => { });
                message.reply(`Sunucuda Spotify parti istekleri kapatılmıştır.`).then(x => x.delete({ timeout: 4000 })).catch(e => { });
            }
        }
        /*   let kufurler = ["aw","allahoc", "allahoç", "allahamk", "allahaq", "0r0spuc0cu", "4n4n1 sk3r1m", "p1c", "@n@nı skrm", "evladi", "orsb", "orsbcogu", "amnskm", "anaskm", "mk", "oc", "abaza", "abazan", "ag", "a\u011fz\u0131na s\u0131\u00e7ay\u0131m", "fuck", "shit", "ahmak", "seks", "sex", "allahs\u0131z", "amar\u0131m", "ambiti", "am biti", "amc\u0131\u011f\u0131", "amc\u0131\u011f\u0131n", "amc\u0131\u011f\u0131n\u0131", "amc\u0131\u011f\u0131n\u0131z\u0131", "amc\u0131k", "amc\u0131k ho\u015faf\u0131", "amc\u0131klama", "amc\u0131kland\u0131", "amcik", "amck", "amckl", "amcklama", "amcklaryla", "amckta", "amcktan", "amcuk", "am\u0131k", "am\u0131na", "amına", "am\u0131nako", "am\u0131na koy", "am\u0131na koyar\u0131m", "am\u0131na koyay\u0131m", "am\u0131nakoyim", "am\u0131na koyyim", "am\u0131na s", "am\u0131na sikem", "am\u0131na sokam", "am\u0131n feryad\u0131", "am\u0131n\u0131", "am\u0131n\u0131 s", "am\u0131n oglu", "am\u0131no\u011flu", "am\u0131n o\u011flu", "am\u0131s\u0131na", "am\u0131s\u0131n\u0131", "amina", "amina g", "amina k", "aminako", "aminakoyarim", "amina koyarim", "amina koyay\u0131m", "amina koyayim", "aminakoyim", "aminda", "amindan", "amindayken", "amini", "aminiyarraaniskiim", "aminoglu", "amin oglu", "amiyum", "amk", "amkafa", "amk \u00e7ocu\u011fu", "amlarnzn", "aml\u0131", "amm", "ammak", "ammna", "amn", "amna", "amnda", "amndaki", "amngtn", "amnn", "amona", "amq", "ams\u0131z", "amsiz", "amsz", "amteri", "amugaa", "amu\u011fa", "amuna", "ana", "anaaann", "anal", "analarn", "anam", "anamla", "anan", "anana", "anandan", "anan\u0131", "anan\u0131", "anan\u0131n", "anan\u0131n am", "anan\u0131n am\u0131", "anan\u0131n d\u00f6l\u00fc", "anan\u0131nki", "anan\u0131sikerim", "anan\u0131 sikerim", "anan\u0131sikeyim", "anan\u0131 sikeyim", "anan\u0131z\u0131n", "anan\u0131z\u0131n am", "anani", "ananin", "ananisikerim", "anani sikerim", "ananisikeyim", "anani sikeyim", "anann", "ananz", "anas", "anas\u0131n\u0131", "anas\u0131n\u0131n am", "anas\u0131 orospu", "anasi", "anasinin", "anay", "anayin", "angut", "anneni", "annenin", "annesiz", "anuna", "aq", "a.q", "a.q.", "aq.", "ass", "atkafas\u0131", "atm\u0131k", "att\u0131rd\u0131\u011f\u0131m", "attrrm", "auzlu", "avrat", "ayklarmalrmsikerim", "azd\u0131m", "azd\u0131r", "azd\u0131r\u0131c\u0131", "babaannesi ka\u015far", "baban\u0131", "baban\u0131n", "babani", "babas\u0131 pezevenk", "baca\u011f\u0131na s\u0131\u00e7ay\u0131m", "bac\u0131na", "bac\u0131n\u0131", "bac\u0131n\u0131n", "bacini", "bacn", "bacndan", "bacy", "bastard", "basur", "beyinsiz", "b\u0131z\u0131r", "bitch", "biting", "boner", "bosalmak", "bo\u015falmak", "cenabet", "cibiliyetsiz", "cibilliyetini", "cibilliyetsiz", "cif", "cikar", "cim", "\u00e7\u00fck", "dalaks\u0131z", "dallama", "daltassak", "dalyarak", "dalyarrak", "dangalak", "dassagi", "diktim", "dildo", "dingil", "dingilini", "dinsiz", "dkerim", "domal", "domalan", "domald\u0131", "domald\u0131n", "domal\u0131k", "domal\u0131yor", "domalmak", "domalm\u0131\u015f", "domals\u0131n", "domalt", "domaltarak", "domalt\u0131p", "domalt\u0131r", "domalt\u0131r\u0131m", "domaltip", "domaltmak", "d\u00f6l\u00fc", "d\u00f6nek", "d\u00fcd\u00fck", "eben", "ebeni", "ebenin", "ebeninki", "ebleh", "ecdad\u0131n\u0131", "ecdadini", "embesil", "emi", "fahise", "fahi\u015fe", "feri\u015ftah", "ferre", "fuck", "fucker", "fuckin", "fucking", "gavad", "gavat", "giberim", "giberler", "gibis", "gibi\u015f", "gibmek", "gibtiler", "goddamn", "godo\u015f", "godumun", "gotelek", "gotlalesi", "gotlu", "gotten", "gotundeki", "gotunden", "gotune", "gotunu", "gotveren", "goyiim", "goyum", "goyuyim", "goyyim", "g\u00f6t", "g\u00f6t deli\u011fi", "g\u00f6telek", "g\u00f6t herif", "g\u00f6tlalesi", "g\u00f6tlek", "g\u00f6to\u011flan\u0131", "g\u00f6t o\u011flan\u0131", "g\u00f6to\u015f", "g\u00f6tten", "g\u00f6t\u00fc", "g\u00f6t\u00fcn", "g\u00f6t\u00fcne", "g\u00f6t\u00fcnekoyim", "g\u00f6t\u00fcne koyim", "g\u00f6t\u00fcn\u00fc", "g\u00f6tveren", "g\u00f6t veren", "g\u00f6t verir", "gtelek", "gtn", "gtnde", "gtnden", "gtne", "gtten", "gtveren", "hasiktir", "hassikome", "hassiktir", "has siktir", "hassittir", "haysiyetsiz", "hayvan herif", "ho\u015faf\u0131", "h\u00f6d\u00fck", "hsktr", "huur", "\u0131bnel\u0131k", "ibina", "ibine", "ibinenin", "ibne", "ibnedir", "ibneleri", "ibnelik", "ibnelri", "ibneni", "ibnenin", "ibnerator", "ibnesi", "idiot", "idiyot", "imansz", "ipne", "iserim", "i\u015ferim", "ito\u011flu it", "kafam girsin", "kafas\u0131z", "kafasiz", "kahpe", "kahpenin", "kahpenin feryad\u0131", "kaka", "kaltak", "kanc\u0131k", "kancik", "kappe", "karhane", "ka\u015far", "kavat", "kavatn", "kaypak", "kayyum", "kerane", "kerhane", "kerhanelerde", "kevase", "keva\u015fe", "kevvase", "koca g\u00f6t", "kodu\u011fmun", "kodu\u011fmunun", "kodumun", "kodumunun", "koduumun", "koyarm", "koyay\u0131m", "koyiim", "koyiiym", "koyim", "koyum", "koyyim", "krar", "kukudaym", "laciye boyad\u0131m", "libo\u015f", "madafaka", "malafat", "malak", "mcik", "meme", "memelerini", "mezveleli", "minaamc\u0131k", "mincikliyim", "mna", "monakkoluyum", "motherfucker", "mudik", "oc", "ocuu", "ocuun", "O\u00c7", "o\u00e7", "o. \u00e7ocu\u011fu", "o\u011flan", "o\u011flanc\u0131", "o\u011flu it", "orosbucocuu", "orospu", "orospucocugu", "orospu cocugu", "orospu \u00e7oc", "orospu\u00e7ocu\u011fu", "orospu \u00e7ocu\u011fu", "orospu \u00e7ocu\u011fudur", "orospu \u00e7ocuklar\u0131", "orospudur", "orospular", "orospunun", "orospunun evlad\u0131", "orospuydu", "orospuyuz", "orostoban", "orostopol", "orrospu", "oruspu", "oruspu\u00e7ocu\u011fu", "oruspu \u00e7ocu\u011fu", "osbir", "ossurduum", "ossurmak", "ossuruk", "osur", "osurduu", "osuruk", "osururum", "otuzbir", "\u00f6k\u00fcz", "\u00f6\u015fex", "patlak zar", "penis", "pezevek", "pezeven", "pezeveng", "pezevengi", "pezevengin evlad\u0131", "pezevenk", "pezo", "pic", "pici", "picler", "pi\u00e7", "pi\u00e7in o\u011flu", "pi\u00e7 kurusu", "pi\u00e7ler", "pipi", "pipi\u015f", "pisliktir", "porno", "pussy", "pu\u015ft", "pu\u015fttur", "rahminde", "revizyonist", "s1kerim", "s1kerm", "s1krm", "sakso", "saksofon", "saxo", "sekis", "serefsiz", "sevgi koyar\u0131m", "sevi\u015felim", "sexs", "s\u0131\u00e7ar\u0131m", "s\u0131\u00e7t\u0131\u011f\u0131m", "s\u0131ecem", "sicarsin", "sie", "sik", "sikdi", "sikdi\u011fim", "sike", "sikecem", "sikem", "siken", "sikenin", "siker", "sikerim", "sikerler", "sikersin", "sikertir", "sikertmek", "sikesen", "sikesicenin", "sikey", "sikeydim", "sikeyim", "sikeym", "siki", "sikicem", "sikici", "sikien", "sikienler", "sikiiim", "sikiiimmm", "sikiim", "sikiir", "sikiirken", "sikik", "sikil", "sikildiini", "sikilesice", "sikilmi", "sikilmie", "sikilmis", "sikilmi\u015f", "sikilsin", "sikim", "sikimde", "sikimden", "sikime", "sikimi", "sikimiin", "sikimin", "sikimle", "sikimsonik", "sikimtrak", "sikin", "sikinde", "sikinden", "sikine", "sikini", "sikip", "sikis", "sikisek", "sikisen", "sikish", "sikismis", "siki\u015f", "siki\u015fen", "siki\u015fme", "sikitiin", "sikiyim", "sikiym", "sikiyorum", "sikkim", "sikko", "sikleri", "sikleriii", "sikli", "sikm", "sikmek", "sikmem", "sikmiler", "sikmisligim", "siksem", "sikseydin", "sikseyidin", "siksin", "siksinbaya", "siksinler", "siksiz", "siksok", "siksz", "sikt", "sikti", "siktigimin", "siktigiminin", "sikti\u011fim", "sikti\u011fimin", "sikti\u011fiminin", "siktii", "siktiim", "siktiimin", "siktiiminin", "siktiler", "siktim", "siktim", "siktimin", "siktiminin", "siktir", "siktir et", "siktirgit", "siktir git", "siktirir", "siktiririm", "siktiriyor", "siktir lan", "siktirolgit", "siktir ol git", "sittimin", "sittir", "skcem", "skecem", "skem", "sker", "skerim", "skerm", "skeyim", "skiim", "skik", "skim", "skime", "skmek", "sksin", "sksn", "sksz", "sktiimin", "sktrr", "skyim", "slaleni", "sokam", "sokar\u0131m", "sokarim", "sokarm", "sokarmkoduumun", "sokay\u0131m", "sokaym", "sokiim", "soktu\u011fumunun", "sokuk", "sokum", "soku\u015f", "sokuyum", "soxum", "sulaleni", "s\u00fclaleni", "s\u00fclalenizi", "s\u00fcrt\u00fck", "\u015ferefsiz", "\u015f\u0131ll\u0131k", "taaklarn", "taaklarna", "tarrakimin", "tasak", "tassak", "ta\u015fak", "ta\u015f\u015fak", "tipini s.k", "tipinizi s.keyim", "tiyniyat", "toplarm", "topsun", "toto\u015f", "vajina", "vajinan\u0131", "veled", "veledizina", "veled i zina", "verdiimin", "weled", "weledizina", "whore", "xikeyim", "yaaraaa", "yalama", "yalar\u0131m", "yalarun", "yaraaam", "yarak", "yaraks\u0131z", "yaraktr", "yaram", "yaraminbasi", "yaramn", "yararmorospunun", "yarra", "yarraaaa", "yarraak", "yarraam", "yarraam\u0131", "yarragi", "yarragimi", "yarragina", "yarragindan", "yarragm", "yarra\u011f", "yarra\u011f\u0131m", "yarra\u011f\u0131m\u0131", "yarraimin", "yarrak", "yarram", "yarramin", "yarraminba\u015f\u0131", "yarramn", "yarran", "yarrana", "yarrrak", "yavak", "yav\u015f", "yav\u015fak", "yav\u015fakt\u0131r", "yavu\u015fak", "y\u0131l\u0131\u015f\u0131k", "yilisik", "yogurtlayam", "yo\u011furtlayam", "yrrak", "z\u0131kk\u0131m\u0131m", "zibidi", "zigsin", "zikeyim", "zikiiim", "zikiim", "zikik", "zikim", "ziksiiin", "ziksiin", "zulliyetini", "zviyetini"];
           if (kufurler.some(klm => message.content.toLowerCase().includes(klm))) {
               if(message.member.hasPermission("ADMINISTRATOR")) return
               if (message && message.deletable) message.delete({ timeout: 100 }).catch(() => {});
               return message.reply(`Küfür içeren mesajlar kullanmaya devam edersen cezalandırılacaksın!`).then(a => a.delete({timeout: 4000})).catch(() => {});
           }*/

        //
        const pointData = await Points_profile.findOne({ _id: message.author.id });
        if (pointData) {
            const pointConfig = await Points_config.findOne({ _id: pointData.role });
            if (pointData) await Points_profile.updateOne({ _id: message.author.id }, {
                $inc: { msgPoints: pointConfig.message }
            });
        }
        if (message.content === 'onay') {
            const tagData = await tagged.find({ target: message.author.id });
            if (tagData && (tagData.length !== 0)) {
                const myTagData = tagData.sort((a, b) => comparedate(b.created) - comparedate(a.created))[0];
                if (myTagData && (checkMins(myTagData.created) < 3)) {
                    await Tagli.updateOne({ _id: message.author.id }, { $set: { claimed: myTagData.executor } });
                    const msgTagged = await message.guild.channels.cache.get(myTagData.channelID).messages.fetch(myTagData._id);
                    await msgTagged.reactions.removeAll();
                    await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                    await msgTagged.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
                    const pointData = await Points_profile.findOne({ _id: myTagData.executor });
                    if (pointData) {
                        const pointConfig = await Points_config.findOne({ _id: pointData.roleID });
                        if (pointData && !pointData.points.filter(point => point.type === "tagged").find(point => point.target === message.author.id)) await Points_profile.updateOne({ _id: myTagData.executor }, {
                            $push: {
                                points: {
                                    type: "tagged",
                                    points: pointConfig.tagged,
                                    target: message.author.id
                                }
                            }
                        });
                    }
                }
            }
        }
        if (!message.content.startsWith(client.config.prefix)) return;
        if (message.author.bot) return;
        let command = message.content.split(' ')[0].slice(client.config.prefix.length);
        let cmd;
        let args = message.content.split(' ').slice(1);
        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            cmd = client.commands.get(client.aliases.get(command));
        } else return;
        const embed = new Discord.MessageEmbed();






        if (!cmd.config.enabled) return;
        if (cmd.config.dmCmd && (message.channel.type !== 'dm')) return message.channel.send(`${emojis.get("dmcmd").value()} Bu komut bir ** DM ** komutudur.`);
        if (cmd.config.ownerOnly && (message.author.id !== client.config.owner) && (message.author.id !== "853011311328100411")) return message.channel.send(`${emojis.get("tantus").value()} Bu komutu sadece ${client.owner} kullanabilir.`);
        if (cmd.config.onTest && !utils.get("testers").value().includes(message.author.id) && (message.author.id !== client.config.owner) && (message.author.id !== "853011311328100411")) return message.channel.send(`${emojis.get("ontest").value()} Bu komut henüz ** test aşamasındadır **.`);
        if (cmd.config.rootOnly && !utils.get("mod").value().includes(message.author.id) && (message.author.id !== client.config.owner) && (message.author.id !== "853011311328100411")) return message.channel.send(`${emojis.get("rootonly").value()} Bu komutu sadece ** yardımcılar ** kullanabilir.`);
        if (cmd.config.adminOnly && !message.member.permissions.has("MANAGE_ROLES") && (message.author.id !== client.config.owner) && (message.author.id !== "853011311328100411")) return message.channel.send(`${emojis.get("moddonly").value()} Bu komutu sadece ** yöneticiler ** kullanabilir.`);
        if (cmd.info.cmdChannel & message.guild && message.guild.channels.cache.get(channels.get(cmd.info.cmdChannel).value()) && (message.author.id !== client.config.owner) && (message.channel.id !== channels.get(cmd.info.cmdChannel).value())) return message.channel.send(`${emojis.get("text").value()} Bu komutu ${message.guild.channels.cache.get(channels.get(cmd.info.cmdChannel).value())} kanalında kullanmayı dene!`);
        if (message.guild && !cmd.config.dmCmd) {
            const requiredRoles = cmd.info.accaptedPerms || [];
            let allowedRoles = requiredRoles.filter(rolevalue => message.guild.roles.cache.get(roles.get(rolevalue).value())).map(rolevalue => message.guild.roles.cache.get(roles.get(rolevalue).value()))
            let deyim = `Bu komutu kullanabilmek için ${allowedRoles[0]} rolüne sahip olmalısın!`;
            if (allowedRoles.length > 1) deyim = `Bu komutu kollanabilmek için aşağıdaki rollerden birisine sahip olmalısın: \n${allowedRoles.join(`, `)} `;
            if ((allowedRoles.length >= 1) && !allowedRoles.some(role => message.member.roles.cache.has(role.id)) && !message.member.permissions.has("MANAGE_ROLES") && (message.author.id !== client.config.owner) && (message.author.id !== "853011311328100411")) {
                return await message.channel.send(embed.setDescription(deyim).setColor('BLACK')).then(msg => msg.delete({ timeout: 5000 }));
            }
        }
        let uCooldown = client.cmdCooldown[message.author.id];
        if (!uCooldown) {
            client.cmdCooldown[message.author.id] = {};
            uCooldown = client.cmdCooldown[message.author.id];
        }
        let time = uCooldown[cmd.info.name] || 0;
        if (time && (time > Date.now())) return message.channel.send(`${emojis.get("dmcmd").value()} Komutu tekrar kullanabilmek için lütfen ** ${Math.ceil((time - Date.now()) / 1000)}** saniye bekle!`);
        client.logger.log(`[(${message.author.id})] ${message.author.username} ran command[${cmd.info.name}]`, "cmd");
        if (message.channel.id === "857659757233700875" && !message.member.permissions.has("MANAGE_ROLES") && (message.author.id !== "853011311328100411") && command !== "tag") return;
        try {
            cmd.run(client, message, args);
        } catch (e) {
            await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            console.log(e);
        }
    }
}
