module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(command, promise, ctx) {

        this.client.logger.log(`Runned Command: ${command.commandName}`, "cmd");

    }
}
