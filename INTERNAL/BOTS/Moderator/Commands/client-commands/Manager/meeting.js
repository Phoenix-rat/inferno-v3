const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');

class Meeting extends Command {
    constructor(client) {
        super(client, {
            name: "toplantı",
            description: "Belirtilen segmenteki istatistiklerini gösterir",
            usage: "toplantı",
            examples: ["toplantı"],
            category: "Düzen",
            aliases: ["meeting", "toplanti"],
            accaptedPerms: ["root", "owner", "cmd-ceo"],
            cooldown: 10000
        })
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const meetingemb = new Discord.MessageEmbed().setColor("BLACK").setTimestamp().setFooter(`• Kahve sizi seviyor 🌟`).setThumbnail(message.member.user.displayAvatarURL({ dynamic: true })).setColor(messsage.member.user.displayHexColor).setTitle("† Dante's INFEЯИO");

if (!args[0] || (args[0] !== 'katıldı' && args[0] !== 'muteall')) 
        return message.channel.send(meetingemb.setDescription(`
        ───────────────────
        • .toplantı katıldı Toplantı odasındaki üyelere katıldı permini verir.
        • .toplantı sustoplantı Toplantı odasındaki üyeleri susturur.
        • .toplantı konuspublic Toplantı odasındaki üyelerin susturmasını açar.
        ───────────────────
        `)).then(msg => msg.delete({ timeout: 10000 }));

        if (args[0] === 'katıldı') {
    let joined = message.member.voice.channel.members.filter(member => !member.roles.cache.has(roles.get("katıldı perm gelcek").value())).array();
    joined.forEach((member, fast) => {
        setTimeout(async() => {
            member.roles.add(roles.get("katıldı perm gelcek").value()).catch();
        }, fast * 750)
    })
    return message.channel.send(`Toplantı Odasında bulunan toplam \`${katıldı.size}\` kişiye rolü dağtımaya başaldım!`)
        }

        if (args[0] === 'sustoplantı') {
  if(!message.member.voice.channel.id) return message.channel.send(`Bir ses kanalında değilsin.`)
  let MutedMembers = message.guild.channels.cache.get(message.member.voice.channel.id).members.array().filter(x => x.id !== message.member.id);
  MutedMembers.forEach((x, y) => {
    setTimeout(async () => {
      x.voice.setMute(true)
    }, y * 200)
  })
  await message.channel.send(`Toplantı kanalındaki (\`${MutedMembers.length}\`) adet kişi susturuldu!`)
        }

        if (args[0] === 'konuspublic') {
  if(!message.member.voice.channel.id) return message.channel.send(`Bir ses kanalında değilsin.`)
  let MutedMembers = message.guild.channels.cache.get(message.member.voice.channel.id).members.array().filter(x => x.id !== message.member.id);
  MutedMembers.forEach((x, y) => {
    setTimeout(async () => {
      x.voice.setMute(false)
    }, y * 200)
  })
  await message.channel.send(`Toplantı kanalındaki (\`${MutedMembers.length}\`) adet kişinin susturması kaldırıldı!`)
        }
    }
}
module.exports = Meeting;