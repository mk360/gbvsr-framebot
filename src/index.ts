import { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import dotenv from "dotenv";
import resolveCharacter from "./resolve-character";

const [,, dev] = process.argv;

const isDev = dev === "dev";

dotenv.config({
    path: "../.env"
});

const TOKEN = process.env.BOT_TOKEN;

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds
    ]
});

const command = new SlashCommandBuilder();
command.setName("framedata");
command.setDescription("Display the basic frame data of a character's move.");

const characterName = new SlashCommandStringOption();
characterName.setRequired(true);
characterName.setName("character");
characterName.setDescription("The character you'd like the frame data of.");

command.addStringOption(characterName);

const moveName = new SlashCommandStringOption();
moveName.setRequired(true);
moveName.setName("move");
moveName.setDescription("Move name, or input of the move you'd like the frame data of.");

command.addStringOption(moveName);

const rest = new REST().setToken(TOKEN);

async function onReadyDev() {
    console.log("DEV bot ready");
    await rest.post(Routes.applicationGuildCommands(bot.user.id, process.env.DEV_GUILD_ID), { body: command.toJSON() });
}

async function onReadyProd() {
    console.log("PROD bot ready");
    const guilds = await bot.guilds.fetch();
    const guildIds: string[] = [];
    guilds.each((guild) => {
        guildIds.push(guild.id);
    });
    const withoutDev = guildIds.filter((i) => i !== process.env.DEV_GUILD_ID);
    Promise.all(withoutDev.map((guildId) => {
        return rest.post(Routes.applicationGuildCommands(bot.user.id, guildId), { body:
            command.toJSON()
        });
    }));
}

bot.on(Events.ClientReady, isDev ? onReadyDev : onReadyProd);

bot.on(Events.InteractionCreate, function(interaction) {
    console.log(interaction);
    if (interaction.isChatInputCommand()) {
        const characterName = interaction.options.get("character").value.toString();
        const resolved = resolveCharacter(characterName);
        console.log({ characterName, resolved });
        if (resolved[0]) {
            interaction.reply({
                content: resolved
            });
        } else {
            interaction.reply({
                content: "No match found"
            });
        }
    }
});


bot.login(TOKEN);

