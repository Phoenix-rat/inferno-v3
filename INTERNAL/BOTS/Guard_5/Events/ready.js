class Ready {

    constructor(client) {
        this.client = client;
    }

    async run(client) {
        client = this.client;
        const guild = client.guilds.cache.get(client.config.server);
        client.logger.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        client.user.setPresence({ activity: client.config.status, status: "dnd" });
        client.owner = client.users.cache.get(client.config.owner);
    }
}
module.exports = Ready;