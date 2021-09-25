const alarm = require("../../Datebase/Alarm.js");
const ms = require("ms");
const moment = require("moment");

exports.execute = async (client, message, args) => {
    let sahtezaman = args[0]
    if (!sahtezaman || isNaN(ms(sahtezaman))) return message.react(client.emoji("red")).catch(() => { })

    let reason = args.slice(1).join(" ")
    let link = /h?t?t?p?s?:?\/?\/?discord.?gg\/?[a-zA-Z0-9]+/
    let reklam = /h?t?t?p?s?:?\/?\/?discorda?p?p?.?com\/?invites\/?[a-zA-Z0-9]+/
    if (link.test(message.content) == true) return message.react(client.emoji("red")).catch(() => { })
    if (reklam.test(message.content) == true) return message.react(client.emoji("red")).catch(() => { })
    if (message.content.includes("@everyone")) return message.react(client.emoji("red")).catch(() => { })
    if (message.content.includes("@here")) return message.react(client.emoji("red")).catch(() => { })
    await alarm.findOneAndUpdate({ _id: message.author.id }, { $set: { alarm: true, reason: reason, sahte: sahtezaman,kanal: message.channel.id, date: Date.now() + ms(sahtezaman) } }, { upsert: true })
    let zamanim = moment(Date.now() + ms(sahtezaman)).fromNow()
    message.inlineReply(`${message.member} sana **${sahtezaman.replace(`s`, ` Saniye`).replace(`m`, ` Dakika`).replace(`h`, ` Saat`).replace(`d`, ` Gün`)}** sonra hatırlatacağım.`).catch(() => { })
    await message.react("⏰").catch(() => { })

}
exports.conf = {
    command: "alarm",
    description: "Belirtilen kullanıcıyı olduğun ses kanalına taşır.",
    aliases: ["alarm"],
    timeout: "10000"
}