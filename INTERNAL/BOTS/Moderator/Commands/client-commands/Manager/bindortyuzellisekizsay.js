const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');

class BinDortYuzElliSekiz extends Command {

    constructor(client) {
        super(client, {
            name: "bindortyuzellisekizsay",
            description: "1458 Üyelerine özel rol verir.",
            usage: "bindortyuzellisekiz",
            examples: ["bindortyuzellisekizsay"],
            category: "Yetkili",
            aliases: ["1458say"],
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let yt = ["347486448121020423", "578631262009425939"]
        if (yt.find(a => message.author.id !== a)) return

        let yazitag = message.guild.members.cache.filter(m => m.user.username.includes("Rîff")).size;
        let sayitag = message.guild.members.cache.filter(m => m.user.discriminator == "1458").size;

        let böyle = message.guild.memberCount;
        let gitme = `${yazitag} + ${sayitag}`
        let ağlarım = await message.guild.members.cache.filter(m => m.roles.cache.has("870076552610717706") && m.presence.status !== 'offline').size;
        let relax = await message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("booster").value())).size;

        const saranembed = new MessageEmbed().setColor("BLACK").setFooter(`• Stark ❤ INFEЯИO † ❤ 1458`, message.author.displayAvatarURL({ dynamic: true }));
        const obj = {};
        for (let index = 0; index < message.guild.channels.cache.filter(c => c.type === "voice").array().length; index++) {
            const myChannel = message.guild.channels.cache.filter(c => c.type === "voice").array()[index];
            const key = obj[client.getPath(channels.value(), myChannel.parentID)] || 0;
            obj[client.getPath(channels.value(), myChannel.parentID)] = key + myChannel.members.size
        }
        const lang = {
            "st_public": "Public",
            "st_private": "Private",
            "st_registry": "Kayıt",
            "st_crew": "Yetkili",
            "st_dc": "DC",
            "st_tabu": "Tabu",
            "st_gartic": "Gartic",
            "st_konser": "Konser",
            "st_vk": "VK",
            "st_kk": "Kırmızı Koltuk",
            "st_amgus": "Amoung Us",
            "st_benkimim": "Ben Kimim",
            "st_paranormal": "Paranormal",
        }
        const sesler = Object.keys(obj).filter(k => lang[k]).filter(k => obj[k] >= 10).sort((a, b) => obj[b] - obj[a]).slice(0, 3);
        const deyim = sesler.map(k => `${lang[k]} \`${obj[k]}\``).join(', ');
        await message.channel.send(saranembed.setDescription(stripIndent`
       ${emojis.get("kahvehac").value()} Aktif olan \`${ağlarım}\` üye var.
       ${emojis.get("kahvehac").value()} Ekip Tagımızı taşıyarak bize destek olan \`${gitme}\` üye var.
        `));

    }
}
module.exports = BinDortYuzElliSekiz;