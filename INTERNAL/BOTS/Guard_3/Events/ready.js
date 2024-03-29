class Ready {

    constructor(client) {
        this.client = client;
    }

    async run(client) {
        client = this.client;
        client.logger.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        await client.user.setPresence({activity: client.config.status, status: "dnd"});
        client.owner = client.users.cache.get(client.config.owner);
    }
}
module.exports = Ready;