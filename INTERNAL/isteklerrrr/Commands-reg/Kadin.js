const kayitData = require("../Datebase/Register.js")
const config = require("../../../Settings/guild.js")
exports.execute = async (client, message, args) => {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!member) return message.react(client.emoji("red")).catch(() => { })

    let memberData = await kayitData.findOne({_id: member.id})
    let isim = args[1];
    let yaş = Number(args[2]);

    if (!isim && !yaş) {
        if (!member.nickname || !member.nickname.includes("|")) return message.inlineReply({ content: "Lütfen geçerli bir **isim yaş** belirtiniz." })
        if (member.nickname.includes("|") && member.nickname.split("| ")[1]) yaş = member.nickname.includes("|") && member.nickname.split("| ")[1]
        if (member.nickname.includes("|") && member.nickname.split(" |")[0]) isim = member.nickname.includes("|") && member.nickname.split(" |")[0]
        member.roles.add(client.role("regWoMans")).catch(() => { })
        member.roles.remove(client.role("regUnreg")).catch(() => { })
        message.react(client.emoji("okey")).catch(() => { })
        
        if(!memberData) {
            await kayitData.findOneAndUpdate({_id: member.id}, { $set: { isimgecmisi:  [{ isim: `${isim} | ${yaş}`, type: `Kadın`}]  }}, {upsert:true})
            await kayitData.findOneAndUpdate({_id: message.author.id}, {$inc: {toplamkayit: 1, kadinkayit: 1} }, {upsert:true})
        }
    } else {
        if (member.user.username.includes(config.tag)) {
            await member.setNickname(`${config.tag} ${isim.charAt(0).toUpperCase() + isim.slice(1).toLowerCase()}${yaş ? ` | ${yaş}` : ``}`).catch(() => { });
            member.roles.add(client.role("regWoMans")).catch(() => { })
            member.roles.add(client.role("regTagliRole")).catch(() => { })

            member.roles.remove(client.role("regUnreg")).catch(() => { })
            message.react(client.emoji("okey")).catch(() => { })
            if(!memberData) {
                await kayitData.findOneAndUpdate({_id: member.id}, { $set: { isimgecmisi:  [{ isim: `${config.tag} ${isim} | ${yaş}`, type: `Kadın`}]  }}, {upsert:true})
                await kayitData.findOneAndUpdate({_id: message.author.id}, {$inc: {toplamkayit: 1, kadinkayit: 1} }, {upsert:true})
            }
        } else {
            await member.setNickname(`${config.untag} ${isim.charAt(0).toUpperCase() + isim.slice(1).toLowerCase()}${yaş ? ` | ${yaş}` : ``}`).catch(() => { });
            member.roles.add(client.role("regWoMans")).catch(() => { })
            member.roles.remove(client.role("regUnreg")).catch(() => { })
            message.react(client.emoji("okey")).catch(() => { })
            if(!memberData) {
                await kayitData.findOneAndUpdate({_id: member.id}, { $set: { isimgecmisi:  [{ isim: `${config.untag} ${isim} | ${yaş}`, type: `Kadın`}]  }}, {upsert:true})
                await kayitData.findOneAndUpdate({_id: message.author.id}, {$inc: {toplamkayit: 1, kadinkayit: 1} }, {upsert:true})
            }
        }
    }
}
exports.conf = {
    command: "kız",
    description: "Sunucuda belirtilen sebepten dolayı afk kalırsınız.",
    aliases: ["k", "kadin", "kadın", "kiz", "woman", "wman"],
    timeout: "7000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner","cmdRegister"]
}
