const Discord = require('discord.js');
exports.execute = async (client, message, args) => {


    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

    if (!member) {
        if (!args[0] || (args[0] && isNaN(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.react(client.emoji("red")).catch(() => { })

        message.channel.bulkDelete(Number(args[0])).then(msg => message.inlineReply(`${message.channel} Kanalından **${msg.size}** adet mesaj temizlendi!`)).catch(() => { })
        await message.delete({ timeout: 400 }).catch(() => { })
    } else {

        if (!args[1] || (args[1] && isNaN(args[1])) || Number(args[1]) < 1 || Number(args[1]) > 100) return message.react(client.emoji("red")).catch(() => { })

        let messages = message.channel.messages.fetch({ limit: args[1] })

        let memberMessage = (await messages).filter((s) => s.author.id === member.id)

        await message.channel.bulkDelete(memberMessage).then(msg => message.inlineReply(`${member} Kullanıcısına ait **${msg.size}** adet mesaj temizlendi!`)).catch(() => { })
        await message.delete({ timeout: 400 }).catch(() => { })

    }
}

exports.conf = {
    command: 'clear',
    description: 'İstediğiniz kadar mesaj siler',
    aliases: ['delete', "sil", "temizle"],
    timeout: "10000",
cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner"]

}
