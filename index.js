require("dotenv").config();

const { REST, Routes } = require("discord.js");
const deployCommands = async () => {
    //Deploy Command Logic
}

const {
    Client, 
    GatewayIntentBits,
    Partials,
    Collection, 
    ActivityType, 
    PresenceUpdateStatus,
    Events
} = require("discord.js");

const client = new Client({
    intent: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember
    ]
});

client.commands = new Collection();

const fs = require("fs");
const path = require("path");


const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`The command ${filePath} is missing a required "data" or "execute" property.`)
    }

}

client.once(Events.ClientReady, async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);


    await deployCommands();
    console.log(`Commands deployed globally`)


    const statusType = process.env.BOT_STATUS || "online";
    const activityType = process.env.ACTIVITY_TYPE || "PLAYING";
    const activityName = process.env.ACTIVITY_NAME || "Discord";

    const activityTypeMap = {
        "PLAYING": ActivityType.Playing,
        "WATCHING": ActivityType.Watching,
        "LISTENING": ActivityType.Listening,
        "STREAMING": ActivityType.Streaming,
        "COMPETING": ActivityType.Competing
    };

    const statusMap = {
        "online": PresenceUpdateStatus.Online,
        "idle": PresenceUpdateStatus.Idle,
        "dnd": PresenceUpdateStatus.DoNotDisturb,
        "invisible": PresenceUpdateStatus.Invisible
    };

    client.user.setPresence({
        status: statusMap[statusType],
        activities: [{
            name: activityName,
            type: activityTypeMap[activityType]
        }]
    });

    console.log(`Bot status set to ${statusType}`);
    console.log(`Activity set to ${activityType} ${activityName}`)
});


client.on(Event.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) {
        // console.error(`No commands matching ${interaction.commandName} was found`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true});
        } else {
            await interaction.reply({content: "There was an error while executing this command", ephemeral: true});
        }
    }
});

client.login(process.env.BOT_TOKEN);
