const { REST, Routes } = require("discord.js");

const dotenv = require("dotenv");
const { error } = require("node:console");
dotenv.config();
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// Importação dos comandos
const fs = require("node:fs");
const path = require("node:path");
const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

// Deploy
(async () => {
    try {
        const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
        console.log("Comando registrado!");
    } catch (error) {
        console.error(error);
    }
})();
