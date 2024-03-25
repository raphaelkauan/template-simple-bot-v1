const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const dotenv = require("dotenv");
dotenv.config();
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// Importação dos comandos
const fs = require("node:fs");
const path = require("node:path");
const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const commands = require(filePath);
    if ("data" in commands && "execute" in commands) {
        client.commands.set(commands.data.name, commands);
    } else {
        console.log("Error!");
    }
    console.log(commands);
}

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Bot online!`);
});

client.login(BOT_TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error("Comando não encontrado!");
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error);
    }
});
