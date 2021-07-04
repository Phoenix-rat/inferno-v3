module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(command, promise, ctx) {

        this.client.logger.log(`Unregistered Command: ${command.commandName}`, "cmd");

    }
}
