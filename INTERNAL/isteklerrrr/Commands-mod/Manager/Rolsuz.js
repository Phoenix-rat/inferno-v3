let { MessageEmbed } = require("discord.js")
module.exports.execute = async (client, message, args) => {

  let rolsuz = message.guild.members.cache.filter(a => a.roles.cache.size <= 1)

  if(rolsuz.size == 0) return message.channel.send(`\`\`\`Sunucumuzda rolsüz üye bulunmamakta.\`\`\``)

  await rolsuz.forEach(member => {
      member.roles.add(client.role("regUnreg")).catch(() => {})
  });

  await message.channel.send(`\`\`\`Herhangi bir rolü olmayan ${rolsuz.size} kişiye kayıtsız rolü verildi.\`\`\``)


}
exports.conf = {
    command: "rolsuz",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["rolsüz"],
    timeout: "7000",
cmdPerms: ["cdmCeo","cmdOwner"]
}
